import React, { useState, useEffect, useRef } from "react";
import {
  View, StyleSheet, Text, ScrollView, Dimensions, Button, TouchableOpacity, Pressable, Image, Alert, AppState
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from 'expo-font'
import { MontserratFont } from "../assets/fonts";
import Header from "../Components/Header";
import EventView from "../Components/EventView";
import { Portal, ActivityIndicator, Modal } from "react-native-paper";
import InGame from "./InGame";
import { coords } from "../Data/coordinates";
import * as TaskManager from 'expo-task-manager';
import * as Location from "expo-location";
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment'
import { useSelector, useDispatch } from "react-redux";
import {
  setMaxPoints, setPoints, setLocation
} from "../redux/actions";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { getAuth } from "@firebase/auth";
import * as Permissions from 'expo-permissions'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

var signedin_location;
var interval;
const TASK_NAME = 'background-fetch'
const trackLocation = async () => {
  let location = await Location.getCurrentPositionAsync();
  console.log(location.coords.latitude, location.coords.longitude)
  console.log(coords.find(x => x.name == signedin_location))
  if (!inside([location.coords.latitude, location.coords.longitude], coords.find(x => x.name == signedin_location).borders)) {
    console.log('not inside', signedin_location)
    signedin_location = ""
  }
}
TaskManager.defineTask(TASK_NAME, () => {
  // fetch data here...
  interval = setInterval(async () => {
    trackLocation()
  }, 5000);

})

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
  var timeInt;
  const maxPoints = 1000;
  const user = auth.currentUser;
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true)
  }

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
      if (signedin_location === "") {
        console.log("NOT ANYWHERE!!!!")
      }
      setElapsed(d)
      return d
    } catch (err) {
      // TODO: handle errors from setItem properly
      console.warn(err);
    }
  };
  const handleAppStateChange = async (nextAppState) => {
    if (appState.current.match(/inactive|background/) &&
      nextAppState === "active") {

      // We just became active again: recalculate elapsed time based 
      // on what we stored in AsyncStorage when we started.
      const elapsed = await getElapsedTime();
      // Update the elapsed seconds state
      setElapsed(elapsed);
    }
    appState.current = nextAppState;
  };
  useEffect(() => {
    timeInt = setInterval(() => { getElapsedTime() }, 500);
    return () => {
      clearInterval(timeInt);
    };
  }, []);
  useEffect(() => {

    const checkPermissions = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access foreground location was denied");
        }

        let backPerm = await Location.requestBackgroundPermissionsAsync();
        //console.log(status)

        const subscription = AppState.addEventListener("change", handleAppStateChange);
        return () => subscription.remove();

      } catch (error) {
        let status = Location.getProviderStatusAsync();
        if (!(await status).locationServicesEnabled) {
          alert("Enable Location Services");
        }
      }
    }
    checkPermissions();
    loadFont();
  }, []);


  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const reg = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    console.log('status:', status, 'task registered?', reg)
  };

  const RegisterBackgroundTask = async () => {
    try {
      return BackgroundFetch.registerTaskAsync(TASK_NAME)
    } catch (err) {
      console.log("Task Register failed:", err)
    }
  }

  const unregisterBackgroundFetchAsync = async () => {
    return BackgroundFetch.unregisterTaskAsync(TASK_NAME);
  }

  const CheckInGame = async (x) => {
    setInGame(x)
    if (x) {
      recordStartTime()
      await RegisterBackgroundTask()
    } else {
      let t = await getElapsedTime()
      let seconds = t.split(':').reverse().reduce((el, a, index) => el + (Number(a) * Math.pow(60, index)), 0)
      console.log('seconds elapsed:', seconds)
      changePoints(Math.round(seconds))
      updatePoints(Math.round(seconds))
      clearInterval(interval)
      await unregisterBackgroundFetchAsync()
    }
    checkStatusAsync();
  };

  function changePoints(n) {
    //console.log("changed points by", n);
    let total = points + n;
    if (total < maxPoints) {
      //console.log(total);
      dispatch(setPoints(points, n));
      // eventualy change updatePoints to timer
      //updatePoints(total);
    } else {
      dispatch(setMaxPoints(maxPoints));
      // updatePoints(maxPoints);
    }
  }
  async function checkLocation() {
    setIsLoading(true)
    let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    console.log('[', loc.coords.latitude, ',', loc.coords.longitude, '],');
    for (let i = 0; i < coords.length; i++) {
      if (
        inside(
          [loc.coords.latitude, loc.coords.longitude],
          coords[i].borders
        )
      ) {
        //console.log(`is inside ${coords[i].name}`);
        signedin_location = coords[i].name
        console.log('is inside', signedin_location)
        setInLocation(true);
        setIsLoading(false)
        return;
      }
    }
    // signedin_location = "room"
    // setInLocation(true)
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
              <TouchableOpacity onPress={() => { checkLocation() }}>
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
                  <Text style={{ fontFamily: 'Montserrat-Medium', textAlign: 'center' }}>You are not at one of the game locations or there is no
                    game currently scheduled at this location.</Text>
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
              <TouchableOpacity onPress={() => { CheckInGame(true) }}>
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
              <TouchableOpacity onPress={() => { CheckInGame(false) }}>
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





