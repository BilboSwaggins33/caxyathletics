import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { initializeApp } from "@firebase/app";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { firebaseConfig } from "../config";
import { ActivityIndicator } from "react-native-paper";
import { setUser } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";

export default function Loading({ navigation }) {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.userReducer);



  useEffect(() => {
  }, []);


  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="orange" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
