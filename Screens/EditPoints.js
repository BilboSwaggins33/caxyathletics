import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, SafeAreaView, ScrollView, Alert, Image } from "react-native";
import { Button, Card, IconButton, Modal, Portal, TextInput, Searchbar } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import { getDatabase, ref, set, onValue, update, get, push } from "firebase/database";
import moment from "moment";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function EditPoints({ navigation, route }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [housePoints, setHousePoints] = useState({});
  const [visible, setVisible] = useState(false);
  const [evisible, setEvisible] = useState(false);
  const [house, setHouse] = useState("");
  const [points, setPoints] = useState("0");
  const [resetHistory, setResetHistory] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [student, setStudent] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [rewards, setRewards] = useState([]);
  const onChangeSearch = (query) => setSearchQuery(query);
  const db = getDatabase();

  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }

  useEffect(() => {
    onValue(ref(db, "resets/"), (snapshot) => {
      if (snapshot.exists()) {
        setResetHistory(snapshot.val());
      }
    });
    onValue(ref(db, "house/"), (snapshot) => {
      setHousePoints(snapshot.val());
    });
    onValue(ref(db, "users/"), (snapshot) => {
      const data = snapshot.val();
      //console.log(data);
      setUserInfo(
        Object.values(data).map((u) => {
          return { name: u.name, points: u.points, uid: u.uid };
        })
      );
    });
    onValue(ref(db, "rewards/"), (snapshot) => {
      setRewards(snapshot.val().map((r) => r.points));
      console.log(rewards);
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
    Alert.alert(
      "Are you sure?",
      "You won't be able to revert back. It's suggested you mark down each houses points just in case.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            get(ref(db, "users/")).then((snapshot) => {
              var users = snapshot.val();
              for (var user in users) {
                if (!("Resets" in users[user])) {
                  users[user]["Resets"] = [];
                }
                users[user]["Resets"].push({ [moment()]: users[user].points });
                users[user].points = 0;
              }
              console.log(users);
              update(ref(db, "users/"), users);
              update(ref(db, "resets/" + moment().format("LLL").toString()), {
                Welch: housePoints["Welch"].points,
                Sargent: housePoints["Sargent"].points,
                Bird: housePoints["Bird"].points,
                Lewis: housePoints["Lewis"].points,
              });
            });
            update(ref(db, "house/Welch"), {
              points: 0,
            });
            update(ref(db, "house/Bird"), {
              points: 0,
            });
            update(ref(db, "house/Lewis"), {
              points: 0,
            });
            update(ref(db, "house/Sargent"), {
              points: 0,
            });
          },
        },
      ]
    );
  };

  const handleChangePoints = () => {
    if (!isNaN(points) && !isNaN(parseFloat(points))) {
      update(ref(db, "house/" + house), {
        points: parseInt(points),
      });
      Alert.alert("Points saved for " + house);
    } else {
      Alert.alert("not a valid number.");
    }
    setVisible(false);
  };

  const handleStudentPoints = () => {
    if (!isNaN(points) && !isNaN(parseFloat(points))) {
      update(ref(db, "users/" + student.uid), {
        points: parseInt(points),
      });
      var redeemedPrizes = [];
      for (let i = 0; i < rewards.length; i++) {
        redeemedPrizes.push(points >= rewards[i]);
      }
      update(ref(db, "users/" + student.uid), { redeemedPrizes });
      Alert.alert("Points saved: " + student.name);
    } else {
      Alert.alert("not a valid number.");
    }
    setEvisible(false);
  };

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <View style={{ marginBottom: 10, flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="arrow-left"
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Text style={styles.caxyAthleticsTxt}>Admin</Text>
          </View>
          <Text style={styles.caxyAthleticsTxt}>Edit Points</Text>
          <View style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}>
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
                    <Image style={{ height: 48, width: 48, marginHorizontal: 20 }} source={item.uri} />
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
          <Text style={styles.caxyAthleticsTxt}>Reset History</Text>
          <View style={{ marginHorizontal: 20 }}>
            <FlatList
              data={Object.keys(resetHistory)}
              renderItem={(r) => {
                return (
                  <View style={{ marginVertical: 20 }}>
                    <Text>{r["item"]}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontFamily: "Montserrat-Medium", margin: 5, color: "black" }}>
                        Welch: {resetHistory[r["item"]]["Welch"]}
                      </Text>
                      <Text style={{ fontFamily: "Montserrat-Medium", margin: 5, color: "black" }}>
                        Bird: {resetHistory[r["item"]]["Bird"]}
                      </Text>
                      <Text style={{ fontFamily: "Montserrat-Medium", margin: 5, color: "black" }}>
                        Sargent: {resetHistory[r["item"]]["Sargent"]}
                      </Text>
                      <Text style={{ fontFamily: "Montserrat-Medium", margin: 5, color: "black" }}>
                        Lewis: {resetHistory[r["item"]]["Lewis"]}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
          <View style={{ margin: 10 }}>
            <Searchbar
              style={{ margin: 10 }}
              selectionColor="#F37121"
              placeholder="Search students..."
              onChangeText={onChangeSearch}
              value={searchQuery}
            />
            <ScrollView>
              {Object.values(userInfo)
                .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      setEvisible(true);
                      setStudent(item);
                      setPoints(item.points.toString());
                    }}
                    key={index}
                    style={{ margin: 10 }}
                  >
                    <Card
                      style={{
                        padding: 5,
                        backgroundColor: "#F6F4F4",
                        borderWidth: 1,
                      }}
                    >
                      <Card.Content style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <Text numberOfLines={2} style={{ fontSize: 16, fontFamily: "Montserrat-Medium", color: "#3E3939" }}>
                          {item.name}
                        </Text>
                        <Text style={{ fontSize: 16, fontFamily: "Montserrat-Medium", color: "#3E3939" }}>{item.points}</Text>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                ))}
            </ScrollView>
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
            <Modal visible={evisible} dismissable={false} contentContainerStyle={{ backgroundColor: "white", padding: 20 }}>
              <Text style={{ fontFamily: "Montserrat-Medium", marginVertical: 10, color: "black", fontSize: 16 }}>
                {student.name}
              </Text>
              <TextInput
                mode="outlined"
                label="Points"
                selectionColor="#F37121"
                activeOutlineColor="#F37121"
                value={points}
                onChangeText={(text) => setPoints(text)}
              />
              <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", margin: 10 }}>
                <Button
                  mode="outlined"
                  color="#F37121"
                  style={{ width: 125, backgroundColor: "white", margin: 15 }}
                  onPress={() => {
                    setEvisible(false);
                  }}
                >
                  Close
                </Button>
                <Button
                  mode="contained"
                  style={{ width: 125, backgroundColor: "#F37121", margin: 15 }}
                  onPress={() => {
                    handleStudentPoints();
                  }}
                >
                  Save
                </Button>
              </View>
            </Modal>
          </Portal>
        </View>
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
