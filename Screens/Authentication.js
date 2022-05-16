import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { initializeApp } from "@firebase/app";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { firebaseConfig } from "../config";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export default function Authentication(props) {
  function checkIfLoggedIn() {
    auth.onAuthStateChanged(function (user) {
      if (user) {
      }
    });
  }

  return (
    <View>
      <Text>Authentication Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
