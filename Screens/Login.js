import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { StyleSheet, View, Text } from "react-native";
import { initializeApp } from "@firebase/app";
import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import { Button } from "react-native-paper";
import * as Font from 'expo-font'
import { MontserratFont } from '../assets/fonts'


//initializeApp(firebaseConfig)
WebBrowser.maybeCompleteAuthSession();
//https://auth.expo.io/@anonymous/caxy-athletics-2-77c481ca-9e93-4d00-84e6-ec3ca215bc57
export default function Login() {
  //746295234450-suacf94k1rspa2b7gmh3ut80ujacicin.apps.googleusercontent.com
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "746295234450-suacf94k1rspa2b7gmh3ut80ujacicin.apps.googleusercontent.com",
  });
  async function loadFont() {
    await Font.loadAsync(MontserratFont);
    setFontsLoaded(true)
  }

  useEffect(() => {
    loadFont()
    if (response?.type === "success") {
      const { id_token } = response.params;
      //console.log(response.params, id_token)
      const auth = getAuth();
      var credential = GoogleAuthProvider.credential(id_token);

      //const credential = provider.credential(id_token);
      signInWithCredential(auth, credential).then((result) => {
        const db = getDatabase();
        //console.log(result.user.uid, result.user.displayName, result.user.email, result.user.photoURL)
        onValue(ref(db, "users/" + result.user.uid), (snapshot) => {
          console.log('user info:', snapshot.val())
          if (snapshot.exists()) {
            update(ref(db, "users/" + result.user.uid), {
              uid: result.user.uid,
              name: result.user.displayName,
              email: result.user.email,
              profileUrl: result.user.photoURL,
            });
          } else {
            set(ref(db, "users/" + result.user.uid), {
              uid: result.user.uid,
              name: result.user.displayName,
              email: result.user.email,
              profileUrl: result.user.photoURL,
              points: 0,
            })
          }
        });

      });
    }
  }, [response]);


  const SignInButton = () => (
    <Button
      disabled={!request}
      uppercase={false}
      icon="google"
      style={{ backgroundColor: "#F37121" }}
      labelStyle={{ fontFamily: "Montserrat-Bold" }}
      mode="contained"
      onPress={() => {
        promptAsync();
      }}
    >
      Sign in with Google
    </Button>
  );

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <View>
          <Text
            style={{
              color: "#F37121",
              fontFamily: "Montserrat-Bold",
              fontSize: 30,
            }}
          >
            Caxy
          </Text>
          <Text
            style={{
              color: "#F37121",
              fontFamily: "Montserrat-Bold",
              fontSize: 40,
            }}
          >
            Athletics
          </Text>
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
    margin: 60,
  },
});
