import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { getAuth } from "@firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import { Portal, Modal } from "react-native-paper";
import CircularProgress from "react-native-circular-progress-indicator";
import { IconButton } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import {
  resetPoints,
  setRewardInfo,
  setMaxPoints,
  setPoints,
  setRewardRedeem,
} from "../redux/actions";
import { rewardsList } from "../Data/rewards";
import { MontserratFont } from "../assets/fonts";
import * as Font from "expo-font";
import { getTimestamp } from "react-native-reanimated/lib/reanimated2/core";

const Stack = createStackNavigator();

export default function RewardsStackScreen() {
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
  const { points } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const db = getDatabase();
  const maxPoints = 1000;
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
    loadFont();
    dispatch(resetPoints);
    updatePoints(0);
  }, []);

  useEffect(() => {
    checkPointsLeft();
  }, [points]);

  function updatePoints(total) {
    onValue(ref(db, "users/" + uid), (snapshot) => {
      if (snapshot.exists()) {
        update(ref(db, "users/" + uid), {
          points: total,
        });
      }
    });
  }

  function changePoints(n) {
    console.log("changed points by", n);
    let total = points + n;
    if (total < maxPoints) {
      //console.log(total);
      dispatch(setPoints(points, n));
      // eventualy change updatePoints to timer
      updatePoints(total);
    } else {
      dispatch(setMaxPoints(maxPoints));
      // updatePoints(maxPoints);
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
              <Image
                style={styles.headerIcon}
                source={require("../assets/icons8-trophy-48.png")}
              />
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
              <Image
                style={styles.subtitleIcon}
                source={require("../assets/icons8-prize-48.png")}
              />
              <Text style={styles.subtitleText}>
                {pointsLeft} points to next reward
              </Text>
            </View>
            <View style={styles.redeemContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("Redeem")}>
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
  const dispatch = useDispatch();
  const [rewardInfo, setRewardInfo] = useState(null);
  const [visible, setVisible] = useState(false);

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
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
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
              <Text style={styles.rewardName}>{rewardInfo?.name}</Text>
              <Text style={styles.rewardDescription}>
                {rewardInfo?.description}
              </Text>
              <Image
                style={styles.rewardsImage}
                source={rewardInfo?.image}
                resizeMode={"contain"}
              />
              <Text style={styles.rewardsPoints}>
                Redeem at {rewardInfo?.points} points
              </Text>
              {points >= rewardInfo?.points ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert("redeem clicked");
                      dispatch(setRewardRedeem(rewardInfo?.redeemed));
                      setVisible(false);
                    }}
                  >
                    <View style={styles.redeemButton}>
                      <Text style={styles.redeemBtnText}>Redeem</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ marginHorizontal: 20, marginTop: 25 }}>
                  <Text style={styles.errorText}>
                    You don't have enough points to redeem this reward
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </Portal>
      <View style={styles.modalRewardsContainer}>
        <FlatList
          data={rewardsList}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => Separator()}
          renderItem={({ item, index }) => {
            if (item.redeemed === false && points < item.points) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setVisible(true);
                    setRewardInfo(item);
                  }}
                >
                  <View style={styles.itemContainer}>
                    <View style={styles.itemNumContainer}>
                      <Text style={styles.itemNumText}>Reward #{item.id}</Text>
                    </View>
                    <View style={styles.itemMetaContainer}>
                      <Text style={styles.itemNameText}>{item.name}</Text>
                      <Text style={styles.itemPointsText}>
                        {item.points} Points
                      </Text>
                      <Text
                        style={styles.itemDescriptionText}
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            } else if (item.redeemed === false && points >= item.points) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setVisible(true);
                    setRewardInfo(item);
                  }}
                >
                  <View style={styles.unclaimedView}>
                    <Text style={styles.unclaimedText}>CLAIM REWARD!</Text>
                  </View>
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("You have already redeemed this reward")
                  }
                >
                  <View style={styles.redeemedContainer}>
                    <View style={styles.redeemedView}>
                      <Text style={styles.redeemedText}>REDEEMED</Text>
                    </View>
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
    borderRadius: 5,
    borderWidth: 3,
    height: 110,
    backgroundColor: "#F37121",
    alignItems: "center",
    justifyContent: "center",
  },

  redeemedText: {
    fontFamily: "Montserrat-Bold",
    color: "white",
    fontSize: 24,
  },

  rewardInfoModal: {
    width: width - 50,
    height: height - 300,
    backgroundColor: "white",
    marginLeft: 25,
  },

  rewardInfoContainer: {
    alignItems: "center",
  },

  rewardName: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 24,
    marginTop: 25,
  },

  rewardDescription: {
    fontFamily: "Montserrat_400Regular",
  },

  rewardsPoints: {
    fontFamily: "Montserrat_700Bold",
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
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    textAlign: "center",
  },

  unclaimedView: {
    borderRadius: 5,
    borderWidth: 3,
    height: 110,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },

  unclaimedText: {
    fontFamily: "Montserrat_700Bold",
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
    borderWidth: 3,
    borderRadius: 5,
  },

  itemNumText: {
    fontFamily: "Montserrat-Bold",
    transform: [{ rotate: "270deg" }],
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
    marginTop: 30,
    backgroundColor: "#F37121",
    borderRadius: 5,
    width: 160,
    height: 80,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  redeemBtnText: {
    fontFamily: "Montserrat-Medium",
    color: "white",
    fontSize: 24,
  },

  itemMetaContainer: {
    margin: 20,
    maxWidth: 240,
    width: 240,
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
    marginTop: 20,
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
    marginTop: 20,
  },

  redeemBtn: {
    height: 40,
    width: 200,
    backgroundColor: "#F37121",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },

  redeemText: {
    color: "white",
    fontFamily: "Montserrat-Bold",
  },
});
