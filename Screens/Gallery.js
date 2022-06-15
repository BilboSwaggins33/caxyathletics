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
  ScrollView
} from "react-native";
import Header from "../Components/Header";
import { Button } from "react-native-paper";
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
    loadFont()
    onValue(galleryRef, (snapshot) => {
      setPhotos(Object.values(snapshot.val()));
    });
  }, []);



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
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: img.profUrl }} style={{ width: 25, height: 25, borderRadius: 25, marginRight: 10 }} />
                    <Text style={styles.modalText}>{img.user}</Text>
                  </View>
                  <Text style={[styles.modalText, styles.time]}>{img.time}</Text>
                </View>
                <Image source={{ uri: img.uri }} style={{ width: "100%", height: "auto", borderRadius: 10, aspectRatio: 9 / 16 }} />
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
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F4F4",
    flex: 1
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    paddingVertical: 10,
    alignItems: "center",

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
