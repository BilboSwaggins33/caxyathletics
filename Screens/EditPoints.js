import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, SafeAreaView, ScrollView, Alert, Image } from "react-native";
import { Button, IconButton, Modal, Portal, TextInput } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import { getDatabase, ref, set, onValue, update } from "firebase/database";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function EditPoints({ navigation, route }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [housePoints, setHousePoints] = useState({});
  const [visible, setVisible] = useState(false);
  const [house, setHouse] = useState("");
  const [points, setPoints] = useState("0");
  const db = getDatabase();

  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }

  useEffect(() => {
    onValue(ref(db, "house/"), (snapshot) => {
      setHousePoints(snapshot.val());
    });
    loadFont();
  }, []);

  const houses = [
    { house: "Sargent", uri: require("../assets/houseImages/Sargent.jpeg") },
    { house: "Bird", uri: require("../assets/houseImages/Bird.jpeg") },
    { house: "Lewis", uri: require("../assets/houseImages/Lewis.jpeg") },
    { house: "Welch", uri: require("../assets/houseImages/Welch.jpeg") },
  ];

  const handleReset = () => {
    Alert.alert("Are you sure?", "Resetting all the points will ", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  const handleChangePoints = () => {
    if (!isNaN(points) && !isNaN(parseFloat(points))) {
      update(ref(db, "house/" + house), {
        points: points,
      });
      Alert.alert("Points saved." + house);
    } else {
      Alert.alert("not a valid number.");
    }
    setVisible(false);
  };

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ margin: 20, flexDirection: "row", alignItems: "center" }}>
          <IconButton
            icon="arrow-left"
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text style={styles.caxyAthleticsTxt}>Admin</Text>
        </View>
        <Text style={styles.caxyAthleticsTxt}>Edit Points</Text>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <FlatList
            data={houses}
            numColumns={4}
            scrollEnabled={false}
            columnWrapperStyle={{ flex: 1 }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setVisible(true);
                    setHouse(item.house);
                    setPoints(Math.floor(housePoints[item.house]?.points).toString());
                  }}
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Image style={{ height: 48, width: 48, margin: 20 }} source={item.uri} />
                  <Text style={{ fontFamily: "Montserrat-Medium" }}>{Math.floor(housePoints[item.house]?.points)}</Text>
                  <Text style={{ fontFamily: "Montserrat-Medium" }}>Points</Text>
                </TouchableOpacity>
              );
            }}
          />
          <Button
            onPress={handleReset}
            uppercase={false}
            labelStyle={{ fontFamily: "Montserrat-Bold" }}
            style={{ backgroundColor: "#F37121", width: 250, margin: 20 }}
            mode="contained"
          >
            Reset All Points
          </Button>
        </View>
        <Portal>
          <Modal visible={visible} dismissable={false} contentContainerStyle={{ backgroundColor: "white", padding: 20 }}>
            <TextInput
              label="Points"
              selectionColor="#F37121"
              activeUnderlineColor="#F37121"
              value={points}
              onChangeText={(text) => setPoints(text)}
            />
            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", margin: 10 }}>
              <Button
                mode="outlined"
                color="#F37121"
                style={{ width: 125, backgroundColor: "white", margin: 15 }}
                onPress={() => {
                  setVisible(false);
                }}
              >
                Close
              </Button>
              <Button
                mode="contained"
                style={{ width: 125, backgroundColor: "#F37121", margin: 15 }}
                onPress={() => {
                  handleChangePoints();
                }}
              >
                Save
              </Button>
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  caxyAthleticsTxt: {
    fontSize: 20,
    color: "#3E3939",
    fontFamily: "Montserrat-Bold",
    justifyContent: "center",
    paddingLeft: 10,
  },
  headerContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#3E3939",
    marginLeft: 10,
  },
  headerIcon: {
    maxWidth: 24,
    maxHeight: 24,
  },
});
