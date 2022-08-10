import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Button,
  TouchableOpacity,
  Image,
  LogBox,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNLocation from "react-native-location";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import Header from "../Components/Header";
import EventView from "../Components/EventView";
import { Portal, ActivityIndicator, Modal } from "react-native-paper";
import InGame from "./InGame";
import { coords } from "../Data/coordinates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { setMaxPoints, setPoints, setLocation } from "../redux/actions";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import BackgroundTimer from "react-native-background-timer";
import Carousel, { Pagination } from "react-native-snap-carousel";
import BackgroundGeolocation, { Location, Subscription } from "react-native-background-geolocation";
function inside(point, vs) {
  var x = point[0],
    y = point[1];
  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];
    var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
]);
export default function CheckIn() {
  const dispatch = useDispatch();
  const db = getDatabase();
  const auth = getAuth();
  const { points } = useSelector((state) => state.userReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [tempCoords, setTempCoords] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [enabled, setEnabled] = React.useState(false);
  const [location, setLocation] = React.useState("");
  const r = useRef(null);
  const maxPoints = 1000;
  const user = auth.currentUser;
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }

  useEffect(() => {
    loadFont();
  }, []);
  useEffect(() => {
    onValue(ref(db, "events/" + new Date().toISOString().slice(0, 10)), (snapshot) => {
      if (snapshot.exists()) {
        setEvents(snapshot.val());
      } else {
        setEvents([
          {
            title: "No Events for Today",
            time: "Have a nice day!",
            location: "Lake Forest Academy",
            facility: "Crown",
          },
        ]);
      }
    });
  }, []);
  React.useEffect(() => {
    /// 1.  Subscribe to events.
    const onLocation = BackgroundGeolocation.onLocation((location) => {
      console.log("[onLocation]", location);
      setLocation(JSON.stringify(location, null, 2));
    });

    const onMotionChange = BackgroundGeolocation.onMotionChange((event) => {
      console.log("[onMotionChange]", event);
    });

    const onActivityChange = BackgroundGeolocation.onActivityChange((event) => {
      console.log("[onMotionChange]", event);
    });

    const onProviderChange = BackgroundGeolocation.onProviderChange((event) => {
      console.log("[onProviderChange]", event);
    });

    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      locationAuthorizationRequest: "Always",
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
      distanceFilter: 1,
      preventSuspend: true,
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true,
      showsBackgroundLocationIndicator: true,
      stationaryRadius: 1,
    }).then((state) => {
      setEnabled(state.enabled);
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
    });

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  }, []);

  const startValue = useRef(new Animated.Value(1)).current;
  const transition = (start, end) => {
    startValue.setValue(start);
    Animated.spring(startValue, {
      toValue: end,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation("");
    }
  }, [enabled]);
  RNLocation.configure({
    distanceFilter: 5.0,
    desiredAccuracy: {
      ios: "bestForNavigation",
      android: "balancedPowerAccuracy",
    },
    activityType: "other",
    allowsBackgroundLocationUpdates: true,
    headingFilter: 1, // Degrees
    headingOrientation: "portrait",
    pausesLocationUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
  });

  const recordStartTime = async () => {
    try {
      const now = moment().format("HH:mm:ss");
      await AsyncStorage.setItem("@start_time", now);
      BackgroundTimer.runBackgroundTimer(async () => {
        await getElapsedTime();
      }, 500);
      //rest of c
    } catch (err) {
      // TODO: handle errors from setItem properly
      console.warn(err);
    }
  };

  const getElapsedTime = async () => {
    try {
      const startTime = await AsyncStorage.getItem("@start_time");
      const now = moment().format("HH:mm:ss");
      const d = moment.utc(moment(now, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss"))).format("HH:mm:ss");
      setElapsed(d);
      return d;
    } catch (err) {
      // TODO: handle errors from setItem properly
      console.warn(err);
    }
  };

  _startUpdatingLocation = () => {
    setEnabled(true);
    //locationSubscription = RNLocation.subscribeToLocationUpdates((locations) => {});
  };

  _stopUpdatingLocation = () => {
    //locationSubscription && this.locationSubscription();
    BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.
    setActiveIndex(0);
    setEnabled(false);
    //setLocation(null);
  };

  const CheckInGame = async (x) => {
    if (events[0].title == "No Events for Today") {
      Alert.alert("Sorry, no events have been scheduled for today");
      _stopUpdatingLocation();
      setInGame(false);
    } else if (x) {
      setInGame(x);
      _startUpdatingLocation();
      recordStartTime();
      transition(0.8, 1);
    } else {
      let t = await getElapsedTime();
      let seconds = t
        .split(":")
        .reverse()
        .reduce((el, a, index) => el + Number(a) * Math.pow(60, index), 0);
      console.log("seconds elapsed:", seconds);
      var points = Math.round(seconds / 60);
      changePoints(points);
      updatePoints(points);
      transition(1.2, 1);

      points == 1 ? Alert.alert("You earned " + points + " point!") : Alert.alert("You earned " + points + " points!");
      setInGame(x);
      _stopUpdatingLocation();
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
    setIsLoading(true);
    setTempCoords([50, 50]);
    // let currentCoords = RNLocation.getLatestLocation({ timeout: 60000 }).then(latestLocation => {
    //   return [latestLocation.latitude, latestLocation.longitude]
    // })
    let currentCoords = [50, 50];

    for (let i = 0; i < coords.length; i++) {
      if (inside(currentCoords, coords[i].borders)) {
        //console.log(`is inside ${coords[i].name}`);
        CheckInGame(true);
        setIsLoading(false);
        return;
      }
    }
    setInGame(false);
    setIsLoading(false);
    Alert.alert("You are not in a registered location.");
    return;
  }

  function updatePoints(n) {
    let total = points + n;
    if (total < maxPoints) {
      update(ref(db, "users/" + user.uid), {
        points: total,
      }).then(() => {
        console.log("points saved successfully");
      });
    } else {
      update(ref(db, "users/" + user.uid), {
        points: maxPoints,
      });
    }
  }
  const renderItem = useCallback(({ item, index }) => {
    return <EventView title={item.title} location={item.location} facility={item.facility} time={item.time} />;
  }, []);

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.scroll}>
          <Header />
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <Image style={styles.headerIcon} source={require("../assets/icons8-schedule-48.png")} />
              <Text style={styles.headerText}>Event</Text>
            </View>
          </View>

          {isLoading ? (
            <View>
              <View style={styles.eventView}>
                <ActivityIndicator animating={isLoading} color={"#F37121"} size={"large"} />
              </View>
            </View>
          ) : !inGame ? (
            <View style={{ marginTop: -20 }}>
              <Animated.View
                style={{
                  transform: [{ scale: startValue }],
                }}
              >
                <Carousel
                  ref={r}
                  data={events}
                  renderItem={renderItem}
                  contentContainerCustomStyle={{ marginVertical: 40 }}
                  sliderWidth={500}
                  itemWidth={500}
                  layout={"default"}
                  loop={true}
                  onSnapToItem={(index) => {
                    if (events.length == 1) {
                      setActiveIndex(0);
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                />
                <Pagination
                  animatedDuration={100}
                  dotsLength={events.length}
                  activeDotIndex={activeIndex}
                  tappableDots={true}
                  carouselRef={r}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 2,
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={1}
                />
              </Animated.View>
              <TouchableOpacity
                onPress={() => {
                  checkLocation();
                }}
              >
                <View style={styles.checkInBtn}>
                  <Text style={styles.checkInText}>Check In</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View>
                <Text
                  style={{ fontFamily: "Montserrat-Bold", fontSize: 20, color: "#F37121", alignSelf: "center", marginBottom: 20 }}
                >
                  You are checked in! Enjoy!
                </Text>
                <Animated.View
                  style={{
                    transform: [{ scale: startValue }],
                  }}
                >
                  <EventView
                    title={events[activeIndex].title}
                    location={events[activeIndex].location}
                    facility={events[activeIndex].facility}
                    time={events[activeIndex].time}
                  />
                </Animated.View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 10,
                    padding: 10,
                    borderRadius: 10,
                    marginHorizontal: 50,
                    borderWidth: 0.5,
                    borderColor: "#F37121",
                  }}
                >
                  <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 30, color: "#F37121" }}>{elapsed}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  CheckInGame(false);
                }}
              >
                <View style={styles.checkInBtn}>
                  <Text style={styles.checkInText}>Stop</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    marginBottom: 5,
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
    width: width - 100,
    height: 50,
    marginLeft: 50,
    margin: 20,
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
