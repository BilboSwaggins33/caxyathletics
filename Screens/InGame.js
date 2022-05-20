import React from "react";
import { View, StyleSheet } from "react-native";
import EventView from "../Components/EventView";

export default function InGame() {
  return (
    <View style={styles.container}>
      <View>
        <Text>YOU ARE AT</Text>
      </View>
      <EventView />
    </View>
  );
}

const styles = StyleSheet.create({});
