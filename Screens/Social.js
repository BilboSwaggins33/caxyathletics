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
import { Button } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { useSelector } from "react-redux";
import * as Font from 'expo-font'
import { MontserratFont } from "../assets/fonts";

export default function Social({ navigation }) {
  const [users, setUsers] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [currentUser, setCurrentUser] = useState([])
  const { user } = useSelector((state) => state.userReducer)

  const db = getDatabase();
  const auth = getAuth();
  const usersRef = ref(db, 'users/')
  //const { user } = useSelector((state) => state.userReducer);
  const { points } = useSelector((state) => state.userReducer)
  console.log(points)

  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true)
  }

  useEffect(() => {
    loadFont()
    onValue(usersRef, (snapshot) => {
      setUsers(Object.values(snapshot.val()).sort((a, b) => (a.points < b.points)))
    })
    setCurrentUser(user)
  }, [currentUser])

  const SignOutButton = () => (
    <Button
      uppercase={false}
      style={{ backgroundColor: "#F37121", marginVertical: 50 }}
      labelStyle={{ fontFamily: "Montserrat-SemiBold" }}
      mode="contained"
      onPress={() => {
        signOut(auth)
      }}
    >
      Sign Out
    </Button>
  );

  if (!fontsLoaded) {
    return null
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
        <View style={styles.leaderboardContainer}>
          <FlatList
            data={users.slice(0, 3)}
            contentContainerStyle={{ padding: 15 }}
            renderItem={({ item, index }) => (
              <Text style={styles.leaderboardText}>
                {index + 1}. {item.name} : {item.points} points
              </Text>
            )}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F4F4",
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
