import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
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
} from "@expo-google-fonts/montserrat";
import AppLoading from "expo-app-loading";
import { rewards } from "../Data/rewards";
import CircularProgress from "react-native-circular-progress-indicator";
import { IconButton } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function StackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="Rewards" component={Rewards} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <qStack.Screen name="Redeem" component={RedeemModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function RedeemModal({ navigation }) {
  return (
    <View>
      <Text>Modal</Text>
      <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
    </View>
  );
}

function Rewards({ navigation }) {
  const [data, setData] = useState(rewards);
  const [points, setPoints] = useState(330);

  useEffect(() => {
    setPoints(0);
  }, []);

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
  });

  if (!fontsLoaded) {
    return <AppLoading />;
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

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F4F4",
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
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    color: "#3E3939",
    marginLeft: 5,
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
