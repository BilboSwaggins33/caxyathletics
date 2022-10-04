import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update, get } from "firebase/database";
import { StyleSheet, View, Text, SafeAreaView, Dimensions, ScrollView } from "react-native";
import { Button, IconButton, Card, Title, Paragraph, Portal, Modal, TextInput, Divider } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import * as Font from "expo-font";
import { MontserratFont } from "../assets/fonts";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute, useIsFocused } from "@react-navigation/native";
import { parse } from "node-html-parser";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";
import { August, September, October, November, December, January, February, March, April, May } from "../Data/Schedule/Months.js";
const Stack = createStackNavigator();
export default function EditEvents({ navigation, route }) {
  React.useLayoutEffect(() => {
    if (getFocusedRouteNameFromRoute(route) == "ViewDate") {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          paddingTop: 10,
          borderTopWidth: 1,
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 20,
        },
      });
    }
  });
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="Calendar" component={EventCalendar} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="ViewDate" component={EventModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function EventCalendar({ navigation, route }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [day, setDay] = useState({
    dateString: moment().format().slice(0, 10),
    day: moment().date(),
    month: moment().month() + 1,
  });
  const db = getDatabase();
  const [events, setEvents] = useState([{}]);
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }

  useEffect(() => {
    getEvents(day);

    loadFont();
    return () => {
      setEvents({});
    };
  }, []);

  function getEvents(day) {
    onValue(ref(db, "events/" + day.dateString), (snapshot) => {
      if (snapshot.exists()) {
        setEvents(snapshot.val());
      } else {
        setEvents([
          {
            title: "No events for today",
            time: "",
            location: "Lake Forest Academy",
            facility: "",
            type: "",
            points: { Welch: 0, Bird: 0, Sargent: 0, Lewis: 0 },
          },
        ]);
      }
    });
  }

  async function getData(day) {
    //let lfaurl = "https://www.lfacaxys.org/fs/elements/3627?cal_date=2022-08-01&is_draft=false&is_load_more=true&parent_id=3627";
    //  let lfaurl = "https://www.lfacaxys.org";
    // "https://www.lfacaxys.org/schedule-results?cal_date=" +
    //   day.dateString.slice(0, -2) +
    //   "01&is_draft=true&is_load_more=true&parent_id=3627&_=1660444668925";
    //var response = await fetch(lfaurl)
    // console.log(response.status);
    // console.log(lfaurl);
    // switch (response.status) {
    //   // status "OK"
    //   case 200:
    //     var template = await response.text();
    //     return template;
    //   // status "Not Found"
    //   case 404:
    //     console.log("Not Found");
    //     break;
    //   case 403:
    //     console.log("Forbidden Error 403");
    //     break;
    // }
  }

  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={{ marginHorizontal: 10, flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="arrow-left"
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Text style={styles.caxyAthleticsTxt}>Admin</Text>
          </View>
          <View style={{ marginHorizontal: 15 }}>
            <Text style={styles.caxyAthleticsTxt}>Events</Text>
          </View>
          <Divider style={{ height: 1 }} />
          <View>
            <Calendar
              minDate={"2022-08-10"}
              maxDate={"2023-05-30"}
              onDayPress={async (d) => {
                setDay(d);
                getEvents(d);
                // var data = await getData(d);
                // navigation.navigate("ViewDate", { day: d, data: data });
              }}
              markedDates={{ [day.dateString]: { selected: true } }}
              theme={{
                calendarBackground: "#F6F4F4",
                todayTextColor: "#F37121",
                arrowColor: "#F37121",
                selectedDayBackgroundColor: "#F37121",
              }}
              style={{
                borderColor: "gray",
              }}
            />
          </View>
          <Divider style={{ height: 1 }} />
          <View>
            {events.map((event, index) => (
              <Card
                onPress={async () => {
                  navigation.navigate("ViewDate", { day: day });
                }}
                mode="elevated"
                key={index}
                style={{ padding: 5, backgroundColor: "#F6F4F4", borderWidth: 1 }}
              >
                <Card.Title title={event.type} titleNumberOfLines={2} />
                <Card.Content>
                  <Paragraph style={{ fontFamily: "Montserrat-Bold" }}>{event.title}</Paragraph>
                  <Title>{event.time.trim()}</Title>
                  <Paragraph>{event.facility}</Paragraph>
                  <Paragraph>@ {event.location}</Paragraph>
                </Card.Content>
              </Card>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function EventModal({ navigation, route }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [quickAdd, setQuickAdd] = useState([]);
  const [addedEvents, setAddedEvents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [added, setAdded] = useState(true);
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState([
    { label: "Away", value: "Away" },
    { label: "Crown", value: "Crown" },
    { label: "Tennis Court", value: "Tennis Court" },
    { label: "Ice Rink", value: "Ice Rink" },
    { label: "Track", value: "Track" },
    { label: "Fields", value: "Fields" },
    { label: "Cressey", value: "Cressey" },
    { label: "Corbin", value: "Corbin" },
    { label: "Atlass", value: "Atlass" },
    { label: "Science Center", value: "Science Center" },
  ]);
  const [types, setTypes] = useState([
    { label: "Event", value: "Event" },
    { label: "Pack the House", value: "Pack the House" },
    { label: "Senior Night", value: "Senior Night" },
  ]);

  const dates = {
    "08": August,
    "09": September,
    10: October,
    11: November,
    12: December,
    "01": January,
    "02": February,
    "03": March,
    "04": April,
    "05": May,
  };

  const [open, setOpen] = useState(false);
  const [topen, setTopen] = useState(false);
  const [value, setValue] = useState("Crown");
  const [type, setType] = useState("Event");

  const db = getDatabase();
  const eventRef = ref(db, "events/");
  const { day } = route.params;
  const root = parse(dates[day.dateString.slice(5, 7)]);
  //const root = parse("<div></div>");
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true);
  }

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getData();
    }

    loadFont();
    return () => {
      isMounted = false;
    };
  }, []);

  function getData() {
    var quickAddList = [];
    //console.log(root.structure);
    get(ref(db, "events/" + day.dateString)).then((snapshot) => {
      try {
        //console.log("snapshot", snapshot.val());
        var eventDate = root.querySelector(
          '.fsCalendarDate[data-day="' + day.day + '"][data-month="' + (day.month - 1) + '"]'
        ).parentNode;
        var events = eventDate.querySelectorAll(".fsCalendarInfo");
        if (snapshot.exists()) {
          var titles = snapshot.val().map((a) => a.title);
          for (let i = 0; i < events.length; i++) {
            if (!titles.includes(events[i].querySelector(".fsCalendarEventTitle").structuredText)) {
              quickAddList.push({
                title: events[i].querySelector(".fsCalendarEventTitle").structuredText,
                time:
                  events[i].querySelector(".fsTimeRange") == null
                    ? "TBD"
                    : events[i].querySelector(".fsTimeRange").structuredText,
                location:
                  events[i].querySelector(".fsLocation") == null ? "Away" : events[i].querySelector(".fsLocation").structuredText,
                facility: "Crown",
                type: "Event",
                points: { Welch: 0, Bird: 0, Sargent: 0, Lewis: 0 },
              });
            }
          }

          //quickAddList.filter((val) => )
          setQuickAdd(quickAddList);
          setAddedEvents(snapshot.val());
        } else {
          //console.log(events[2].querySelector(".fsLocation"));
          for (let i = 0; i < events.length; i++) {
            quickAddList.push({
              title: events[i].querySelector(".fsCalendarEventTitle").structuredText,
              time:
                events[i].querySelector(".fsTimeRange") == null ? "TBD" : events[i].querySelector(".fsTimeRange").structuredText,
              location:
                events[i].querySelector(".fsLocation") == null ? "Away" : events[i].querySelector(".fsLocation").structuredText,
              facility: "Crown",
              type: "Event",
              points: { Welch: 0, Bird: 0, Sargent: 0, Lewis: 0 },
            });
          }
          setQuickAdd(quickAddList);
        }
      } catch (e) {
        if (snapshot.exists()) {
          setAddedEvents(snapshot.val());
        }
        console.log(e);
      }
    });
  }

  const showEdit = (event, t, i) => {
    setEventTitle(event.title);
    setEventTime(event.time);
    setEventLocation(event.location);
    setValue(event.facility);
    setType(event.type);
    setAdded(t);
    setIndex(i);
    setVisible(true);
  };

  const handleEvents = () => {
    update(eventRef, { [day.dateString]: addedEvents });
    navigation.goBack();
  };

  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.close}>
            <IconButton color="black" icon="close" onPress={handleEvents} />
          </View>
          <View style={{ margin: 20 }}>
            <Text style={styles.caxyAthleticsTxt}>{day.dateString}</Text>
            <Button
              uppercase={false}
              style={{ width: 200, marginVertical: 10 }}
              labelStyle={{ color: "white" }}
              color="#F37121"
              mode="contained"
              icon="plus"
              onPress={() =>
                showEdit(
                  {
                    title: "",
                    time: " 4:00 PM",
                    location: "Lake Forest Academy",
                    facility: "Crown",
                    type: "Event",
                  },
                  null,
                  -1
                )
              }
            >
              Create Event
            </Button>
            <Text style={styles.caxyAthleticsTxt}>Added Events</Text>
            {addedEvents.map((event, i) => (
              <Card mode="contained" key={i} style={{ marginVertical: 10, padding: 2, backgroundColor: "#F37121" }}>
                <Card.Title titleStyle={{ color: "white" }} title={event.type} titleNumberOfLines={2} />
                <Card.Content>
                  <Paragraph style={{ color: "white", fontFamily: "Montserrat-Bold" }}>{event.title}</Paragraph>
                  <Title style={{ color: "white" }}>{event.time.trim()}</Title>
                  <Paragraph style={{ color: "white" }}>{event.facility}</Paragraph>
                  <Paragraph style={{ color: "white" }}>@ {event.location}</Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button
                    uppercase={false}
                    style={{ margin: 10, width: 100 }}
                    labelStyle={{ color: "#F37121" }}
                    color="white"
                    mode="contained"
                    onPress={() => {
                      setQuickAdd([...quickAdd, event]);
                      var temp = [...addedEvents];
                      temp.splice(temp.indexOf(event), 1);
                      setAddedEvents(temp);
                    }}
                  >
                    Remove
                  </Button>
                  <Button
                    onPress={() => showEdit(event, true, i)}
                    uppercase={false}
                    style={{ margin: 10, width: 100, borderColor: "white" }}
                    labelStyle={{ color: "white" }}
                    color="#F37121"
                    mode="outlined"
                  >
                    Edit
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </View>
          <Divider style={{ marginHorizontal: 20, height: 2 }} />
          <View style={{ margin: 20 }}>
            <Text style={styles.caxyAthleticsTxt}>Quick Add</Text>
            {quickAdd.map((event, i) => (
              <Card mode="contained" key={i} style={{ marginVertical: 10, padding: 5 }}>
                <Card.Title title={event.type} titleNumberOfLines={2} />
                <Card.Content>
                  <Paragraph style={{ fontFamily: "Montserrat-Bold" }}>{event.title}</Paragraph>
                  <Title>{event.time.trim()}</Title>
                  <Paragraph>{event.facility}</Paragraph>
                  <Paragraph>@ {event.location}</Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button
                    uppercase={false}
                    style={{ margin: 10, width: 100 }}
                    labelStyle={{ color: "white" }}
                    color="#F37121"
                    mode="contained"
                    onPress={() => {
                      setAddedEvents([...addedEvents, event]);
                      var temp = [...quickAdd];
                      temp.splice(temp.indexOf(event), 1);
                      setQuickAdd(temp);
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    onPress={() => showEdit(event, false, i)}
                    uppercase={false}
                    style={{ margin: 10, width: 100 }}
                    color="#F37121"
                    mode="outlined"
                  >
                    Edit
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </View>
          <Portal>
            <Modal
              dismissable={false}
              visible={visible}
              contentContainerStyle={{ padding: 20, backgroundColor: "white", paddingVertical: 50, marginBottom: height / 4 }}
            >
              <Text style={styles.caxyAthleticsTxt}>Edit Event</Text>
              <DropDownPicker
                open={topen}
                value={type}
                items={types}
                setOpen={setTopen}
                setValue={setType}
                setItems={setTypes}
                placeholder="Event"
                style={{ marginVertical: 10 }}
              />
              <TextInput
                label="Location"
                selectionColor="#F37121"
                activeUnderlineColor="#F37121"
                value={eventLocation}
                onChangeText={(text) => setEventLocation(text)}
              />
              <TextInput
                label="Event"
                selectionColor="#F37121"
                activeUnderlineColor="#F37121"
                value={eventTitle}
                onChangeText={(text) => setEventTitle(text)}
                style={{ marginVertical: 10 }}
              />
              <TextInput
                label="Time"
                selectionColor="#F37121"
                activeUnderlineColor="#F37121"
                value={eventTime}
                onChangeText={(text) => setEventTime(text)}
              />
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Facility"
                style={{ marginVertical: 10 }}
              />

              <View style={{ flexDirection: "row" }}>
                <Button
                  uppercase={false}
                  style={{ marginVertical: 30, width: 100 }}
                  labelStyle={{ color: "white" }}
                  color="#F37121"
                  mode="contained"
                  onPress={() => {
                    added == null
                      ? setAddedEvents([
                          ...addedEvents,
                          {
                            title: eventTitle,
                            time: eventTime,
                            location: eventLocation,
                            facility: value,
                            type: type,
                            points: { Welch: 0, Bird: 0, Sargent: 0, Lewis: 0 },
                          },
                        ])
                      : added
                      ? (addedEvents[index] = {
                          title: eventTitle,
                          time: eventTime,
                          location: eventLocation,
                          facility: value,
                          type: type,
                          points: { Welch: 0, Bird: 0, Sargent: 0, Lewis: 0 },
                        })
                      : (quickAdd[index] = {
                          title: eventTitle,
                          time: eventTime,
                          location: eventLocation,
                          facility: value,
                          type: type,
                          points: { Welch: 0, Bird: 0, Sargent: 0, Lewis: 0 },
                        });

                    setVisible(false);
                  }}
                >
                  Confirm
                </Button>
                <Button
                  onPress={() => setVisible(false)}
                  uppercase={false}
                  style={{ margin: 30, width: 100 }}
                  color="#F37121"
                  mode="outlined"
                >
                  Cancel
                </Button>
              </View>
            </Modal>
          </Portal>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F4F4",
  },
  caxyAthleticsTxt: {
    fontSize: 20,
    color: "#3E3939",
    fontFamily: "Montserrat-Bold",
    justifyContent: "center",
    marginVertical: 5,
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
  text: {
    fontSize: 8,
    fontFamily: "Montserrat-Medium",
    color: "#3E3939",
  },
  close: {
    top: 5,
    left: 5,
  },
});
