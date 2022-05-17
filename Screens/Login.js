import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { initializeApp } from "@firebase/app";
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, GoogleAuthProvider, signInWithCredential, signInWithRedirect } from 'firebase/auth';
import { firebaseConfig } from "../config";
import AppLoading from "expo-app-loading";
import { Button } from "react-native-paper";
import { useFonts, Montserrat_700Bold, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
import { NavigationContainer } from "@react-navigation/native";

initializeApp(firebaseConfig)

export default function Login({ navigation }) {

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
        {
            clientId: '746295234450-suacf94k1rspa2b7gmh3ut80ujacicin.apps.googleusercontent.com',
        },
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            //const credential = provider.credential(id_token);
            signInWithCredential(auth, provider);
            navigation.navigate("Main")
        }
    }, [response])

    let [fontsLoaded] = useFonts({
        Montserrat_600SemiBold,
        Montserrat_700Bold,
    });
    const SignInButton = () => (
        <Button disabled={!request} uppercase={false} icon="google" style={{ backgroundColor: '#F37121' }} labelStyle={{ fontFamily: "Montserrat_600SemiBold" }} mode="contained" onPress={() => { promptAsync() }}>
            Sign in with Google
        </Button>
    );



    if (!fontsLoaded) {
        return <AppLoading />
    } else {
        return (
            <View style={styles.container}>
                <View>
                    <Text style={{ color: '#F37121', fontFamily: "Montserrat_700Bold", fontSize: 30 }}>Caxy</Text>
                    <Text style={{ color: '#F37121', fontFamily: "Montserrat_700Bold", fontSize: 40 }}>Athletics</Text>
                </View>
                <View style={{ marginVertical: 50 }}>
                    <SignInButton />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        margin: 60
    }
});
