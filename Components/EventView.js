import React from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { useFonts, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import AppLoading from "expo-app-loading";

export default function EventView() {
  let [fontsLoaded] = useFonts({ Montserrat_700Bold });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.eventView}>
      <Text style={styles.gameTitle}>Varsity Boys Basketball </Text>
      <Text style={styles.specialEvent}>Special Event</Text>
      <View style={styles.vsContainer}>
        <Image
          style={styles.teamIcon}
          source={require("../assets/LFA_interlocking_logo_F2.png")}
        />
        <Text>vs</Text>
        <Image
          style={styles.teamIcon}
          source={require("../assets/LFA_interlocking_logo_F2.png")}
        />
      </View>
      <View style={styles.infoContainer}>
        <Image
          style={styles.infoIcon}
          source={require("../assets/icons8-head-to-head-48.png")}
        />
        <Text style={styles.infoText}>Lake Forest High School</Text>
      </View>
      <View style={styles.infoContainer}>
        <Image
          style={styles.infoIcon}
          source={require("../assets/icons8-clock-48.png")}
        />
        <Text style={styles.infoText}>6PM Thursday</Text>
      </View>
      <View style={styles.infoContainer}>
        <Image
          style={styles.infoIcon}
          source={require("../assets/icons8-map-pin-48.png")}
        />
        <Text style={styles.infoText}>Crown</Text>
      </View>
    </View>
  );
}

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
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
  },

  vsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 40,
    marginVertical: 40,
    justifyContent: "space-evenly",
  },

  gameTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },

  specialEvent: {
    color: "#F37121",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },

  teamIcon: {
    height: 75,
    width: 75,
  },

  infoText: {
    fontSize: 12,
    fontFamily: "Montserrat_700Bold",
  },

  infoIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 80,
    marginTop: 10,
  },
});
