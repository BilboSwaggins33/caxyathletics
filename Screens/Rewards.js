import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, FlatList, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { getDatabase, onValue, ref, update, set } from "firebase/database";
import { getAuth } from "@firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import { Portal, Modal, Card } from "react-native-paper";
import CircularProgress from "react-native-circular-progress-indicator";
import { getFocusedRouteNameFromRoute, useScrollToTop } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import { resetPoints, setMaxPoints, setPoints } from "../redux/actions";
import { rewardsList } from "../Data/rewards";
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
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Redeem" component={RedeemModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function Rewards({ navigation }) {
  const [pointsLeft, setPointsLeft] = useState();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [housePoints, setHousePoints] = useState({});
  const [rewards, setRewards] = useState([]);
  const { points } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const db = getDatabase();
  const maxPoints = 1000;
  const houses = { 23: "Bird", 24: "Sargent", 25: "Welch", 26: "Lewis" };
  let uid;
  const auth = getAuth();
  const user = auth.currentUser;
  if (user !== null) {
    uid = user.uid;
  }
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }
  useEffect(() => {
    //resetAll();
    onValue(ref(db, "house/"), (snapshot) => {
      setHousePoints(snapshot.val());
    });
    onValue(ref(db, "rewards/"), (snapshot) => {
      setRewards(snapshot.val());
      //console.log(snapshot.val());
    });
    loadFont();
  }, []);

  useEffect(() => {
    let isMounted = true; // note mutable flag
    if (isMounted) {
      checkPointsLeft();
    }
    return () => {
      isMounted = false;
    }; //
  }, [points]);

  function updatePoints(n) {
    update(ref(db, "users/" + user.uid), {
      points: n,
    }).then(() => {
      console.log("points saved successfully");
    });
  }

  function resetAll() {
    dispatch(resetPoints(0));
    updatePoints(0);
    update(ref(db, "users/" + user.uid + "/"), { redeemedPrizes: Array(rewards.length).fill(false) });
  }

  function changePoints(n) {
    console.log("changed points by", n);
    let total = points + n;
    if (total < maxPoints) {
      //console.log(total);
      updatePoints(total);
      update(ref(db, "house/" + houses[user.displayName.slice(-2)]), {
        points: housePoints[houses[user.displayName.slice(-2)]]?.points + n,
      });
      dispatch(setPoints(points, n));
    } else {
      updatePoints(maxPoints);
      dispatch(setMaxPoints(maxPoints));
    }
  }

  function checkPointsLeft() {
    if (points !== 0 && points % 100 === 0) {
      setPointsLeft(0);
    } else {
      setPointsLeft(100 - (points % 100));
    }
  }

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll} stickyHeaderIndices={[0]}>
          <Header />
          <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
              <Image style={styles.headerIcon} source={require("../assets/icons8-trophy-48.png")} />
              <Text style={styles.headerText}>Rewards</Text>
            </View>
            <View style={styles.rewardsContainer}>
              <CircularProgress
                value={points}
                maxValue={1000}
                progressValueColor={"#F37121"}
                activeStrokeColor={"#F37121"}
                activeStrokeWidth={20}
                inActiveStrokeWidth={15}
                inActiveStrokeColor={"#F37121"}
                inActiveStrokeOpacity={0.2}
                radius={100}
                progressValueFontSize={36}
                progressValueStyle={{ fontFamily: "Montserrat-Bold" }}
                subtitle={"Points"}
                subtitleStyle={styles.rewardsText}
              />
            </View>
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
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function RedeemModal({ navigation }) {
  const { points } = useSelector((state) => state.userReducer);
  const [rewardInfo, setRewardInfo] = useState({});
  const [redeemedInfo, setRedeemedInfo] = useState([]);
  const [visible, setVisible] = useState(false);
  const [rewards, setRewards] = useState([]);
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;

  //console.log(redeemed);

  useEffect(() => {
    onValue(ref(db, "users/" + user.uid), (snapshot) => {
      setRedeemedInfo(snapshot.val().redeemedPrizes);
    });
    onValue(ref(db, "rewards/"), (snapshot) => {
      setRewards(snapshot.val());
      //console.log(snapshot.val());
    });
  }, []);
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

  return (
    <View>
      <View style={styles.modalHeaderContainer}>
        <IconButton icon="close" onPress={() => navigation.goBack()} />
        <Text style={styles.modalHeaderText}>Rewards</Text>
        <Text></Text>
      </View>
      {/* <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>{points} Points</Text>
      </View> */}
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <View style={styles.rewardInfoModal}>
            <View style={styles.rewardInfoContainer}>
              <Text style={styles.rewardName}>{rewardInfo.name}</Text>
              <Text style={styles.rewardDescription}>{rewardInfo.description}</Text>
              <Image style={styles.rewardsImage} source={{uri: rewardInfo.image}} resizeMode={"contain"} />
              <Text style={styles.rewardsPoints}>Redeem at {rewardInfo?.points} points</Text>
              {points >= rewardInfo.points && !redeemedInfo[rewardInfo.id - 1] ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setVisible(false);
                      const updates = {};
                      updates[rewardInfo.id - 1] = "pending";
                      update(ref(db, "users/" + user.uid + "/redeemedPrizes/"), updates);
                    }}
                  >
                    <LinearGradient
                      style={styles.linearGradient}
                      colors={["#fc9d62", "#f78460", "#F37121"]}
                      start={{ x: 0.0, y: 0.25 }}
                      end={{ x: 0.5, y: 1.0 }}
                    >
                      <View style={styles.redeemButton}>
                        <Text style={styles.redeemBtnText}>Claim</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : points < rewardInfo.points && !redeemedInfo[rewardInfo.id - 1] ? (
                <View style={{ marginHorizontal: 20, marginTop: 25 }}>
                  <Text style={styles.errorText}>You don't have enough points to redeem this reward.</Text>
                </View>
              ) : (
                <View style={{ marginHorizontal: 20, marginTop: 25 }}>
                  <Text style={styles.errorText}>You have already redeemed this reward.</Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </Portal>
      <View style={styles.modalRewardsContainer}>
        <View style={{ marginHorizontal: 15, marginBottom: 20, flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 20, marginRight: 20 }}>Current Points :</Text>
          <LinearGradient
            style={styles.linearGradient}
            colors={["#F37121", "#f78460", "#fc9d62"]}
            start={{ x: 0.0, y: 0.25 }}
            end={{ x: 0.5, y: 1.0 }}
          >
            <View style={{ alignItems: "center", padding: 10, paddingHorizontal: 40 }}>
              <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 20, color: "white" }}>{points}</Text>
            </View>
          </LinearGradient>
        </View>
        <FlatList
          contentContainerStyle={{ paddingBottom: 300 }}
          data={rewards}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => Separator()}
          renderItem={({ item, index }) => {
            if (!redeemedInfo[index] && points < item.points) {
              /*
               Not Enough Points
              */
              return (
                <TouchableOpacity
                  onPress={() => {
                    setRewardInfo(item);
                    setVisible(true);
                  }}
                >
                  <View style={{ marginHorizontal: 15 }}>
                    <View
                      style={{
                        height: 120,
                        borderRadius: 10,
                        padding: 30,
                        flexDirection: "row",
                        flex: 1,
                        backgroundColor: "white",
                      }}
                    >
                      <View style={{ justifyContent: "center", alignItems: "center", marginRight: 30 }}>
                        <Text style={{ color: "black", fontFamily: "Montserrat-Bold", margin: 5 }}>{item.points}</Text>
                        <Text style={{ color: "#525252", fontFamily: "Montserrat-Medium" }}>Points</Text>
                      </View>
                      <View style={{ justifyContent: "center" }}>
                        <Text style={{ color: "black", fontFamily: "Montserrat-Bold", marginVertical: 5 }}>{item.name}</Text>
                        <Text
                          numberOfLines={2}
                          style={{
                            color: "gray",
                            fontFamily: "Montserrat-Medium",
                            flexWrap: "wrap",
                            maxWidth: 200,
                          }}
                        >
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            } else if (!redeemedInfo[index] && points >= item.points) {
              /*
               Claimable Reward
              */
              return (
                <TouchableOpacity
                  onPress={() => {
                    setRewardInfo(item);
                    setVisible(true);
                  }}
                >
                  <View style={{ marginHorizontal: 15 }}>
                    <LinearGradient
                      style={styles.linearGradient}
                      colors={["#F37121", "#F37121", "#F37121"]}
                      start={{ x: 0.0, y: 0.25 }}
                      end={{ x: 0.5, y: 1.0 }}
                    >
                      <View
                        style={{
                          height: 120,
                          borderRadius: 10,
                          padding: 30,
                          flexDirection: "row",
                          flex: 1,
                        }}
                      >
                        <View style={{ justifyContent: "center", alignItems: "center", marginRight: 30 }}>
                          <Text style={{ color: "white", fontFamily: "Montserrat-Bold", margin: 5 }}>{item.points}</Text>
                          <Text style={{ color: "#f2f2f2", fontFamily: "Montserrat-Medium" }}>Points</Text>
                        </View>
                        <View style={{ justifyContent: "center" }}>
                          <Text style={{ color: "#f2f2f2", fontFamily: "Montserrat-SemiBold", marginVertical: 5 }}>
                            Claim Reward
                          </Text>
                          <Text style={{ color: "white", fontFamily: "Montserrat-Bold" }}>{item.name}</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              );
            } else if (redeemedInfo[index] == "pending" && points >= item.points) {
              /*
               Claimed and Pending
              */
              return (
                <TouchableOpacity
                  onPress={() => {
                    setRewardInfo(item);
                    setVisible(true);
                  }}
                >
                  <View style={{ marginHorizontal: 15 }}>
                    <LinearGradient
                      style={styles.linearGradient}
                      colors={["#F37121", "#F37121", "#F37121"]}
                      start={{ x: 0.0, y: 0.25 }}
                      end={{ x: 0.5, y: 1.0 }}
                    >
                      <View
                        style={{
                          height: 120,
                          borderRadius: 10,
                          padding: 30,
                          flexDirection: "row",
                          flex: 1,
                        }}
                      >
                        <View style={{ justifyContent: "center", alignItems: "center", marginRight: 30 }}>
                          <Text style={{ color: "white", fontFamily: "Montserrat-Bold", margin: 5 }}>{item.points}</Text>
                          <Text style={{ color: "#f2f2f2", fontFamily: "Montserrat-Medium" }}>Points</Text>
                        </View>
                        <View style={{ justifyContent: "center" }}>
                          <Text style={{ color: "white", fontFamily: "Montserrat-Bold" }}>Reward Pending...</Text>
                          <Text style={{ color: "#f2f2f2", fontFamily: "Montserrat-Medium", marginVertical: 5, fontSize: 11 }}>
                            Visit Crown and claim your reward.
                          </Text>
                          <Text style={{ color: "white", fontFamily: "Montserrat-SemiBold" }}>{item.name}</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              );
            } else if (redeemedInfo[index] && points >= item.points) {
              /*
               Reward already redeemed
              */
              return (
                <TouchableOpacity
                  onPress={() => {
                    setRewardInfo(item);
                    setVisible(true);
                  }}
                >
                  <View style={{ marginHorizontal: 15 }}>
                    <LinearGradient
                      style={styles.linearGradient}
                      colors={["#ffe2cc", "#ffe2cc", "#ffe2cc"]}
                      start={{ x: 0.0, y: 0.25 }}
                      end={{ x: 0.5, y: 1.0 }}
                    >
                      <View
                        style={{
                          height: 120,
                          borderRadius: 10,
                          padding: 30,
                          flexDirection: "row",
                          flex: 1,
                        }}
                      >
                        <View style={{ justifyContent: "center", alignItems: "center", marginRight: 30 }}>
                          <Text style={{ color: "#F37121", fontFamily: "Montserrat-Bold", margin: 5 }}>{item.points}</Text>
                          <Text style={{ color: "#F37121", fontFamily: "Montserrat-Medium" }}>Points</Text>
                        </View>
                        <View style={{ justifyContent: "center" }}>
                          <Text style={{ color: "#F37121", fontFamily: "Montserrat-Bold" }}>{item.name}</Text>
                          <Text style={{ color: "#F37121", fontFamily: "Montserrat-Bold", marginVertical: 3 }}>Redeemed</Text>
                          <Text
                            numberOfLines={2}
                            style={{
                              color: "#F37121",
                              fontFamily: "Montserrat-Medium",
                              flexWrap: "wrap",
                              maxWidth: 200,
                              fontSize: 12,
                            }}
                          >
                            {item.description}
                          </Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              );
            }
          }}
        />
      </View>
    </View>
  );
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

  redeemedText: {
    fontFamily: "Montserrat-Bold",
    color: "#eb6543",
    fontSize: 20,
  },

  rewardInfoModal: {
    width: width - 50,
    height: height - 300,
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
    marginTop: 25,
    width: width,
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
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
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
    marginTop: 20,
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
    fontSize: 20,
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
