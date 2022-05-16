import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  FlatList,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
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
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useCollapsibleHeader } from "react-navigation-collapsible";

export default function Header({ navigation }) {
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

  const { onScroll, containerPaddingTop, scrollIndicatorInsetTop, translateY } =
    useCollapsibleHeader({
      navigationOptions: {
        headerStyle: {
          backgroundColor: "#F6F4F4",
        },
      },
    });

  const stickyHeaderHeight = 64;

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
          <Image
            style={styles.caxyLogo}
            source={require("../assets/LFA_interlocking_logo_F2.png")}
          />
          <Text style={styles.caxyAthleticsTxt}>Caxy Athletics</Text>
        </View>
        <TouchableOpacity>
          <View style={styles.pointsBtn}>
            <Text style={styles.pointsTxt}>330 Points</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const HeaderTab = createBottomTabNavigator();

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F6F4F4",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    maxHeight: 64,
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  caxyAthleticsTxt: {
    fontSize: 20,
    color: "#3E3939",
    fontFamily: "Montserrat_700Bold",
    justifyContent: "center",
    paddingLeft: 10,
  },

  caxyLogo: {
    width: 40,
    height: 40,
  },

  pointsBtn: {
    backgroundColor: "#F37121",
    width: 80,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    transform: [{ translateY: 6 }],
  },

  pointsTxt: {
    fontSize: 12,
    textAlign: "center",
    color: "white",
    fontFamily: "Montserrat_700Bold",
  },
});
