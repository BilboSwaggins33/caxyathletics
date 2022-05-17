import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from "react-native";
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
import NavBar from "../Components/NavBar";
import Header from "../Components/Header";
<<<<<<< HEAD
import { getAuth, signOut } from "firebase/auth"
=======
import { styleProps } from "react-native-web/dist/cjs/modules/forwardedProps";
import AnnouncementModal from "../Components/AnnouncementModal";
import { Provider } from "react-native-paper";

>>>>>>> 017bd8c5743e67f2da80bbf9c09ee9187971225b
export default function Home() {

  const auth = getAuth()
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

  const [eventClicked, setEventClicked] = useState(false);

  useEffect(() => {
    if (eventClicked) {
      window.location.assign("https://www.lfacaxys.org/");
    }
  });

  const lfaURL = "https://www.lfacaxys.org/";

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll} stickyHeaderIndices={[0]}>
          <Header />
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <Image
                style={styles.headerIcon}
                source={require("../assets/icons8-megaphone-48.png")}
              />
              <Text style={styles.headerText}>Announcements</Text>
            </View>
            <AnnouncementModal />
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <Image
                style={styles.headerIcon}
                source={require("../assets/icons8-schedule-48.png")}
              />
              <Text style={styles.headerText}>Events</Text>
            </View>
            <MoreEventsBtn url={lfaURL}></MoreEventsBtn>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <Image
                style={styles.headerIcon}
                source={require("../assets/icons8-photo-gallery-48.png")}
              />
              <Text style={styles.headerText}>Photo Gallery</Text>
            </View>
          </View>
          <View style={styles.photoGallery}></View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function MoreEventsBtn({ url }) {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Cannot open LFA Caxy Website");
    }
  }, [url]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.eventsBtn}>
        <Text style={styles.eventsText}>More Events</Text>
      </View>
    </TouchableOpacity>
  );
}

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F4F4",
  },

  scroll: {
    backgroundColor: "#F6F4F4",
  },

  headerContainer: {
    marginLeft: 25,
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 12,
    alignItems: "center",
  },

  sectionContainer: {
    marginBottom: 10,
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

  announcementView: {
    backgroundColor: "#F37121",
    width: width - 50,
    height: 130,
    borderRadius: 20,
    marginLeft: 25,
  },

  announcementTitle: {
    fontFamily: "Montserrat_700Bold",
    color: "white",
    fontSize: 16,
    marginLeft: 15,
    marginTop: 10,
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
    marginVertical: 8,
  },

  infoIcon: {
    tintColor: "white",
    height: 16,
    width: 16,
  },

  infoText: {
    color: "white",
    fontFamily: "Montserrat_700Bold",
    fontSize: 12,
  },

  eventsBtn: {
    backgroundColor: "white",
    width: width - 50,
    marginLeft: 25,
    borderRadius: 20,
    height: 70,
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    justifyContent: "center",
  },

  eventsText: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#F37121",
  },

  photoGallery: {
    width: width - 50,
    height: 400,
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 25,
    marginBottom: 25,
  },
});
