import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "../Components/Header";

export default function Social({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View>
        <Text>Social</Text>
      </View>
    </SafeAreaView>
  );
}

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  rewardsBtn: {
    backgroundColor: "#F37121",
    width: (245 / 390) * width,
    height: (70 / 844) * height,
    left: width - 25 - (245 / 390) * width,
    top: 50,
    borderRadius: 10,
  },
});
