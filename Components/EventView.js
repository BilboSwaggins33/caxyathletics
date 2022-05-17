import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";

export default function EventView() {
  return (
    <View style={styles.eventView}>
      <Text style={styles.gameTitle}>Varsity Boys Basketball </Text>
      <Text style={styles.specialEvent}>Special Event</Text>
      <View style={styles.vsContainer}></View>
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
    alignItems: "center",
    justifyContent: "center",
  },
});
