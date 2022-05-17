import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Modal, Portal, Provider, Button } from "react-native-paper";

export default function AnnouncementModal() {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    width: width - 50,
    marginLeft: 25,
  };

  return (
    <View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Text>Announcements</Text>
        </Modal>
      </Portal>
      <TouchableOpacity onPress={showModal}>
        <View style={styles.announcementView}>
          <Text style={styles.announcementTitle}>
            Varsity Boys Basketball Senior Night
          </Text>
          <View style={styles.infoContainer}>
            <Image
              style={styles.infoIcon}
              source={require("../assets/icons8-head-to-head-48.png")}
            />
            <Text style={styles.infoText}>Lake Forest High School</Text>
          </View>
          <View style={styles.infoContainer}>
            <Image
              style={styles.infoIcon}
              source={require("../assets/icons8-clock-48.png")}
            />
            <Text style={styles.infoText}>6PM Thursday</Text>
          </View>
          <View style={styles.infoContainer}>
            <Image
              style={styles.infoIcon}
              source={require("../assets/icons8-map-pin-48.png")}
            />
            <Text style={styles.infoText}>Crown</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
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
    marginLeft: 10,
  },
});
