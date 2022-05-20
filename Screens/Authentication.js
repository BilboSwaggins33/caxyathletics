// import React, { useState, useEffect } from "react";
// import { StyleSheet, View, Text } from "react-native";
// import { auth } from "../config";
// import { signInWithPopup, GoogleAuthProvider } from "@firebase/auth";
// import { Button } from "react-native-paper";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";

// export default function Authentication({ navigation }) {
//   return (
//     <SafeAreaView>
//       <View>
//         <View style={{ alignItems: "center", justifyContent: "center" }}>
//           <Text style={{ color: "black" }}>Hello Screen</Text>
//           <Text>Hello Everyone</Text>
//         </View>
//         <Button
//           icon="google"
//           style={{ backgroundColor: "#F37121" }}
//           labelStyle={{ fontFamily: "Montserrat_600SemiBold" }}
//           mode="contained"
//           onPress={signInWithGoogle}
//         >
//           Sign In With Google
//         </Button>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   btn: {
//     widht: 200,
//     height: 50,
//   },
// });
