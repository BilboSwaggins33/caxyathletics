import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "../Components/Header";
import { Button } from "react-native-paper"
import { getAuth, signOut } from "firebase/auth";
import { useFonts, Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium } from "@expo-google-fonts/montserrat";

export default function Social({ navigation }) {

  const auth = getAuth();
  const user = auth.currentUser
  console.log(user.photoURL)

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
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
          <Image style={{ width: 150, height: 150, marginVertical: 30, borderRadius: 100 }} source={{ uri: user.photoURL }} />
          <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 15 }}>{user.displayName}</Text>
        </View>
        <SignOutButton />
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
    marginLeft: 25,
    marginVertical: 10,
  },

  headerText: {
    fontFamily: "Montserrat_700Bold",
    color: "#3E3939",
    marginLeft: 10,
  },

  headerIcon: {
    width: 30,
    height: 30,
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
  },

  leaderboardContainer: {
    width: width - 50,
    height: 100,
    marginLeft: 25,
    backgroundColor: "#F37121",
    borderRadius: 20,
  },
});
