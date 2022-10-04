import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import SchoolLogos from "../scripts/getLogos/SchoolLogos";
export default function EventView(props) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }
  useEffect(() => {
    loadFont();
  }, []);
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View style={styles.eventView}>
        {props.title == "No Events for Today" ? (
          <View>
            <Text style={styles.gameTitle}>{props.title}</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.gameTitle} numberOfLines={6} adjustsFontSizeToFit={true}>
              {props.title}
            </Text>
            <Text style={styles.specialEvent}>{props.type}</Text>
            <View style={styles.vsContainer}>
              <Image style={styles.teamIcon} source={require("../assets/LFA_interlocking_logo_F2.png")} />
              <Text>vs</Text>
              <Image
                style={styles.teamIcon}
                source={{
                  uri: props.opponent
                    ? SchoolLogos[props.opponent].url
                    : "https://cfunity-school-logos.nfhsnetwork.com/v1/4baf4f0f63_p614.png",
                }}
              />
            </View>
            <View style={{ alignItems: "center" }}>
              <View>
                <View style={styles.infoContainer}>
                  <Image style={styles.infoIcon} source={require("../assets/icons8-location-48.png")} />
                  <Text style={styles.infoText}>{props.location}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Image style={styles.infoIcon} source={require("../assets/icons8-clock-48.png")} />
                  <Text style={styles.infoText}>{props.time}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Image style={styles.infoIcon} source={require("../assets/icons8-map-pin-48.png")} />
                  <Text style={styles.infoText}>{props.facility}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  eventView: {
    width: width - 50,
    height: 375,
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 25,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    marginBottom: 10,
    padding: 15,
    justifyContent: "center",
  },

  vsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 40,
    marginVertical: 20,
    justifyContent: "space-evenly",
  },

  gameTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    textAlign: "center",
  },

  specialEvent: {
    color: "#F37121",
    fontFamily: "Montserrat-Bold",
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
    fontFamily: "Montserrat-Bold",
  },

  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
});
