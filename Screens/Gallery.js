import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { StyleSheet, View, Text, FlatList, SafeAreaView, Image } from "react-native";
import { initializeApp } from "@firebase/app";
import * as WebBrowser from 'expo-web-browser';
import { firebaseConfig } from "../config";
import AppLoading from "expo-app-loading";
import { useFonts, Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium } from "@expo-google-fonts/montserrat";
import NavBar from "../Components/NavBar";
import Header from "../Components/Header";
import { Button } from "react-native-paper"

export default function Gallery({ navigation }) {
    const [photos, setPhotos] = useState([])
    const db = getDatabase()
    const galleryRef = ref(db, 'gallery/')
    useEffect(() => {
        onValue(galleryRef, (snapshot) => {
            setPhotos(Object.values(snapshot.val()))
        })
    }, [])

    let [fontsLoaded] = useFonts({
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_500Medium
    });

    if (!fontsLoaded) {
        return <AppLoading />
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <Header />
                    <View style={styles.sectionContainer}>
                        <View style={styles.headerContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    style={styles.headerIcon}
                                    source={require("../assets/icons8-photo-gallery-48.png")}
                                />
                                <Text style={styles.headerText}>Gallery</Text>
                            </View>
                            <Button onPress={() => { navigation.navigate("TakePicture") }} uppercase={false} icon="camera" style={{ backgroundColor: '#F37121' }} labelStyle={{ fontFamily: "Montserrat_700Bold" }} mode="contained" >
                                Take Photo
                            </Button>
                        </View>
                    </View>
                    <FlatList data={photos}
                        numColumns={3}
                        renderItem={({ item, index }) => (
                            <Image source={{ uri: item.uri }} style={{ aspectRatio: 1 / 1, width: "33.33%", height: undefined }} />
                        )}
                        contentContainerStyle={{ paddingBottom: 250 }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F6F4F4",
    },
    sectionContainer: {
        marginTop: 20,
    },
    headerContainer: {
        margin: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'
    },
    headerText: {
        fontSize: 16,
        fontFamily: "Montserrat_700Bold",
        color: "#3E3939",
        marginLeft: 10,
    },
    headerIcon: {
        maxWidth: 24,
        maxHeight: 24,
    },
});
