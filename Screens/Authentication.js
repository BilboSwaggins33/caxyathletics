import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { initializeApp } from "@firebase/app";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

// DO GOOGLE SIGN IN HERE

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export default function Authentication({ navigation }) {

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", justifyContent: 'center' }}>
        <Text>Hello Screen</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
