import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Card, IconButton, Modal, Portal, TextInput, Title, Paragraph } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import { getDatabase, ref, set, onValue, update, get, push } from "firebase/database";
import moment from "moment";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { rewardsList } from "../Data/rewards";
import { launchImageLibrary } from "react-native-image-picker";
import { getDownloadURL, getStorage, uploadBytes, ref as ref_st, uploadString } from "firebase/storage";
import uuid from "react-native-uuid";

export default function EditRewards({ navigation, route }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [reward, setReward] = useState({});
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [photo, setPhoto] = useState({});
  const db = getDatabase();
  const storage = getStorage();

  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }

  useEffect(() => {
    onValue(ref(db, "rewards/"), (snapshot) => {
      setRewards(snapshot.val());
      setReward(snapshot.val()[0]);
    });
    loadFont();
  }, []);

  const changeReward = (r, i) => {
    //console.log(r)
    setReward(r);
    setDescription(r.description);
    setPoints(r.points);
    setName(r.name);
    setPhoto({uri: r.image})
    console.log(photo.uri)
    setVisible(true);
  };

  const selectPhoto = () => {
    let options = {
      includeBase64: true,
      quality: 0.01,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        //console.log("response", JSON.stringify(response));
        //console.log(response.assets[0].uri.split("file://").pop());
        setPhoto(response.assets[0])
        //console.log(response.assets[0].uri)
      }
    });
  };

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

  const uploadURL = async (b64) => {
    let purl = `data:image/jpg;base64,${b64}`;
    urlToBlob(purl.replace(/[^\x00-\x7F]/g, "")).then((blob) => {
      uploadBytes(ref_st(storage, "rewards/" + uuid.v4()), blob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          const newKey = update(ref(db, "rewards/" + (reward.id - 1)), {
            image: url,
          })
        });
      });
    });
    
  };

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={{ margin: 20, flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="arrow-left"
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Text style={styles.caxyAthleticsTxt}>Admin</Text>
          </View>
          <Text style={styles.caxyAthleticsTxt}>Edit Rewards</Text>
          <View style={{ margin: 10 }}>
            {rewards.map((r, index) => (
              <Card
                onPress={() => {
                  changeReward(r, index);
                }}
                key={index}
                style={{ marginVertical: 5 }}
              >
                <Card.Title title={r.id + ". " + r.name} subtitle={r.description} />
                <Card.Content>
                  <Paragraph>{r.points} Points</Paragraph>
                </Card.Content>
              </Card>
            ))}
          </View>
        </ScrollView>
        <Portal>
          <Modal visible={visible} dismissable={false} contentContainerStyle={{ backgroundColor: "white" }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={{ padding: 30 }}>
                <TextInput
                  label="Reward Name"
                  selectionColor="#F37121"
                  activeUnderlineColor="#F37121"
                  value={name}
                  style={{ marginVertical: 10 }}
                  onChangeText={(text) => setName(text)}
                />
                <TextInput
                  label="Points"
                  selectionColor="#F37121"
                  activeUnderlineColor="#F37121"
                  value={points.toString()}
                  style={{ marginVertical: 10 }}
                  onChangeText={(text) => setPoints(text)}
                />
                <TextInput
                  label="Reward Description"
                  selectionColor="#F37121"
                  activeUnderlineColor="#F37121"
                  value={description}
                  style={{ marginVertical: 10 }}
                  multiline={true}
                  onChangeText={(text) => setDescription(text)}
                />
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Button
                  mode="outlined"
                  color="#F37121"
                  style={{ width: 250, backgroundColor: "white", margin: 15 }}
                  onPress={() => {
                    selectPhoto();
                  }}
                >
                  Upload Picture
                </Button>
                <Image style={{height: 100, width: 100, borderRadius: 5}} source={{uri: photo.uri}}/>
                  </View>
              </View>
            </TouchableWithoutFeedback>

            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", margin: 10 }}>
              <Button
                mode="outlined"
                color="#F37121"
                style={{ width: 125, backgroundColor: "white", margin: 15 }}
                onPress={() => {
                  setVisible(false);
                }}
              >
                Close
              </Button>
              <Button
                mode="contained"
                style={{ width: 125, backgroundColor: "#F37121", margin: 15 }}
                onPress={() => {
                  if (!isNaN(points) && !isNaN(parseFloat(points))) {
                    update(ref(db, "rewards/" + (reward.id - 1)), {
                      id: reward.id,
                      description: description,
                      image: photo.uri,
                      name: name,
                      points: parseInt(points),
                    });
                    if (photo.hasOwnProperty("base64")) {
                      uploadURL(photo.base64)
                    } 
                    setVisible(false);
                  } else {
                    Alert.alert("Please enter a number for points.");
                  }
                }}
              >
                Save
              </Button>
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
});
