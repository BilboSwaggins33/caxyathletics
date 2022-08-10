import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Modal, Portal, Provider, Button, Card, Title, Paragraph } from "react-native-paper";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import { getDatabase, get, onValue, update, ref } from "firebase/database";
import Carousel, { Pagination } from "react-native-snap-carousel";

export default function AnnouncementModal() {
  const [visible, setVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [events, setEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const r = useRef(null);
  const db = getDatabase();
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }
  useEffect(() => {
    onValue(ref(db, "events/" + new Date().toISOString().slice(0, 10)), (snapshot) => {
      if (snapshot.exists()) {
        setEvents(snapshot.val());
      } else {
        setEvents([
          {
            title: "No Events for Today",
            time: "Have a nice day!",
            location: "Lake Forest Academy",
            facility: "Why not visit Crown?",
          },
        ]);
      }
      loadFont();
    });
  }, []);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 15,
    width: width - 30,
    marginLeft: 15,
    borderRadius: 8,
  };

  const renderItem = useCallback(({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => setVisible(true)}>
        <View style={styles.announcementView}>
          <Text style={styles.announcementTitle}>{item.title}</Text>
          <View style={styles.infoContainer}>
            <Image style={styles.infoIcon} source={require("../assets/icons8-location-24.png")} />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Image style={styles.infoIcon} source={require("../assets/icons8-clock-48.png")} />
            <Text style={styles.infoText}>{item.time}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Image style={styles.infoIcon} source={require("../assets/icons8-map-pin-48.png")} />
            <Text style={styles.infoText}>{item.facility}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  if (!fontsLoaded) {
    return <View></View>;
  } else {
    return (
      <View>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            <ScrollView>
              {events.map((event, index) => (
                <View key={index} style={styles.modalView}>
                  <Text style={styles.modalTitle}>{event.title}</Text>
                  <View style={styles.modalContainer}>
                    <Image style={styles.modalIcon} source={require("../assets/icons8-location-24.png")} />
                    <Text style={styles.modalText}>{event.location}</Text>
                  </View>
                  <View style={styles.modalContainer}>
                    <Image style={styles.modalIcon} source={require("../assets/icons8-clock-48.png")} />
                    <Text style={styles.modalText}>{event.time}</Text>
                  </View>
                  <View style={styles.modalContainer}>
                    <Image style={styles.modalIcon} source={require("../assets/icons8-map-pin-48.png")} />
                    <Text style={styles.modalText}>{event.facility}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Modal>
        </Portal>
        <TouchableOpacity onPress={showModal}>
          <Carousel
            ref={r}
            data={events}
            renderItem={renderItem}
            sliderWidth={500}
            itemWidth={500}
            layout={"default"}
            onSnapToItem={(index) => setActiveIndex(index)}
          />
        </TouchableOpacity>
        <Pagination
          containerStyle={{ marginBottom: -50, marginTop: -10 }}
          animatedDuration={100}
          dotsLength={events.length}
          activeDotIndex={activeIndex}
          tappableDots={true}
          carouselRef={r}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 2,
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1}
        />
      </View>
    );
  }
}
/*
<View style={styles.announcementView}>
  <Text style={styles.announcementTitle}>Varsity Boys Basketball Senior Night</Text>
  <View style={styles.infoContainer}>
    <Image style={styles.infoIcon} source={require("../assets/icons8-head-to-head-48.png")} />
    <Text style={styles.infoText}>Lake Forest High School</Text>
  </View>
  <View style={styles.infoContainer}>
    <Image style={styles.infoIcon} source={require("../assets/icons8-clock-48.png")} />
    <Text style={styles.infoText}>6PM Thursday</Text>
  </View>
  <View style={styles.infoContainer}>
    <Image style={styles.infoIcon} source={require("../assets/icons8-map-pin-48.png")} />
    <Text style={styles.infoText}>Crown</Text>
  </View>
</View>;
*/

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  announcementView: {
    backgroundColor: "#F37121",
    width: width - 50,
    height: 150,
    borderRadius: 20,
    marginLeft: 25,
    justifyContent: "space-around",
    padding: 10,
  },

  announcementTitle: {
    fontFamily: "Montserrat-Bold",
    color: "white",
    fontSize: 16,
    marginLeft: 15,
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },

  infoIcon: {
    tintColor: "white",
    height: 16,
    width: 16,
  },

  infoText: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: 12,
    marginLeft: 10,
  },
  modalView: {
    height: 150,
    borderRadius: 10,
    justifyContent: "space-around",
    padding: 10,
    borderWidth: 0.5,
    marginVertical: 5,
  },

  modalContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
  },

  modalIcon: {
    tintColor: "black",
    height: 16,
    width: 16,
  },

  modalText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 12,
    marginLeft: 10,
  },
  modalTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    marginLeft: 15,
  },
});
