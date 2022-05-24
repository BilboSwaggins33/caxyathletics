import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { initializeApp } from "@firebase/app";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { firebaseConfig } from "../config";

export default function Loading({ navigation }) {
    const firebaseApp = initializeApp(firebaseConfig)
    const auth = getAuth(firebaseApp);

    useEffect(() => {
        checkIfLoggedIn()
    }, [])

    function checkIfLoggedIn() {
        onAuthStateChanged(auth, user => {
            if (user) {
                navigation.navigate('Main');
            } else {
                navigation.navigate('Login');
            }
        });
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    }
});
