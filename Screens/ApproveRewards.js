import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, SafeAreaView, ScrollView, SnapshotViewIOS } from "react-native";
import { Button, IconButton, Card, Searchbar, Provider, Modal, Portal } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { getDatabase, onValue, ref, set, update, get } from "firebase/database";
import { getAuth } from "@firebase/auth";
export default function ApproveRewards({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;
  const [rewardInfo, setRewardInfo] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [reward, setReward] = useState({});
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const onChangeSearch = (query) => setSearchQuery(query);
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }
  useEffect(() => {
    loadFont();

    onValue(ref(db, "rewards/"), (snapshot) => {
      setRewardInfo(snapshot.val());
    });
    onValue(ref(db, "users/"), (snapshot) => {
      setUsers(snapshot.val()); //console.log(data);
    });
    onValue(ref(db, "pending/"), (snapshot) => {
      if (snapshot.exists()) {
        setPending(snapshot.val());
      }
    });
    var x = Object.values(users).map((u) => {
      return { name: u.name, uid: u.uid, pending: pending[u.uid] === undefined ? {} : pending[u.uid] };
    });
    setRewards(x);
  }, []);

  function handleConfirm() {
    // const updates = {};
    // updates[reward.number] = true;
    // update(ref(db, "users/" + reward.uid + "/redeemedPrizes/"), updates);
    set(ref(db, "pending/" + reward.uid + "/" + reward.key), null);
    setVisible(false);
  }

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
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
          <FlatList
            data={rewards.filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))}
            renderItem={({ item, index }) => {
              return (
                <View key={index} style={{ margin: 10 }}>
                  {Object.values(item.pending).length != 0 ? (
                    <Card key={index} style={{ padding: 5, backgroundColor: "#F6F4F4", borderWidth: 1 }}>
                      <Card.Title title={item.name} titleStyle={styles.headerText} titleNumberOfLines={2} />
                      <Card.Content>
                        <Text style={{ fontFamily: "Montserrat-SemiBold" }}>Redeemed Rewards</Text>
                        {Object.keys(item.pending).map((i, x) => (
                          <View key={x} style={{ marginTop: 10 }}>
                            <Button
                              uppercase={false}
                              onPress={() => {
                                setVisible(true);
                                setReward({ key: i, name: item.name, uid: item.uid });
                              }}
                              color="#F37121"
                              mode="outlined"
                            >
                              {rewardInfo[i].name}
                            </Button>
                          </View>
                        ))}
                      </Card.Content>
                    </Card>
                  ) : (
                    <View key={index}></View>
                  )}
                </View>
              );
            }}
          />
          {/* {rewards
            .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((item, index) => (
              <View key={index} style={{ margin: 10 }}>
                {Object.values(item.pending).length != 0 ? (
                  <Card style={{ padding: 5, backgroundColor: "#F6F4F4", borderWidth: 1 }}>
                    <Card.Title title={item.name} titleStyle={styles.headerText} titleNumberOfLines={2} />
                    <Card.Content>
                      <Text style={{ fontFamily: "Montserrat-SemiBold" }}>Redeemed Rewards</Text>
                      {Object.keys(item.pending).map((i) => (
                        <View style={{ marginTop: 10 }}>
                          <Button
                            uppercase={false}
                            onPress={() => {
                              setVisible(true);
                              setReward({ key: i, name: item.name, uid: item.uid });
                            }}
                            color="#F37121"
                            mode="outlined"
                          >
                            {rewardInfo[i].name}
                          </Button>
                        </View>
                      ))}
                    </Card.Content>
                  </Card>
                ) : (
                  <View></View>
                )}
              </View>
            ))} */}
        </View>
        <Portal>
          <Modal
            visible={visible}
            dismissable={false}
            contentContainerStyle={{ backgroundColor: "white", padding: 10, margin: 20, borderRadius: 10 }}
          >
            <View style={{ alignSelf: "center", margin: 10 }}>
              <Text style={{ fontFamily: "Montserrat-SemiBold", textAlign: "center", marginVertical: 10 }}>
                {rewardInfo[reward.key]?.name}
              </Text>
              <Text style={{ fontFamily: "Montserrat-SemiBold", textAlign: "center", color: "gray" }}>
                {rewardInfo[reward.key]?.merch ? "Merch" : "Featured"} : {rewardInfo[reward.key]?.points} Points
              </Text>
              <Text style={{ fontFamily: "Montserrat-SemiBold", textAlign: "center", color: "gray" }}>{reward.name}</Text>
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
