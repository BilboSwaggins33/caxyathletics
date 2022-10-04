import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, SafeAreaView, ScrollView, Alert, Image } from "react-native";
import { Button, IconButton, List, Modal, Portal, TextInput, Card, Paragraph, Title } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import { getDatabase, ref, set, onValue, update, get } from "firebase/database";
import moment from "moment";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function EventHistory({ navigation, route }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [housePoints, setHousePoints] = useState({});
  const [visible, setVisible] = useState(false);
  const [house, setHouse] = useState("");
  const [points, setPoints] = useState("0");
  const [events, setEvents] = useState([]);
  const db = getDatabase();

  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }

  const handleAlert = (item, i) => {
    Alert.alert("Are you sure?", "You will lose event data.", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "OK",
        onPress: () => {
          //console.log(events);
          var temp = events[item];
          temp.splice(i, 1);
          //console.log(temp);
          setEvents((pre) => {
            return { ...pre, [item]: temp };
          });
          //console.log(events);
          set(ref(db, "events/" + item + "/" + i), null);
        },
      },
    ]);
  };

  useEffect(() => {
    onValue(ref(db, "events/"), (snapshot) => {
      //console.log(snapshot.val());
      if (snapshot.exists()) {
        const result = Object.keys(snapshot.val())
          .filter((x) => {
            return new Date() >= new Date(x);
          })
          .sort(function (a, b) {
            return new Date(b) - new Date(a);
          })
          .reduce((obj, key) => {
            obj[key] = snapshot.val()[key];
            return obj;
          }, {});
        setEvents(result);
      } else {
        setEvents([]);
      }
    });
    loadFont();
  }, []);

  const houses = [
    { house: "Sargent", uri: require("../assets/houseImages/Sargent.jpeg") },
    { house: "Bird", uri: require("../assets/houseImages/Bird.jpeg") },
    { house: "Lewis", uri: require("../assets/houseImages/Lewis.jpeg") },
    { house: "Welch", uri: require("../assets/houseImages/Welch.jpeg") },
  ];

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={{ margin: 20, flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="arrow-left"
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Text style={styles.caxyAthleticsTxt}>Admin</Text>
          </View>
          <Text style={styles.caxyAthleticsTxt}>Event History</Text>
          <List.Section style={{ justifyContent: "center" }}>
            {Object.keys(events).map((item, index) => (
              <List.Accordion key={index} title={item} theme={{ colors: { primary: "#F37121" } }}>
                {events[item].map((e, i) => (
                  <View key={i}>
                    <Card mode="outlined" key={index} style={{ backgroundColor: "#F6F4F4" }}>
                      <Card.Content>
                        <Paragraph style={styles.normalText}>
                          {e.type} - {e.title}
                        </Paragraph>
                        <Paragraph style={styles.descriptionText}>
                          {e.time.trim()}, {e.facility}, @ {e.location}
                        </Paragraph>
                        <Text style={styles.normalText}>Points Earned:</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                          {Object.keys(e.points).map((n, ind) => (
                            <View key={ind}>
                              <Text style={styles.descriptionText}>
                                {n}: {e.points[n]}
                              </Text>
                            </View>
                          ))}
                        </View>
                        <Card.Actions>
                          <Button
                            onPress={() => handleAlert(item, i)}
                            uppercase={false}
                            style={{ backgroundColor: "#F37121", width: 150, marginVertical: 10, marginHorizontal: -10 }}
                            labelStyle={{ fontFamily: "Montserrat-SemiBold" }}
                            mode="contained"
                          >
                            Delete Event
                          </Button>
                        </Card.Actions>
                      </Card.Content>
                    </Card>
                  </View>
                ))}
              </List.Accordion>
            ))}
          </List.Section>
        </ScrollView>
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
    padding: 5,
  },
  normalText: {
    fontSize: 16,
    color: "#3E3939",
    fontFamily: "Montserrat-Medium",
    justifyContent: "center",
  },
  descriptionText: {
    fontSize: 12,
    color: "#3E3939",
    fontFamily: "Montserrat-Medium",
    justifyContent: "center",
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
