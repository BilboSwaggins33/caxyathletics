import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "../Components/Header";
import { ActivityIndicator, Button } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { useSelector } from "react-redux";
import { Portal, Modal, IconButton } from "react-native-paper";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import { styleProps } from "react-native-web/dist/cjs/modules/forwardedProps";

const Stack = createStackNavigator();

export default function SocialStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="Social" component={Social} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Leaderboard" component={LeaderboardModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function Social({ navigation }) {
  const [users, setUsers] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const { user } = useSelector((state) => state.userReducer);

  const db = getDatabase();
  const auth = getAuth();
  const usersRef = ref(db, "users/");
  const { points } = useSelector((state) => state.userReducer);
  console.log(points);

  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }

  useEffect(() => {
    loadFont();
    onValue(usersRef, (snapshot) => {
      setUsers(
        Object.values(snapshot.val()).sort((a, b) => a.points < b.points)
      );
    });
    setCurrentUser(user);
  }, [currentUser]);

  const SignOutButton = () => (
    <Button
      uppercase={false}
      style={{ backgroundColor: "#F37121", marginVertical: 50 }}
      labelStyle={{ fontFamily: "Montserrat-SemiBold" }}
      mode="contained"
      onPress={() => {
        signOut(auth);
      }}
    >
      Sign Out
    </Button>
  );

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.headerContainer}>
          <Image
            style={styles.headerIcon}
            source={require("../assets/icons8-user-48.png")}
          />
          <Text style={styles.headerText}>Profile</Text>
          <Image
            style={styles.settingsIcon}
            source={require("../assets/icons8-settings-48.png")}
          />
        </View>
        <View style={styles.profileContainer}>
          <Image
            style={{
              width: 100,
              height: 100,
              marginVertical: 20,
              borderRadius: 100,
            }}
            source={{ uri: currentUser.photoURL }}
          />
          <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 20 }}>
            {currentUser.displayName}
          </Text>
          <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 20 }}>
            {points}
          </Text>
          <SignOutButton />
        </View>
        <View style={styles.headerContainer}>
          <Image
            style={styles.headerIcon}
            source={require("../assets/icons8-leaderboard-48.png")}
          />
          <Text style={styles.headerText}>Leaderboard</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Leaderboard")}>
          <View style={styles.leaderboardContainer}>
            {/* <FlatList
            data={users.slice(0, 3)}
            contentContainerStyle={{ padding: 15 }}
            renderItem={({ item, index }) => (
              <Text style={styles.leaderboardText}>
                {index + 1}. {item.name} : {item.points} points
              </Text>
            )}
          /> */}
            <Text style={styles.lbText}>View Leaderboard</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

function LeaderboardModal({ navigation }) {
  const [users, setUsers] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const { user } = useSelector((state) => state.userReducer);
  const db = getDatabase();
  const auth = getAuth();
  const usersRef = ref(db, "users/");
  const { points } = useSelector((state) => state.userReducer);

  useEffect(() => {
    loadFont();
    onValue(usersRef, (snapshot) => {
      setUsers(
        Object.values(snapshot.val()).sort((a, b) => a.points < b.points)
      );
    });
    setCurrentUser(user);
  }, [currentUser]);

  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }

  function Separator() {
    return (
      <View
        style={{
          marginVertical: 5,
          width: width - 50,
          alignItems: "center",
          left: 25,
          justifyContent: "center",
          // backgroundColor: "black",
          // height: 3,
        }}
      />
    );
  }

  if (typeof users === "undefined") {
    <ActivityIndicator />;
  } else {
    return (
      <View>
        <View style={styles.modalHeaderContainer}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <Text style={styles.modalHeaderText}>Leaderboard</Text>
          <Text></Text>
        </View>
        <View style={styles.userRankContainer}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.lbUserText}>Rank</Text>
            <Text style={styles.lbUserBoldText}>22</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: "white",
                marginBottom: 5,
              }}
              source={{ uri: currentUser.photoURL }}
            />
            <Text style={styles.lbUserText}>{currentUser.displayName}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.lbUserText}>Points</Text>
            <Text style={styles.lbUserBoldText}>{points}</Text>
          </View>
        </View>
        {/* <View style={styles.podiumContainer}>
          <View style={styles.rank2}>
            <Image
              style={styles.secondIcon}
              source={require("../assets/icons8-second-place-ribbon-48.png")}
            />
            <Text style={styles.podiumName}>{users[1]?.name}</Text>
            <Text style={styles.podiumPoints}>{users[1]?.points} pts</Text>
          </View>
          <View style={styles.rank1}>
            <Image
              style={styles.firstIcon}
              source={require("../assets/icons8-first-place-ribbon-60.png")}
            />

            <Text style={styles.podiumName}>{users[0]?.name}</Text>
            <Text style={styles.podiumPoints}>{users[0]?.points} pts</Text>
          </View>
          <View style={styles.rank3}>
            <Image
              style={styles.thirdIcon}
              source={require("../assets/icons8-third-place-ribbon-48.png")}
            />
            <Text style={styles.podiumName}>{users[2]?.name}</Text>
            <Text style={styles.podiumPoints}>{users[2]?.points} pts</Text>
          </View>
        </View> */}

        <View style={styles.modalLeaderboardContainer}>
          {/* <View style={styles.lbHeader}>
            <Text style={styles.lbHeaderText}>Rank</Text>
            <Text style={styles.lbHeaderText}>User</Text>
            <Text style={styles.lbHeaderText}></Text>
            <Text style={styles.lbHeaderText}></Text>
            <Text style={styles.lbHeaderText}>Points</Text>
          </View> */}

          <FlatList
            data={users}
            // ItemSeparatorComponent={() => Separator()}
            renderItem={({ item, index }) => {
              if (index === 0) {
                return (
                  <View style={styles.lbContainer}>
                    <Image
                      style={styles.firstIcon}
                      source={require("../assets/icons8-trophy-60.png")}
                    />
                    <Text style={styles.userText}>{users[0]?.name}</Text>
                    <Text style={styles.pointsText}>{users[0]?.points}</Text>
                  </View>
                );
              } else if (index === 1) {
                return (
                  <View style={styles.lbContainer}>
                    <Image
                      style={styles.secondIcon}
                      source={require("../assets/icons8-trophy-60.png")}
                    />
                    <Text style={styles.userText}>{users[1]?.name}</Text>
                    <Text style={styles.pointsText}>{users[1]?.points}</Text>
                  </View>
                );
              } else if (index === 2) {
                return (
                  <View style={styles.lbContainer}>
                    <Image
                      style={styles.thirdIcon}
                      source={require("../assets/icons8-trophy-60.png")}
                    />
                    <Text style={styles.userText}>{users[2]?.name}</Text>
                    <Text style={styles.pointsText}>{users[2]?.points}</Text>
                  </View>
                );
              } else {
                return (
                  <View style={styles.lbContainer}>
                    <Text style={styles.lbRankText}>{index + 1} </Text>
                    <Text style={styles.userText}>{item.name}</Text>
                    <Text></Text>
                    <Text style={styles.pointsText}>{item.points}</Text>
                  </View>
                );
              }
            }}
          />
        </View>

        {/* <Button onPress={() => console.log(currentUser)}> Click</Button> */}
      </View>
    );
  }
}

