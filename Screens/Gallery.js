import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { initializeApp } from "@firebase/app";
import * as WebBrowser from "expo-web-browser";
import { firebaseConfig } from "../config";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_600SemiBold,
  Montserrat_500Medium,
} from "@expo-google-fonts/montserrat";
import NavBar from "../Components/NavBar";
import Header from "../Components/Header";
import { Button } from "react-native-paper";

export default function Gallery({ navigation }) {
  const [photos, setPhotos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [img, setIMG] = useState({});
  const db = getDatabase();
  const galleryRef = ref(db, "gallery/");
  useEffect(() => {
    onValue(galleryRef, (snapshot) => {
      setPhotos(Object.values(snapshot.val()));
    });
  }, []);

  let [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_500Medium,
  });
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  const handlePicture = (item) => {
    const userRef = ref(db, "users/" + item.postedBy);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      //console.log(data)
      setIMG({
        user: data.name,
        uri: item.uri,
        profUrl: data.profileUrl,
        time: item.time,
      });
      setModalVisible(true);
    });
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <Header />
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            source={{ uri: img.profUrl }}
                            style={{
                              width: 25,
                              height: 25,
                              borderRadius: 25,
                              marginRight: 10,
                            }}
                          />
                          <Text style={styles.modalText}>{img.user}</Text>
                        </View>
                        <Text style={[styles.modalText, styles.time]}>
                          {img.time}
                        </Text>
                      </View>
                      <Image
                        source={{ uri: img.uri }}
                        style={{
                          width: width,
                          height: height - 200,
                          borderRadius: 10,
                        }}
                      />
                      <Button
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                        uppercase={false}
                      >
                        <Text style={styles.textStyle}>Close</Text>
                      </Button>
                    </View>
                  </View>
                </Modal>
                <View style={styles.sectionContainer}>
                  <View style={styles.headerContainer}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        style={styles.headerIcon}
                        source={require("../assets/icons8-photo-gallery-48.png")}
                      />
                      <Text style={styles.headerText}>Gallery</Text>
                    </View>
                    <Button
                      onPress={() => {
                        navigation.navigate("TakePicture");
                      }}
                      uppercase={false}
                      icon="camera"
                      style={{ backgroundColor: "#F37121" }}
                      labelStyle={{ fontFamily: "Montserrat_700Bold" }}
                      mode="contained"
                    >
                      Take Photo
                    </Button>
                  </View>
                </View>
                <FlatList
                  data={photos}
                  numColumns={3}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        handlePicture(item);
                      }}
                      style={{
                        aspectRatio: 1 / 1,
                        width: "33.33%",
                        height: undefined,
                      }}
                    >
                      <Image
                        source={{ uri: item.uri }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={{ paddingBottom: 250 }}
                />
                <Text style={styles.modalText}>{img.user}</Text>
              </View>
              <Text style={[styles.modalText, styles.time]}>{img.time}</Text>
            </View>
            <Image
              source={{ uri: img.uri }}
              style={{
                width: width - 80,
                height: height - 250,
                borderRadius: 10,
              }}
            />
            <Button
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
              uppercase={false}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Button>
          </View>
        </Modal>
        <View style={styles.sectionContainer}>
          <View style={styles.headerContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={styles.headerIcon}
                source={require("../assets/icons8-photo-gallery-48.png")}
              />
              <Text style={styles.headerText}>Gallery</Text>
            </View>
            <Button
              onPress={() => {
                navigation.navigate("TakePicture");
              }}
              uppercase={false}
              icon="camera"
              style={{ backgroundColor: "#F37121" }}
              labelStyle={{ fontFamily: "Montserrat_700Bold" }}
              mode="contained"
            >
              Take Photo
            </Button>
          </View>
        </View>
        <FlatList
          data={photos}
          numColumns={3}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                handlePicture(item);
              }}
              style={{
                aspectRatio: 1 / 1,
                width: "33.33%",
                height: undefined,
              }}
            >
              <Image
                source={{ uri: item.uri }}
                style={{ width: "100%", height: "100%" }}
              />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 250 }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F4F4",
  },
  sectionContainer: {
    marginTop: 20,
  },
  headerContainer: {
    margin: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    elevation: 2,
    marginTop: 20,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#3E3939",
  },
  modalText: {
    textAlign: "center",
    fontFamily: "Montserrat_500Medium",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  time: {
    marginVertical: 5,
  },
});
