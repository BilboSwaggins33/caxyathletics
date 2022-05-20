import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Button,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import Header from "../Components/Header";
import AppLoading from "expo-app-loading";
import EventView from "../Components/EventView";
import { Portal, ActivityIndicator, Modal } from "react-native-paper";
import InGame from "./InGame";
import { coords } from "../Data/coordinates";

export default function CheckIn() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [position, setPosition] = useState("");
  const [visible, setVisible] = useState(false);
  const [inLocation, setInLocation] = useState(null);
  const [inGame, setInGame] = useState(false);

  let [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const hideModal = () => {
    setVisible(false);
    setInLocation(null);
  };
  const containerStyle = { backgroundColor: "white", padding: 20 };

  useEffect(() => {
    (async () => {
      console.log(location);

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access foreground location was denied");
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);

        let backPerm = await Location.requestBackgroundPermissionsAsync();
      } catch (error) {
        let status = Location.getProviderStatusAsync();
        if (!(await status).locationServicesEnabled) {
          alert("Enable Location Services");
        }
      }
    })();
  }, []);

  let text = "Waiting...";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  // return true if user is in a registered location, false otherwise
  function checkLocation() {
    console.log(location);
    // re run the check location
    // first hide location with a text saying "loading..."
    // then renders location
    if (text === "Waiting...") {
      Alert.alert("Please wait till location is fetched");
      return;
    }

    for (let i = 0; i < coords.length; i++) {
      console.log(location.coords.latitude);
      console.log(location.coords.longitude);
      if (
        inside(
          [location.coords.latitude, location.coords.longitude],
          coords[i].borders
        )
      ) {
        console.log(`is inside ${coords[i].name}`);
        setPosition(coords[i].name);
        setInLocation(true);
        return true;
      } else {
        console.log("is not inside any registered location");
        setPosition("Not in any registered location");
      }
    }
    setInLocation(false);
    return false;
  }

  //current point - point (format: [latitude,longitude])
  //vs - rectangle(format array of array of [latitude,longitude])
  //inside([latitude,longitude],[[lat1,long1],[lat2,long2],[lat3,long3],[lat4,long4]])
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
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView style={styles.scroll} stickyHeaderIndices={[0]}>
          <Header />
          <Portal>
            <Modal
              visible={inLocation === false}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}
            >
              <View style={styles.modalView}>
                <Text>
                  Sorry. You are not at one of the game locations or there is no
                  game scheduled right now.
                </Text>
                <Text>{position}</Text>
              </View>
            </Modal>
          </Portal>
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <Image
                style={styles.headerIcon}
                source={require("../assets/icons8-schedule-48.png")}
              />
              <Text style={styles.headerText}>Event</Text>
            </View>
          </View>

          {text === "Waiting..." || inLocation !== true ? (
            <View>
              <View style={styles.eventView}>
                <ActivityIndicator
                  animating={text === "Waiting..."}
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
          ) : (
            <View>
              <EventView />
              <TouchableOpacity>
                <View style={styles.checkInBtn}>
                  <Image
                    style={styles.checkInIcon}
                    source={require("../assets/icons8-paper-plane-48.png")}
                  />
                  <Text style={styles.checkInText}>Check In</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* {inGame === true ? <InGame /> : false} */}
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
    fontFamily: "Montserrat_700Bold",
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
    height: 80,
    marginLeft: 35,
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
    fontFamily: "Montserrat_700Bold",
    fontSize: 24,
    paddingLeft: 5,
  },
});