// users.slice(0, 3) --> for top 3 users

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F4F4",
  },

  podiumContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
  },

  lbUserText: {
    fontFamily: "Montserrat-Regular",
    color: "white",
    fontSize: 16,
  },

  lbUserBoldText: {
    fontFamily: "Montserrat-Bold",
    color: "white",
    fontSize: 20,
  },

  userRankContainer: {
    backgroundColor: "#F37121",
    width: width - 30,
    marginLeft: 15,
    borderRadius: 8,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20,
    marginTop: 10,
  },

  firstIcon: {
    width: 25,
    height: 25,
    tintColor: "gold",
    marginLeft: 20,
  },

  secondIcon: {
    width: 25,
    height: 25,
    tintColor: "silver",
    marginLeft: 20,
  },

  thirdIcon: {
    width: 25,
    height: 25,
    tintColor: "#cd7f32",
    marginLeft: 20,
  },

  lbHeaderText: {
    fontFamily: "Montserrat-Regular",
    color: "white",
    marginHorizontal: 10,
  },

  podiumName: {
    color: "#F37121",
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
  },

  podiumPoints: {
    fontFamily: "Montserrat-Regular",
  },

  rank1: {
    width: width / 3 - 10,
    alignItems: "center",
    justifyContent: "center",
    height: 160,
    borderRadius: 3,
    backgroundColor: "white",
  },

  rank2: {
    left: 15,
    borderRadius: 3,
    width: width / 3 - 25,
    alignItems: "center",
    justifyContent: "center",
    height: 140,
    backgroundColor: "white",
  },

  rank3: {
    right: 15,
    borderRadius: 3,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: width / 3 - 25,
    height: 120,
    borderColor: "black",
    // borderWidth: 1,
  },

  lbRankText: {
    color: "#F37121",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    marginLeft: 25,
  },

  lbHeader: {
    backgroundColor: "#F37121",
    flexDirection: "row",
    width: width - 30,
    marginLeft: 15,
    borderRadius: 5,
    height: 30,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  lbContainer: {
    marginLeft: 15,
    marginRight: 15,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    height: 50,
    borderColor: "black",
    borderRadius: 5,
    marginVertical: 5,
  },

  lbText: {
    fontFamily: "Montserrat-Bold",
  },

  userText: {
    fontFamily: "Montserrat-Bold",
    left: 70,
    position: "absolute",
  },

  pointsText: {
    fontFamily: "Montserrat-Regular",
    position: "absolute",
    right: 15,
  },

  modalHeaderText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    left: -24,
  },

  modalHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  scroll: {
    backgroundColor: "#F6F4F4",
    marginBottom: -50,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 25,
    marginVertical: 10,
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

  settingsIcon: {
    maxWidth: 30,
    maxHeight: 30,
    marginLeft: "auto",
  },

  profileContainer: {
    width: width - 50,
    height: 410,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    marginLeft: 25,
    display: "flex",
    alignItems: "center",
  },

  leaderboardContainer: {
    width: width - 50,
    height: 100,
    marginLeft: 25,
    backgroundColor: "#F37121",
    borderRadius: 20,
  },
  leaderboardText: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "white",
  },
});
