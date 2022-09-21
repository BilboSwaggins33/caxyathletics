import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
export default function ApprovePictures({ navigation }) {
  const [adminphotos, setadminPhotos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [approved, setApproved] = useState(false);
  const [img, setIMG] = useState({});
  const [i, setI] = useState(null);
  const db = getDatabase();
  const admingalleryRef = ref(db, "galleryAdmin/");
  const galleryRef = ref(db, "gallery/");
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      onValue(admingalleryRef, (snapshot) => {
        snapshot.val() ? setadminPhotos(Object.values(snapshot.val())) : setadminPhotos([]);
      });

      onValue(galleryRef, (snapshot) => {
        snapshot.val() ? setPhotos(Object.values(snapshot.val())) : setPhotos([]);
      });
    }

    loadFont();
    return () => {
      isMounted = false;
    };
  }, []);

  const deletePost = () => {
    if (approved) {
      set(ref(db, "gallery/" + i.id), null);
    } else {
      set(ref(db, "galleryAdmin/" + i.id), null);
    }
  };

  const uploadPost = () => {
    if (approved) {
      set(ref(db, "galleryAdmin/" + i.id), i);
    } else {
      set(ref(db, "gallery/" + i.id), i);
    }
  };

  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  const handlePicture = (item, a) => {
    const userRef = ref(db, "users/" + item.user);
    setI(item);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      //console.log(data)
      setIMG({
        user: data.name,
        uri: item.uri,
        profUrl: data.profileUrl,
        time: item.time,
      });
      setApproved(a);
      setModalVisible(true);
    });
  };
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity
          onPress={() => {
            handlePicture(item, true);
          }}
        >
          <Image
            source={{ uri: item.uri }}
            style={{
              width: width / 3,
              height: "auto",
              aspectRatio: 1 / 1,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const handleApprove = () => {
    uploadPost();
    deletePost();
    setModalVisible(!modalVisible);
  };

  const handleDelete = () => {
    deletePost();
    setDeleteModal(!deleteModal);
  };

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <View style={{ margin: 10, flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="arrow-left"
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Text style={styles.caxyAthleticsTxt}>Admin</Text>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image style={styles.headerIcon} source={require("../assets/icons8-photo-gallery-48.png")} />
                <Text style={styles.headerText}>Unapproved Pictures</Text>
              </View>
            </View>
          </View>
          <View style={styles.photoGallery}>
            {adminphotos.map((item, index) => (
              <View key={index} style={styles.gridView}>
                <TouchableOpacity
                  onPress={() => {
                    handlePicture(item, false);
                  }}
                >
                  <Image source={{ uri: item.uri }} style={styles.imageView} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image style={styles.headerIcon} source={require("../assets/icons8-photo-gallery-48.png")} />
                <Text style={styles.headerText}>Approved Pictures</Text>
              </View>
            </View>
          </View>
          <FlatList data={photos} renderItem={renderItem} numColumns={3} />
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <SafeAreaView style={styles.centeredView}>
              <View style={styles.modalView}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton size={16} color="white" icon="close" onPress={() => setModalVisible(!modalVisible)} />
                  <View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <Image source={{ uri: img.profUrl }} style={{ width: 16, height: 16, borderRadius: 25, marginRight: 10 }} />
                      <Text style={styles.modalText}>{img.user}</Text>
                    </View>
                    <Text style={[styles.modalText, styles.time]}>{img.time}</Text>
                  </View>
                  <View style={{ width: 40 }}></View>
                </View>
                <Image
                  resizeMode="contain"
                  source={{ uri: img.uri }}
                  style={{ width: "100%", height: "auto", aspectRatio: 9 / 16 }}
                />
                {approved ? (
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Button style={[styles.button, styles.buttonClose]} onPress={() => handleApprove()} uppercase={false}>
                      <Text style={styles.textStyle}>Move to Unapproved</Text>
                    </Button>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Button style={[styles.button, styles.buttonClose]} onPress={() => handleApprove()} uppercase={false}>
                      <Text style={styles.textStyle}>Approve</Text>
                    </Button>
                    <Button
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                        setDeleteModal(!deleteModal);
                      }}
                      uppercase={false}
                    >
                      <Text style={styles.textStyle}>Delete</Text>
                    </Button>
                  </View>
                )}
              </View>
            </SafeAreaView>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={deleteModal}
            onRequestClose={() => {
              setDeleteModal(!deleteModal);
            }}
          >
            <View style={styles.deleteModalView}>
              <View style={styles.deleteView}>
                <Text style={{ textAlign: "center", fontFamily: "Montserrat-Medium", fontSize: 14, margin: 10 }}>
                  Are you sure? You might not be able to recover the photo.
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Button style={[styles.button, styles.buttonClose]} onPress={() => handleDelete()}>
                    <Text style={styles.textStyle}>Delete</Text>
                  </Button>
                  <Button style={[styles.button, styles.buttonClose]} onPress={() => setDeleteModal(!deleteModal)}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: "black",
  },

  container: {
    backgroundColor: "#F6F4F4",
  },
  caxyAthleticsTxt: {
    fontSize: 20,
    color: "#3E3939",
    fontFamily: "Montserrat-Bold",
    justifyContent: "center",
    paddingLeft: 10,
  },
  headerContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  deleteModalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  deleteView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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

  modalView: {
    backgroundColor: "black",
  },
  button: {
    borderRadius: 10,
    elevation: 2,
    marginHorizontal: 5,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#3E3939",
    marginTop: 10,
  },
  modalText: {
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
    color: "white",
    fontSize: 12,
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
    width: "33.33%",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "white",
  },

  imageView: {
    width: "100%",
    alignSelf: "center",
    height: "auto",
    aspectRatio: 1 / 1,
  },
});
