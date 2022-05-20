import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "../Components/Header";
import { Button } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light_Italic,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black_Italic,
} from "@expo-google-fonts/montserrat";
import AppLoading from "expo-app-loading";
import { ScrollView } from "react-native-gesture-handler";

export default function Social({ navigation }) {
  let [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light_Italic,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black_Italic,
  });

  const auth = getAuth();

  const SignOutButton = () => (
    <Button
      uppercase={false}
      style={{ backgroundColor: "#F37121" }}
      labelStyle={{ fontFamily: "Montserrat_600SemiBold" }}
      mode="contained"
      onPress={() => {
        signOut(auth)
          .then(() => {
            navigation.navigate("Login");
            // Sign-out successful.
          })
          .catch((error) => {
            // An error happened.
          });
      }}
    >
      Sign Out
    </Button>
  );

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll} stickyHeaderIndices={[0]}>
          <Header />
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Image
                style={styles.headerIcon}
                source={require("../assets/icons8-user-48.png")}
              />
              <Text style={styles.headerText}>Profile</Text>
            </View>
            <View style={styles.profileContainer}></View>
            <View style={styles.headerContainer}>
              <Image
                style={styles.headerIcon}
                source={require("../assets/icons8-leaderboard-48.png")}
              />
              <Text style={styles.headerText}>Leaderboard</Text>
            </View>
            <View style={styles.leaderboardContainer}></View>
          </View>
          <SignOutButton />
        </ScrollView>
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
