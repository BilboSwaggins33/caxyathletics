import React, { useState, useEffect, useRef } from "react";
import {
  View, StyleSheet, Text, ScrollView, Dimensions, Button, TouchableOpacity, Pressable, Image, Alert, AppState
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNLocation from 'react-native-location';
import * as Font from 'expo-font'
import { MontserratFont } from "../assets/fonts";
import Header from "../Components/Header";
import EventView from "../Components/EventView";
import { Portal, ActivityIndicator, Modal } from "react-native-paper";
import InGame from "./InGame";
import { coords } from "../Data/coordinates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment'
import { useSelector, useDispatch } from "react-redux";

import {
  setMaxPoints, setPoints, setLocation
} from "../redux/actions";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { getAuth } from "@firebase/auth";
function inside(point, vs) {
  var x = point[0],
    y = point[1];
  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];
    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export default function CheckIn() {
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const db = getDatabase();
  const auth = getAuth();
  const { points } = useSelector((state) => state.userReducer);
  const [inLocation, setInLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [inGame, setInGame] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [location, setLocation] = useState(null)
  const [tempCoords, setTempCoords] = useState([])
  const maxPoints = 1000;
  const user = auth.currentUser;
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true)
  }

  RNLocation.configure({
    distanceFilter: 5.0,
    desiredAccuracy: {
      ios: "bestForNavigation",
      android: "balancedPowerAccuracy"
    },
    activityType: "other",
    allowsBackgroundLocationUpdates: true,
    headingFilter: 1, // Degrees
    headingOrientation: "portrait",
    pausesLocationUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
  })

  const recordStartTime = async () => {
    try {
      const now = moment().format("HH:mm:ss");
      await AsyncStorage.setItem("@start_time", now);
    } catch (err) {
      // TODO: handle errors from setItem properly
      console.warn(err);
    }
  };

  const getElapsedTime = async () => {
    try {
      const startTime = await AsyncStorage.getItem("@start_time");
      const now = moment().format("HH:mm:ss");
      const d = moment.utc(moment(now, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss"))).format("HH:mm:ss")
      setElapsed(d)
      return d
    } catch (err) {
      // TODO: handle errors from setItem properly
      console.warn(err);
    }
  };


  useEffect(() => {
    RNLocation.requestPermission({
      ios: "always",
      android: {
        detail: "coarse"
      }
    }).then(granted => {
      if (!granted) {
        alert("Permission to always access location in background was denied.")
        return
      }
    })

    loadFont();
  }, []);


  useEffect(() => {
    timeInt = setInterval(() => { getElapsedTime() }, 500);
    return () => {
      clearInterval(timeInt);
    };
  }, []);

  _startUpdatingLocation = () => {
    let counter = 0;
    locationSubscription = RNLocation.subscribeToLocationUpdates(
      locations => {
        //console.log(locations[0].latitude, locations[0].longitude)
        counter++;
        console.log(counter)
        if (counter == 10) {
          //setTempCoords([101, 0])
          CheckInGame(false)
          _stopUpdatingLocation()
        }
        if (!inside(tempCoords, coords[location].borders)) {
          CheckInGame(false)
          _stopUpdatingLocation()
        }
      }
    );
  };

  _stopUpdatingLocation = () => {
    locationSubscription && this.locationSubscription();
    //setLocation(null);
  };



  const CheckInGame = async (x) => {
    setInGame(x)
    if (x) {
      recordStartTime()
    } else {
      let t = await getElapsedTime()
      let seconds = t.split(':').reverse().reduce((el, a, index) => el + (Number(a) * Math.pow(60, index)), 0)
      console.log('seconds elapsed:', seconds)
      changePoints(Math.round(seconds))
      updatePoints(Math.round(seconds))
    }
  };

  function changePoints(n) {
    //console.log("changed points by", n);
    let total = points + n;
    if (total < maxPoints) {
      //console.log(total);
      dispatch(setPoints(points, n));
    } else {
      dispatch(setMaxPoints(maxPoints));
    }
  }
  async function checkLocation() {
    setIsLoading(true)
    setTempCoords([50, 50])
    // let currentCoords = RNLocation.getLatestLocation({ timeout: 60000 }).then(latestLocation => {
    //   return [latestLocation.latitude, latestLocation.longitude]
    // })
    let currentCoords = [50, 50]

    for (let i = 0; i < coords.length; i++) {
      if (
        inside(
          currentCoords,
          coords[i].borders
        )
      ) {
        //console.log(`is inside ${coords[i].name}`);
        setInLocation(true);
        setLocation(i)
        setIsLoading(false)
        return;
      }
    }
    //setInLocation(true)
    //setInLocation(false)
    //setInGame(false)
    setIsLoading(false)
    return;
  }


  function updatePoints(n) {
    let total = points + n
    if (total < maxPoints) {
      update(ref(db, 'users/' + user.uid), {
        points: total,
      }).then(() => { console.log('points saved successfully') })
    } else {
      update(ref(db, "users/" + user.uid), {
        points: maxPoints,
      });
    }
  }

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView style={styles.scroll} stickyHeaderIndices={[0]}>
          <Header />
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <Image
                style={styles.headerIcon}
                source={require("../assets/icons8-schedule-48.png")}
              />
              <Text style={styles.headerText}>Event</Text>
            </View>
          </View>

          {isLoading ? (
            <View>
              <View style={styles.eventView}>
                <ActivityIndicator
                  animating={isLoading}
                  color={"#F37121"}
                  size={"large"}
                />
              </View>
              <TouchableOpacity onPress={checkLocation}>
                <View style={styles.checkInBtn}>
                  <Image
                    style={styles.checkInIcon}
                    source={require("../assets/icons8-paper-plane-48.png")}
                  />
                  <Text style={styles.checkInText}>Get Location</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : !inLocation ? (
            <View>
              <View style={styles.eventView}>
                <View style={{ margin: 30 }}>
                  <Text style={{ fontFamily: 'Montserrat-Medium', textAlign: 'center' }}></Text>
                </View>
              </View>
              <TouchableOpacity onPress={checkLocation}>
                <View style={styles.checkInBtn}>
                  <Image
                    style={styles.checkInIcon}
                    source={require("../assets/icons8-paper-plane-48.png")}
                  />
                  <Text style={styles.checkInText}>Get Location</Text>
                </View>
              </TouchableOpacity>

            </View>
          ) : !inGame ? (
            <View>
              <EventView />
              <TouchableOpacity onPress={() => { CheckInGame(true); _startUpdatingLocation() }}>
                <View style={styles.checkInBtn}>
                  <Image
                    style={styles.checkInIcon}
                    source={require("../assets/icons8-paper-plane-48.png")}
                  />
                  <Text style={styles.checkInText}>Check In</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setInLocation(false)}>
                <View style={styles.checkInBtn}>
                  <Text style={styles.checkInText}>Leave</Text>
                </View>
              </TouchableOpacity>
            </View>

          ) : (
            <View>
              <View style={styles.eventView}>
                <Text> Checked in! Enjoy the game!</Text>
                <Text>{elapsed}</Text>

              </View>
              <TouchableOpacity onPress={() => { CheckInGame(false); _stopUpdatingLocation() }}>
                <View style={styles.checkInBtn}>
                  <Text style={styles.checkInText}>Stop Timer</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    );
  }
}

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#F6F4F4",
    flex: 1,
  },

  scroll: {
    backgroundColor: "#F6F4F4",
    flex: 1,
    marginBottom: -50,
  },

  sectionContainer: {
    marginBottom: 10,
  },

  headerContainer: {
    marginLeft: 25,
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 12,
    alignItems: "center",
  },

  headerIcon: {
    maxWidth: 24,
    maxHeight: 24,
  },

  headerText: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#3E3939",
    marginLeft: 10,
  },

  eventView: {
    width: width - 50,
    height: 400,
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 25,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  checkInBtn: {
    backgroundColor: "#F37121",
    width: width - 70,
    height: 50,
    marginLeft: 35,
    margin: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  checkInIcon: {
    width: 36,
    height: 36,
    tintColor: "white",
  },

  checkInText: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    paddingLeft: 5,
  },
});





