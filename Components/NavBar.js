import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CheckIn from "../Screens/CheckIn";
import Home from "../Screens/Home";
import Gallery from "../Screens/Gallery";
import PhotoStack from "../Screens/TakePicture";
import TakePicture from "../Screens/TakePicture";
import RewardsStackScreen from "../Screens/Rewards";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./Header";
import SocialStack from "../Screens/Social";
import Admin from "../Screens/Admin"
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const HomeStackNav = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{ gestureEnabled: false }}
      />
      <HomeStack.Screen name="Gallery" component={Gallery} />
      <HomeStack.Screen name="TakePicture" component={PhotoStack} />
      <HomeStack.Screen name="Admin" component={Admin} />
    </HomeStack.Navigator>
  );
};
export default function NavBar({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let type;

          if (route.name === "HomeStack") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "Check In") {
            iconName = focused ? "ios-location" : "ios-location-outline";
          } else if (route.name === "Social") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          } else if (route.name === "Rewards") {
            iconName = focused ? "trophy" : "trophy-outline";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "#F37121",
        tabBarStyle: {
          height: 85,
          paddingTop: 10,
          borderTopWidth: 1,
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 20,
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNav}
        options={{ title: "Home", gestureEnabled: false }}
      />
      <Tab.Screen name="Check In" component={CheckIn} />
      <Tab.Screen name="Rewards" component={RewardsStackScreen} />
      <Tab.Screen name="Social" component={SocialStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
