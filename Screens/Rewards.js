import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, FlatList, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { getDatabase, onValue, ref, update, set } from "firebase/database";
import { getAuth } from "@firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import { Portal, Modal, Card, Button } from "react-native-paper";
import CircularProgress from "react-native-circular-progress-indicator";
import { getFocusedRouteNameFromRoute, useScrollToTop } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import { MontserratFont } from "../assets/fonts";
import * as Font from "expo-font";
import LinearGradient from "react-native-linear-gradient";
const Stack = createStackNavigator();

export default function RewardsStackScreen({ navigation, route }) {
  React.useLayoutEffect(() => {
    if (getFocusedRouteNameFromRoute(route) == "Redeem") {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          paddingTop: 10,
          borderTopWidth: 1,
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 20,
        },
      });
    }
  });
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="SeeRewards" component={Rewards} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function Rewards({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [rewardInfo, setRewardInfo] = useState({});
  const [points, setPoints] = useState(0);
  const [featuredPressed, setFeaturedPressed] = useState(true);
  const [merchPressed, setMerchPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState([]);
  const dispatch = useDispatch();
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;

  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }
  useEffect(() => {
    //resetAll();
    onValue(ref(db, "users/" + user.uid), (snapshot) => {
      setPoints(snapshot.val().points);
    });
    onValue(ref(db, "rewards/"), (snapshot) => {
      setRewards(Object.values(snapshot.val()));
      //console.log(snapshot.val());
    });
    onValue(ref(db, "pending/" + user.uid), (snapshot) => {
      if (snapshot.exists()) {
        setPending(snapshot.val());
      } else {
        setPending([]);
      }
    });

    loadFont();
  }, []);

  useEffect(() => {
    //updatePoints(500);
  }, []);

  function updatePoints(n) {
    setPoints(n);
    update(ref(db, "users/" + user.uid), {
      points: n,
    }).then(() => {
      //console.log("points saved successfully");
    });
  }

  function updatePending(key, redeem) {
    //console.log(key);
    if (redeem) {
      update(ref(db, "pending/" + user.uid), {
        [key]: true,
      });
    } else {
      set(ref(db, "pending/" + user.uid + "/" + key), null);
    }
  }

  function resetAll() {
    updatePoints(0);
  }

  function Separator() {
    return (
      <View
        style={{
          marginVertical: 10,
        }}
      />
    );
  }

  function hideModal() {
    setVisible(false);
  }

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll} stickyHeaderIndices={[0]}>
          {/* <Header /> */}
          <View>
            <Header />
            <View style={styles.headerContainer}>
              <Image style={styles.headerIcon} source={require("../assets/icons8-trophy-48.png")} />
              <Text style={styles.headerText}>Rewards Shop</Text>
            </View>
            <View style={styles.categoryBtnContainer}>
              <Button
                style={featuredPressed ? styles.categoryBtnPressed : styles.categoryBtnNotPressed}
                mode="contained"
                color={merchPressed ? "white" : "black"}
                onPress={() => {
                  setFeaturedPressed(true);
                  setMerchPressed(false);
                  //console.log("Featured Pressed");
                }}
              >
                Featured
              </Button>
              <Button
                style={merchPressed ? styles.categoryBtnPressed : styles.categoryBtnNotPressed}
                mode="contained"
                color={featuredPressed ? "white" : "black"}
                onPress={() => {
                  setFeaturedPressed(false);
                  setMerchPressed(true);
                  //console.log("Merch Pressed");
                }}
              >
                Merch
              </Button>
            </View>
          </View>
          <Portal>
            <Modal visible={visible} onDismiss={hideModal}>
              <View style={styles.rewardInfoModal}>
                <View style={styles.rewardInfoContainer}>
                  <Text style={[styles.rewardName, { marginHorizontal: 20, textAlign: "center" }]}>{rewardInfo.name}</Text>
                  <Text style={styles.rewardDescription}>{rewardInfo.description}</Text>
                  <Image
                    style={{ alignItems: "center", width: 250, height: 250 }}
                    source={{ uri: rewardInfo.image }}
                    resizeMode={"contain"}
                  />
                  <Text style={styles.rewardsPoints}>{rewardInfo?.points} points</Text>

                  {pending[rewardInfo.key] ? (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                      <Button
                        mode="contained"
                        color="#F37121"
                        uppercase={false}
                        labelStyle={{ fontFamily: "Montserrat-Bold", color: "white", fontSize: 14 }}
                        onPress={() => {
                          updatePoints(points + rewardInfo.points);
                          updatePending(rewardInfo.key, false);
                        }}
                        style={{ margin: 15, width: 150, height: 40, justifyContent: "center" }}
                      >
                        Cancel
                      </Button>
                      <View
                        style={{
                          marginBottom: 20,
                          width: 150,
                          height: 40,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 5,
                        }}
                      >
                        <Text style={{ fontFamily: "Montserrat-Bold", color: "#F37121", fontSize: 16 }}>Pending...</Text>
                      </View>
                      <Text style={{ fontFamily: "Montserrat-Medium" }}>Visit Crown to claim your reward!</Text>
                    </View>
                  ) : (
                    <Button
                      mode="contained"
                      color="#F37121"
                      uppercase={false}
                      labelStyle={{ fontFamily: "Montserrat-Bold", color: "white", fontSize: 16 }}
                      onPress={() => {
                        if (rewardInfo.points > points) {
                          Alert.alert("You don't have enough points to redeem this reward.");
                          setVisible(false);
                        } else {
                          updatePoints(points - rewardInfo.points);
                          updatePending(rewardInfo.key, true);
                        }
                      }}
                      style={{ margin: 15, width: 150, height: 40, justifyContent: "center" }}
                    >
                      Redeem
                    </Button>
                  )}
                </View>
              </View>
            </Modal>
          </Portal>
          <View style={styles.mainContainer}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 300 }}
              data={featuredPressed ? rewards.filter((x) => x.merch == false) : rewards.filter((x) => x.merch == true)}
              numColumns={2}
              ItemSeparatorComponent={() => Separator()}
              renderItem={({ item, index }) => {
                return (
                  <View style={styles.itemContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setRewardInfo(item);
                        setVisible(true);
                      }}
                    >
                      <View style={{ marginHorizontal: 15 }}>
                        <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 10 }}>
                          <Image style={styles.rewardsImage} source={{ uri: item.image }} resizeMode={"contain"} />
                          <View>
                            <Text numberOfLines={2} style={styles.rewardsText}>
                              {item.name}
                            </Text>
                          </View>
                          <View style={styles.rewardsPoints}>
                            <Text>{item.points} Points</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />

            {/* 
            <IconButton
              icon="plus"
              color="black"
              size={36}
              onPress={() => {
                changePoints(50);
              }}
              style={{ position: "relative" }}
            />
            <View style={styles.textContainer}>
              <Image style={styles.subtitleIcon} source={require("../assets/icons8-prize-48.png")} />
              <Text style={styles.subtitleText}>{pointsLeft} points to next reward</Text>
            </View>
            <View style={styles.redeemContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Redeem");
                }}
              >
                <View style={styles.redeemBtn}>
                  <Text style={styles.redeemText}>Redeem</Text>
                </View>
              </TouchableOpacity>
              </View> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F4F4",
  },

  redeemedView: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryBtnContainer: {
    backgroundColor: "#F6F4F4",
    paddingVertical: 20,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: "5%",
  },

  categoryBtnPressed: {
    marginHorizontal: "2.5%",
    backgroundColor: "#F37121",
    width: "40%",
  },

  categoryBtnNotPressed: {
    marginHorizontal: "2.5%",
    backgroundColor: "white",
    width: "40%",
  },

  redeemedText: {
    fontFamily: "Montserrat-Bold",
    color: "#eb6543",
    fontSize: 20,
  },

  rewardInfoModal: {
    width: width - 50,
    height: height - 250,
    backgroundColor: "rgb(252, 251, 255)",
    marginLeft: 25,
    borderRadius: 10,
    padding: 10,
  },

  rewardInfoContainer: {
    alignItems: "center",
  },

  rewardName: {
    fontFamily: "Montserrat-Bold",
    fontSize: 24,
    marginTop: 25,
  },

  rewardDescription: {
    fontFamily: "Montserrat-Regular",
    padding: 15,
  },

  rewardsPoints: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    marginTop: 10,
  },

  rewardsImage: {
    // marginTop: 25,
    // borderWidth: 5,
    alignItems: "center",
    height: 250,
  },

  errorText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    textAlign: "center",
  },

  unclaimedView: {
    borderRadius: 5,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },

  unclaimedText: {
    fontFamily: "Montserrat-Bold",
    color: "white",
  },

  pointsContainer: {
    alignItems: "center",
    backgroundColor: "#F37121",
    height: 40,
    width: 200,
    justifyContent: "center",
  },

  pointsText: {
    fontFamily: "Montserrat-Bold",
  },

  modalHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  modalHeaderText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    left: -24,
  },

  modalRewardsContainer: {
    margin: 10,
    borderColor: "black",
    // borderWidth: 3,
  },

  itemNumContainer: {
    backgroundColor: "#F37121",
    paddingVertical: 50,
  },

  itemContainer: {
    width: "50%",
    // borderWidth: 1,
    // justifyContent: "center",
  },

  itemNumText: {
    fontFamily: "Montserrat-Bold",
    transform: [{ rotate: "270deg" }],
    color: "white",
  },

  itemPointsText: {
    fontFamily: "Montserrat-Bold",
  },

  itemNameText: {
    fontFamily: "Montserrat-Bold",
  },

  itemDescriptionText: {
    fontFamily: "Montserrat-Medium",
  },

  redeemButton: {
    borderRadius: 10,
    width: 160,
    height: 50,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },

  redeemBtnText: {
    fontFamily: "Montserrat-Medium",
    color: "white",
    fontSize: 20,
  },

  itemMetaContainer: {
    margin: 10,
    maxWidth: 240,
  },

  mainContainer: {
    alignItems: "center",
  },

  scroll: {
    backgroundColor: "#F6F4F4",
    marginBottom: -50,
  },

  headerContainer: {
    backgroundColor: "#F6F4F4",
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  headerIcon: {
    height: 30,
    width: 30,
  },

  headerText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#3E3939",
    marginLeft: 5,
  },

  rewardsText: {
    fontFamily: "Montserrat-Bold",
    // opacity: 0.2,
    color: "black",
    fontSize: 16,
  },

  rewardsContainer: {
    marginTop: 20,
  },

  textContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  subtitleIcon: {
    height: 30,
    width: 30,
  },

  subtitleText: {
    marginLeft: 10,
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },

  redeemContainer: {
    borderRadius: 15,
    backgroundColor: "#e2e2e2",
    margin: 20,
  },

  redeemBtn: {
    height: 50,
    width: 200,
    backgroundColor: "#F37121",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },

  redeemText: {
    color: "white",
    fontFamily: "Montserrat-Bold",
  },
  linearGradient: {
    borderRadius: 15,
  },
});
