import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Text, Image, Animated, FlatList, SafeAreaView, StatusBar } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useCollapsibleHeader } from "react-navigation-collapsible";
import { useSelector } from "react-redux";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import { getAuth } from "@firebase/auth";

//import { StatusBar } from "expo-status-bar";

export default function Header() {
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [points, setPoints] = useState(0);
  const { onScroll, containerPaddingTop, scrollIndicatorInsetTop, translateY } = useCollapsibleHeader({
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#F6F4F4",
      },
    },
  });

  const stickyHeaderHeight = 64;

  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }
  useEffect(() => {
    onValue(ref(db, "users/" + user.uid), (snapshot) => {
      setPoints(snapshot.val().points);
    });

    loadFont();
  }, []);

  useEffect(() => {}, []);

  // const db = getDatabase();
  // const ref = db.ref("users");
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View style={styles.headerContainer}>
        <StatusBar animated={true} barStyle={"dark-content"} />
        <View style={styles.leftContainer}>
          <Image style={styles.caxyLogo} source={require("../assets/LFA_interlocking_logo_F2.png")} />
          <Text style={styles.caxyAthleticsTxt}>Caxy Athletics</Text>
        </View>
        <TouchableOpacity>
          <View style={styles.pointsBtn}>
            <Text style={styles.pointsTxt}>{points} Points</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F6F4F4",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    maxHeight: 64,
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  caxyAthleticsTxt: {
    fontSize: 20,
    color: "#3E3939",
    fontFamily: "Montserrat-Bold",
    justifyContent: "center",
    paddingLeft: 10,
  },

  caxyLogo: {
    width: 40,
    height: 40,
  },

  pointsBtn: {
    backgroundColor: "#F37121",
    width: 80,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    transform: [{ translateY: 6 }],
  },

  pointsTxt: {
    fontSize: 12,
    textAlign: "center",
    color: "white",
    fontFamily: "Montserrat-Bold",
  },
});
