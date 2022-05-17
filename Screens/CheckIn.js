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
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light_Italic,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black_Italic,
} from "@expo-google-fonts/montserrat";
import Header from "../Components/Header";
import AppLoading from "expo-app-loading";
import EventView from "../Components/EventView";
import { Portal, ActivityIndicator, Modal } from "react-native-paper";

const coords = [
  {
    name: "Crown",
    borders: [
      [42.24988075579007, -87.89339261296719],
      [42.25005872487502, -87.89301643345081],
      [42.25058052249325, -87.89350056013409],
      [42.25038923755838, -87.8938767396464],
    ],
  },
  {
    name: "Tennis Court",
    borders: [
      [42.249783158798124, -87.89300534067111],
      [42.24944289911095, -87.89268749580225],
      [42.249774722629695, -87.89196189775494],
      [42.25009435889159, -87.89221642691284],
    ],
  },
  {
    name: "Ice Rink",
    borders: [
      [42.25114964121149, -87.89382269040402],
      [42.25137240067373, -87.89335328380511],
      [42.2508857186568, -87.89292313070366],
      [42.25065811483334, -87.893397443991],
    ],
  },
  {
    name: "Track",
    borders: [
      [42.251764539726665, -87.89333968673833],
      [42.252131500902294, -87.89263417835717],
      [42.25081043067839, -87.89248163600449],
      [42.251171751779175, -87.89171129712344],
    ],
  },
  {
    name: "Fields",
    borders: [
      [42.25260314209325, -87.8928761337062],
      [42.251288217572736, -87.89161751093077],
      [42.25380624739553, -87.88999208951793],
      [42.25276284765792, -87.88896361490714],
    ],
  },
  {
    name: "Cressey",
    borders: [
      [42.248437984509756, -87.891794910871],
      [42.24798564172985, -87.89139440799389],
      [42.24873139430831, -87.89113841646419],
      [42.24830044819688, -87.89071314021322],
    ],
  },
  {
    name: "Corbin",
    borders: [
      [42.24802778766503, -87.89130225731088],
      [42.24778647962089, -87.89104284667059],
      [42.24831667636302, -87.8905745301164],
      [42.24810595767858, -87.89043219861462],
    ],
  },
  {
    name: "Atlass",
    borders: [
      [42.24950508874197, -87.89256050612069],
      [42.2497355831767, -87.89199106674774],
      [42.24876393518291, -87.89186031933885],
      [42.24896896306967, -87.89138894052255],
    ],
  },
];

// start location + timer component + check to see if there is a game or not
function checkInGame() {
  return true;
}

export default function CheckIn() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [position, setPosition] = useState("");
  const [visible, setVisible] = useState(false);
  const [inLocation, setInLocation] = useState(null);

  let [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light_Italic,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black_Italic,
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
        let { status2 } = await Location.requestBackgroundPermissionsAsync();
        if (status2 !== "granted") {
          alert("Permission to access background location was denied");
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
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

    /* for (let i = 0; i < coords.length; i++) {
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
    } */
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

          {inLocation === true ? (
            <View>
              <EventView />
              <TouchableOpacity onPress={checkInGame}>
                <View style={styles.checkInBtn}>
                  <Image
                    style={styles.checkInIcon}
                    source={require("../assets/icons8-paper-plane-48.png")}
                  />
                  <Text style={styles.checkInText}>Check In</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.eventView}>
                <ActivityIndicator
                  animating={inLocation === null}
                  color={"#F37121"}
                  size={"large"}
                />
                {/* <Text>{position}</Text> */}
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
