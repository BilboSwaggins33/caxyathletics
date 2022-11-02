import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, SafeAreaView, ScrollView, SnapshotViewIOS } from "react-native";
import { Button, IconButton, Card, Searchbar, Provider, Modal, Portal } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { useSelector, useDispatch } from "react-redux";
import { rewardsList } from "../Data/rewards";
import { getAuth } from "@firebase/auth";

const Stack = createStackNavigator();

export default function ApproveRewards({ navigation, route }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const db = getDatabase();
  const auth = getAuth();
  const [rewardInfo, setRewardInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [reward, setReward] = useState({});
  const onChangeSearch = (query) => setSearchQuery(query);

  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }

  function getAllIndexes(arr, val) {
    var indexes = [],
      i;
    for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
    return indexes;
  }

  function handleConfirm() {
    const updates = {};
    updates[reward.number] = true;
    update(ref(db, "users/" + reward.uid + "/redeemedPrizes/"), updates);
    setVisible(false);
  }

  useEffect(() => {
    loadFont();
    onValue(ref(db, "users/"), (snapshot) => {
      const data = snapshot.val();
      //console.log(data);
      setRewardInfo(
        Object.values(data).map((u) => {
          return { name: u.name, redeemedPrizes: u.redeemedPrizes, uid: u.uid };
        })
      );
    });
  }, []);

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={{ marginHorizontal: 20, flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="arrow-left"
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Text style={styles.caxyAthleticsTxt}>Admin</Text>
          </View>
          <View style={{ margin: 20 }}>
            <Text style={styles.caxyAthleticsTxt}>Pending Rewards</Text>
            <Searchbar
              style={{ margin: 10 }}
              selectionColor="#F37121"
              placeholder="Search students..."
              onChangeText={onChangeSearch}
              value={searchQuery}
            />
            {rewardInfo
              .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item, index) => (
                <View key={index} style={{ margin: 10 }}>
                  {item.redeemedPrizes.includes("pending") ? (
                    <Card style={{ padding: 5, backgroundColor: "#F6F4F4", borderWidth: 1 }}>
                      <Card.Title title={item.name} titleStyle={styles.headerText} titleNumberOfLines={2} />
                      <Card.Content>
                        <Text style={{ fontFamily: "Montserrat-SemiBold" }}>Redeemable Rewards</Text>
                        {getAllIndexes(item.redeemedPrizes, "pending").map((i) => (
                          <View style={{ marginTop: 10 }}>
                            <Button
                              uppercase={false}
                              onPress={() => {
                                setVisible(true);
                                setReward({ number: i, name: item.name, uid: item.uid });
                              }}
                              color="#F37121"
                              mode="outlined"
                            >
                              Reward #{i + 1}
                            </Button>
                          </View>
                        ))}
                      </Card.Content>
                    </Card>
                  ) : (
                    <View></View>
                  )}
                </View>
              ))}
          </View>
          <Portal>
            <Modal
              visible={visible}
              dismissable={false}
              contentContainerStyle={{ backgroundColor: "white", padding: 10, margin: 20, borderRadius: 10 }}
            >
              <View style={{ alignSelf: "center", margin: 10 }}>
                <Text style={{ fontFamily: "Montserrat-SemiBold" }}>
                  Redeem Reward #{reward.number + 1} for {reward.name} ?
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-evenly", margin: 20 }}>
                <Button uppercase={false} color="#F37121" mode="outlined" onPress={() => handleConfirm()}>
                  Confirm
                </Button>
                <Button uppercase={false} color="#F37121" mode="outlined" onPress={() => setVisible(false)}>
                  Cancel
                </Button>
              </View>
            </Modal>
          </Portal>
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
  },
  headerIcon: {
    maxWidth: 24,
    maxHeight: 24,
  },
});
