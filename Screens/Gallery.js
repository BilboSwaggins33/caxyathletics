import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, onValue, update, get } from "firebase/database";
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
  ScrollView,
} from "react-native";
import Header from "../Components/Header";
import { Button, IconButton } from "react-native-paper";
import * as Font from 'expo-font'
import { MontserratFont } from "../assets/fonts";

export default function Gallery({ navigation }) {
  const [photos, setPhotos] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [img, setIMG] = useState({});
  const db = getDatabase();
  const galleryRef = ref(db, "gallery/");
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true)
  }

  useEffect(() => {

    onValue(galleryRef, (snapshot) => {
      setPhotos(Object.values(snapshot.val()));
    });
    loadFont()
  }, []);



  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  const handlePicture = (item) => {
    const userRef = ref(db, "users/" + item.user);
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
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView stickyHeaderIndices={[0]}>
          <Header />
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={styles.headerIcon}
                  source={require("../assets/icons8-photo-gallery-48.png")}
                />
                <Text style={styles.headerText}>Gallery</Text>
              </View>
              <Button onPress={() => { navigation.navigate("TakePicture") }} uppercase={false} icon="camera" style={{ backgroundColor: '#F37121' }} labelStyle={{ fontFamily: "Montserrat-Bold" }} mode="contained" >
                Take Photo
              </Button>
            </View>
          </View>
          <View style={styles.photoGallery}>
            {
              photos.map((item, index) => (
                <View key={index} style={styles.gridView}>
                  <TouchableOpacity onPress={() => { handlePicture(item) }}>
                    <Image source={{ uri: item.uri }} style={styles.imageView} />
                  </TouchableOpacity>
                </View>
              ))
            }
          </View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <SafeAreaView>
              <View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <IconButton icon="arrow-left" onPress={() => setModalVisible(!modalVisible)} />
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={{ uri: img.profUrl }} style={{ width: 25, height: 25, borderRadius: 25, marginRight: 10 }} />
                      <Text style={styles.modalText}>{img.user}</Text>
                    </View>
                    <Text style={[styles.modalText, styles.time]}>{img.time}</Text>
                  </View>
                  <Text>           </Text>
                </View>
              </View>
              <Image resizeMode="contain" source={{ uri: img.uri }} style={{ width: '100%', height: 'auto', aspectRatio: 9 / 16 }} />
            </SafeAreaView>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F4F4",
  },
  headerContainer: {
    margin: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerText: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#3E3939",
    marginLeft: 10,
  },
  headerIcon: {
    maxWidth: 24,
    maxHeight: 24,
  },

  button: {
    borderRadius: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#3E3939",
    marginTop: 10
  },
  modalText: {
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  time: {
    marginVertical: 5,
  },
  photoGallery: {
    backgroundColor: "#F6F4F4",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  gridView: {
    width: '33.33%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  imageView: {
    width: '100%',
    alignSelf: 'center',
    height: 'auto',
    aspectRatio: 1 / 1
  }
});
