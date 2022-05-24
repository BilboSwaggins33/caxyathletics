import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "../Components/Header";
import { Button } from "react-native-paper"
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { useFonts, Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium } from "@expo-google-fonts/montserrat";

export default function Social({ navigation }) {
  const [users, setUsers] = useState([])
  const db = getDatabase()
  const auth = getAuth();
  const user = auth.currentUser
  const usersRef = ref(db, 'users/')
  //console.log(user.photoURL)
  useEffect(() => {
    onValue(usersRef, (snapshot) => {
      setUsers(Object.values(snapshot.val()).sort((a, b) => (a.points < b.points)))
    })
  }, [])
  let [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_500Medium
  });

  const SignOutButton = () => (
    <Button uppercase={false} style={{ backgroundColor: '#F37121', marginVertical: 50 }} labelStyle={{ fontFamily: "Montserrat_600SemiBold" }} mode="contained" onPress={() => {
      signOut(auth).then(() => {
        navigation.navigate('Login')
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
    }}>
      Sign Out
    </Button>
  );
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.headerContainer}>
        <Image style={styles.headerIcon} source={require("../assets/icons8-user-48.png")} />
        <Text style={styles.headerText}>Profile</Text>
        <Image style={styles.settingsIcon} source={require("../assets/icons8-settings-48.png")} />
      </View>
      <View style={styles.profileContainer}>
        <Image style={{ width: 100, height: 100, marginVertical: 20, borderRadius: 100 }} source={{ uri: user.photoURL }} />
        <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 20 }}>{user.displayName}</Text>
        <SignOutButton />
      </View>
      <View style={styles.headerContainer}>
        <Image style={styles.headerIcon} source={require("../assets/icons8-leaderboard-48.png")} />
        <Text style={styles.headerText}>Leaderboard</Text>
      </View>
      <View style={styles.leaderboardContainer}>
        <FlatList data={users.slice(0, 3)}
          contentContainerStyle={{ padding: 15 }}
          renderItem={({ item, index }) => (
            <Text style={styles.leaderboardText}>{index + 1}. {item.name} : {item.points} points</Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
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
    fontFamily: "Montserrat_700Bold",
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
    marginLeft: 'auto'
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
    display: 'flex',
    alignItems: 'center',
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
    fontFamily: "Montserrat_600SemiBold",
    color: "white",
  },
});
