import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Modal, Portal, Provider, Button, Card, Title, Paragraph } from "react-native-paper";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import { getDatabase, get, onValue, update, ref } from "firebase/database";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { ExpandableCalendar, CalendarProvider, WeekCalendar } from "react-native-calendars";

import moment from "moment";
export default function AnnouncementModal() {
  const [visible, setVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [events, setEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [weekEvent, setWeekEvent] = useState([]);
  const r = useRef(null);
  const db = getDatabase();
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }
  useEffect(() => {
    onValue(ref(db, "events/" + moment().format().slice(0, 10)), (snapshot) => {
      if (snapshot.exists()) {
        setEvents(snapshot.val());
      } else {
        setEvents([
          {
            title: "Practice Starts",
            time: "3:00 PM",
            location: "Lake Forest Academy",
            facility: "Sports facilities",
            type: "No Events for Today",
          },
        ]);
      }
      loadFont();
    });
  }, []);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  function getEvents(day) {
    onValue(ref(db, "events/" + day), (snapshot) => {
      if (snapshot.exists()) {
        setWeekEvent(snapshot.val());
      } else {
        setWeekEvent([{ title: "", time: "", location: "", facility: "", type: "No Events" }]);
      }
    });
  }

  const containerStyle = {
    backgroundColor: "white",
    width: width - 30,
    borderRadius: 8,
    marginVertical: 60,
    flex: 1,
    marginLeft: 15,
  };
  const onDateChanged = useCallback((date) => {
    getEvents(date);
  }, []);
  const renderItem = useCallback(({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => setVisible(true)}>
        {item.type == "No Events for Today" ? (
          <View style={styles.announcementView}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: "Montserrat-Bold", color: "white", fontSize: 16 }}>{item.type}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.announcementView}>
            <Text style={styles.announcementTitle}>{item.type}</Text>
            <View style={styles.infoContainer}>
              <Image style={styles.infoIcon} source={require("../assets/icons8-head-to-head-48.png")} />
              <Text numberOfLines={2} style={styles.infoText}>
                {item.title}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Image style={styles.infoIcon} source={require("../assets/icons8-location-48.png")} />
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
        )}
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
            <View style={{ flex: 1 }}>
              <CalendarProvider date={moment().format().slice(0, 10)} onDateChanged={onDateChanged} disabledOpacity={0.6}>
                <ExpandableCalendar
                  style={{ margin: 10 }}
                  theme={{
                    todayTextColor: "#F37121",
                    arrowColor: "#F37121",
                    selectedDayBackgroundColor: "#F37121",
                  }}
                  staticHeader={true}
                  testID="weekCalendar"
                  disablePan={true}
                  initialPosition="closed"
                  disableWeekScroll={true}
                  hideKnob={true}
                  hideArrows={true}
                />
              </CalendarProvider>
            </View>
            <ScrollView style={{ flex: 1, marginTop: -375 }}>
              {weekEvent[0]?.type == "No Events" ? (
                <View style={styles.modalView}>
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.modalTitle}>{weekEvent[0]?.type}</Text>
                  </View>
                </View>
              ) : (
                weekEvent.map((event, index) => (
                  <View key={index} style={styles.modalView}>
                    <Text style={styles.modalTitle}>{event.type}</Text>
                    <View style={styles.modalContainer}>
                      <Image style={styles.modalIcon} source={require("../assets/icons8-head-to-head-48.png")} />
                      <Text numberOfLines={2} style={styles.modalText}>
                        {event.title}
                      </Text>
                    </View>
                    <View style={styles.modalContainer}>
                      <Image style={styles.modalIcon} source={require("../assets/icons8-location-48.png")} />
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
                ))
              )}
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
    marginLeft: 10,
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    margin: 5,
  },
  modalView: {
    height: 150,
    borderRadius: 10,
    justifyContent: "space-around",
    padding: 15,
    margin: 10,
    backgroundColor: "#F7EFEF",
    shadowColor: "#877F7F",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },

  modalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalIcon: {
    tintColor: "black",
    height: 16,
    width: 16,
  },

  modalText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 12,
    marginLeft: 10,
  },
  modalTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#F37121",
  },
});
