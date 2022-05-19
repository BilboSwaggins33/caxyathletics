import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { StyleSheet, View, Text } from "react-native";
import { initializeApp } from "@firebase/app";
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import { firebaseConfig } from "../config";
import AppLoading from "expo-app-loading";
import { Button } from "react-native-paper";
import { useFonts, Montserrat_700Bold, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";

initializeApp(firebaseConfig)
WebBrowser.maybeCompleteAuthSession();
//https://auth.expo.io/@anonymous/caxy-athletics-2-77c481ca-9e93-4d00-84e6-ec3ca215bc57
export default function Login({ navigation }) {
    //746295234450-suacf94k1rspa2b7gmh3ut80ujacicin.apps.googleusercontent.com
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
        {
            clientId: '746295234450-suacf94k1rspa2b7gmh3ut80ujacicin.apps.googleusercontent.com',
        },
    );


    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            //console.log(response.params, id_token)
            const auth = getAuth();
            var credential = GoogleAuthProvider.credential(id_token);

            //const credential = provider.credential(id_token);
            signInWithCredential(auth, credential).then((result) => {
                const db = getDatabase();
                console.log(result)
                //console.log(result.user.uid, result.user.displayName, result.user.email, result.user.photoURL)

                set(ref(db, "users/" + result.user.uid), {
                    uid: result.user.uid,
                    name: result.user.displayName,
                    email: result.user.email,
                    profileUrl: result.user.photoURL,
                    points: 0
                })

                //writeUserData(result.user.uid, result.user.displayName, result.email, result.photoURL)
                navigation.navigate("Main")
            });
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
