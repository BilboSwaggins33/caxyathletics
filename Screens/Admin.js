import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, SafeAreaView, ScrollView } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import ApprovePictures from "./ApprovePictures";
import ApproveRewards from "./ApproveRewards";
import EditEvents from "./EditEvents";
import EditRewards from "./EditRewards";
import EventHistory from "./EventHistory";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createStackNavigator();
export default function AdminStack({ navigation, route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminComponent" component={Admin} />
      <Stack.Screen name="ApprovePictures" component={ApprovePictures} />
      <Stack.Screen name="ApproveRewards" component={ApproveRewards} />
      <Stack.Screen name="EditEvents" component={EditEvents} />
      <Stack.Screen name="EditRewards" component={EditRewards} />
      <Stack.Screen name="EventHistory" component={EventHistory} />
    </Stack.Navigator>
  );
}
function Admin({ navigation, route }) {
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
      <SafeAreaView style={styles.container}>
        <View style={{ marginHorizontal: 20, marginVertical: 10, flexDirection: "row", alignItems: "center" }}>
          <IconButton
            icon="arrow-left"
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text style={styles.caxyAthleticsTxt}>Admin</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Button
            onPress={() => {
              navigation.navigate("ApprovePictures");
            }}
            uppercase={false}
            icon="image"
            style={{ backgroundColor: "#F37121", width: 250, margin: 20 }}
            labelStyle={{ fontFamily: "Montserrat-Bold" }}
            mode="contained"
          >
            Approve Photos
          </Button>
          <Button
            onPress={() => {
              navigation.navigate("ApproveRewards");
            }}
            uppercase={false}
            icon="trophy"
            style={{ backgroundColor: "#F37121", width: 250, margin: 20 }}
            labelStyle={{ fontFamily: "Montserrat-Bold" }}
            mode="contained"
          >
            Approve Rewards
          </Button>
          <Button
            onPress={() => {
              navigation.navigate("EditEvents");
            }}
            uppercase={false}
            icon="calendar-multiple-check"
            style={{ backgroundColor: "#F37121", width: 250, margin: 20 }}
            labelStyle={{ fontFamily: "Montserrat-Bold" }}
            mode="contained"
          >
            Edit Events
          </Button>
          <Button
            onPress={() => {
              navigation.navigate("EventHistory");
            }}
            uppercase={false}
            icon="history"
            style={{ backgroundColor: "#F37121", width: 250, margin: 20 }}
            labelStyle={{ fontFamily: "Montserrat-Bold" }}
            mode="contained"
          >
            Event History
          </Button>
          <Button
            onPress={() => {
              navigation.navigate("EditRewards");
            }}
            uppercase={false}
            icon="medal"
            style={{ backgroundColor: "#F37121", width: 250, margin: 20 }}
            labelStyle={{ fontFamily: "Montserrat-Bold" }}
            mode="contained"
          >
            Edit Rewards
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F4F4",
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
