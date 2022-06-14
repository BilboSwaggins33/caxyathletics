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
  FlatList,
  ActivityIndicator,
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
import { getAuth, signOut } from "firebase/auth";
import { styleProps } from "react-native-web/dist/cjs/modules/forwardedProps";
import AnnouncementModal from "../Components/AnnouncementModal";
import { Provider } from "react-native-paper";
import { getDatabase, ref, set, onValue, update } from "firebase/database";

export default function Home({ navigation }) {
  const auth = getAuth();
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
  const [photos, setPhotos] = useState([]);
  const db = getDatabase();
  const galleryRef = ref(db, "gallery/");
  useEffect(() => {
    onValue(galleryRef, (snapshot) => {
      setPhotos(Object.values(snapshot.val()).slice(-4));
      //console.log(Object.values(snapshot.val()).slice(-4))
    });
  }, []);
  useEffect(() => {
    if (eventClicked) {
      window.location.assign("https://www.lfacaxys.org/");
    }
  });

  const handlePress = () => {
    console.log("presssed");
    navigation.navigate("Gallery");
  };

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
          <TouchableOpacity onPress={handlePress}>
            <View style={styles.photoGallery}>
              {photos.slice(0, 4).map((item, index) => (
                <View style={styles.gridView}>
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.imageView}
                  />
                </View>
              ))}
            </View>
          </TouchableOpacity>
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
    flex: 1
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
    backgroundColor: "white",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  gridView: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  imageView: {
    width: '100%',
    alignSelf: 'center',
    height: 'auto',
    aspectRatio: '1/1'
  }
});
