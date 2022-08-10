import React, { useState, useEffect, useRef } from "react";
import { getDatabase, set, onValue, update, push, ref as ref_db } from "firebase/database";
import { getAuth } from "firebase/auth";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Dimensions, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import moment from "moment";
import { useCameraDevices, Camera } from "react-native-vision-camera";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
//import Icon from 'react-native-vector-icons/FontAwesome'
import { getDownloadURL, getStorage, uploadBytes, ref as ref_st, uploadString } from "firebase/storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import uuid from "react-native-uuid";
import { async } from "@firebase/util";
import { launchImageLibrary } from "react-native-image-picker";
const Stack = createStackNavigator();

export default function PhotoStack({ navigation }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="Camera" component={TakePicture} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="ViewPhoto" component={PhotoModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
function TakePicture({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const camera = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const [cameraPosition, setCameraPosition] = useState("back");

  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  useEffect(() => {
    getPermission();
  }, []);
  // navigation.getParent()?.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
  // return () => navigation.getParent()?.getParent()?.setOptions({ tabBarStyle: undefined });
  const getPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    setHasPermission(cameraPermission === "authorized");
  };

  if (hasPermission === "denied" || hasPermission === "restricted") {
    return (
      <SafeAreaView>
        <Text>No access to camera</Text>
      </SafeAreaView>
    );
  }

  const takePhoto = async () => {
    await camera.current.takePhoto({}).then(async (photo) => {
      //console.log(photo.path)
      navigation.navigate("ViewPhoto", { photoData: photo, upload: false });
    });
  };

  const selectPhoto = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
      },
      includeBase64: true,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        console.log("response", JSON.stringify(response));
        //console.log(response.assets[0].uri.split("file://").pop());

        navigation.navigate("ViewPhoto", {
          photoData: { path: response.assets[0].uri.split("file://").pop() },
          upload: true,
          photoBase64: response.assets[0].base64,
        });
      }
    });
  };

  if (device == null) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        photo={true}
        isActive={true}
        enableZoomGesture={true}
      />
      <TouchableOpacity onPress={takePhoto}>
        <Icon name="circle-slice-8" color="white" size={100} style={styles.captureButton} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setCameraPosition(cameraPosition == "front" ? "back" : "front")}>
        <Icon name="camera-flip" color="white" size={40} style={styles.rightButton} />
      </TouchableOpacity>
      <TouchableOpacity onPress={selectPhoto}>
        <Icon name="upload" color="white" size={40} style={styles.leftButton} />
      </TouchableOpacity>
    </View>
  );
}

function PhotoModal({ route, navigation }) {
  const db = getDatabase();
  const storage = getStorage();
  const { photoData, upload, photoBase64 } = route.params;
  const auth = getAuth();
  const user = auth.currentUser;
  console.log(photoData.path);

  const uploadURL = async (url) => {
    const newKey = push(ref_db(db, "galleryAdmin"), {
      uri: url,
      time: moment().format("MMMM Do YYYY, h:mm a"),
      user: user.uid,
    }).key;
    update(ref_db(db, "galleryAdmin/" + newKey), { id: newKey });
  };

  const uploadPhoto = async () => {
    //const url = photoData.path.replace("file://", "");
    let purl = `data:image/jpg;base64,${photoBase64}`;
    function urlToBlob(url) {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onerror = reject;
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            resolve(xhr.response);
          }
        };
        xhr.open("GET", url);
        xhr.responseType = "blob"; // convert type
        xhr.send();
      });
    }

    if (upload) {
      urlToBlob(purl.replace(/[^\x00-\x7F]/g, "")).then((blob) => {
        uploadBytes(ref_st(storage, "gallery" + uuid.v4()), blob).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            uploadURL(url);
          });
          navigation.navigate("Gallery");
        });
      });
    } else {
      const response = await fetch(photoData.path);
      const blob = await response.blob();
      uploadBytes(ref_st(storage, "gallery" + uuid.v4()), blob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          uploadURL(url);
        });
        // console.log(x)
        navigation.navigate("Gallery");
      });
    }
  };

  return (
    <View>
      <Image
        resizeMode="contain"
        source={{ uri: "file://" + photoData.path }}
        style={{ width: "100%", height: "auto", aspectRatio: 9 / 16 }}
      />
      <View style={styles.container}>
        <IconButton color="white" icon="close" onPress={() => navigation.goBack()} />
      </View>
      <Button
        onPress={uploadPhoto}
        style={{ margin: 15, borderRadius: 20, alignSelf: "center", paddingHorizontal: 20 }}
        dark={true}
        icon="navigation"
        color="#F37121"
        mode="contained"
        uppercase={false}
      >
        Upload
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  captureButton: {
    alignSelf: "center",
    top: Dimensions.get("window").height - 165,
  },
  upperLeft: {
    top: 50,
    left: 15,
  },
  rightButton: {
    position: "absolute",
    right: 40,
    top: Dimensions.get("window").height - 200,
  },
  leftButton: {
    position: "absolute",
    left: 40,
    top: Dimensions.get("window").height - 200,
  },
  takePhoto: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: "flex-end",
    position: "absolute", // add if dont work with above
  },
});
