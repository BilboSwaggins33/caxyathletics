import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { rewards } from "../Data/rewards";
import CircularProgress from "react-native-circular-progress-indicator";
import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_600SemiBold,
  Montserrat_500Medium,
} from "@expo-google-fonts/montserrat";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";

export default function RewardsBar({ navigation }) {
  const [data, setData] = useState(rewards);
  const [points, setPoints] = useState(330);

  const maxPoints = 1000;

  let [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_500Medium,
  });

  useEffect(() => {
    setPoints(0);
  }, []);

  return (
    <View style={styles.container}>
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
          progressValueStyle={{ fontFamily: "Montserrat_700Bold" }}
          subtitle={"Points"}
          subtitleStyle={styles.rewardsText}
        />
      </View>
      <IconButton
        icon="plus"
        color="black"
        size={36}
        onPress={() => setPoints(points + 50)}
        style={{ position: "relative" }}
      />
      <View style={styles.textContainer}>
        <Image
          style={styles.subtitleIcon}
          source={require("../assets/icons8-prize-48.png")}
        />
        <Text style={styles.subtitleText}>70 points to next reward</Text>
      </View>
      <View style={styles.redeemContainer}>
        <TouchableOpacity>
          <View style={styles.redeemBtn}>
            <Text style={styles.redeemText}>Redeem Rewards</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },

  rewardsText: {
    fontFamily: "Montserrat_700Bold",
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
    fontFamily: "Montserrat_500Medium",
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
    fontFamily: "Montserrat_700Bold",
  },
});
