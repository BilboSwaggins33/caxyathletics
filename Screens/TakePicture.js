import React, { useState, useEffect, useRef } from "react";
import { getDatabase, set, onValue, update, push, ref as ref_db } from "firebase/database";
import { getAuth } from "firebase/auth";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Dimensions, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons"
import { createStackNavigator } from "@react-navigation/stack";
import moment from "moment"
import { useCameraDevices, Camera } from "react-native-vision-camera";
import { ActivityIndicator, IconButton } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome'
import { getDownloadURL, getStorage, uploadBytes, ref as ref_st } from "firebase/storage";
import uuid from 'react-native-uuid'
import { async } from "@firebase/util";

const Stack = createStackNavigator();

export default function PhotoStack({ navigation }) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Group>
                <Stack.Screen name="Camera" component={TakePicture} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: "modal" }}>
                <Stack.Screen name="ViewPhoto" component={PhotoModal} />
            </Stack.Group>
        </Stack.Navigator>
    );
}
function TakePicture({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [yourl, setYourl] = useState('')
    const camera = useRef(null);
    const db = getDatabase()
    const storage = getStorage();
    const auth = getAuth();
    const user = auth.currentUser;
    const devices = useCameraDevices()
    const device = devices.back
    useEffect(() => {
        getPermission();
        navigation.getParent()?.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
        return () => navigation.getParent()?.getParent()?.setOptions({ tabBarStyle: undefined });
    }, [navigation]);

    const getPermission = async () => {
        const cameraPermission = await Camera.getCameraPermissionStatus()
        setHasPermission(cameraPermission === 'authorized');
    }


    if (hasPermission === 'denied' || hasPermission === 'restricted') {
        return <SafeAreaView><Text>No access to camera</Text></SafeAreaView>;
    }



    const takePhoto = async () => {
        await camera.current.takePhoto({

        }).then(async (photo) => {
            //console.log(photo.path)
            navigation.navigate("ViewPhoto", { photoData: photo })
        })
    }

    if (device == null) { return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color="orange" /></View> }

    return (
        <View style={styles.sectionContainer}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                photo={true}
                isActive={true}
                enableZoomGesture={true}
            />
            <TouchableOpacity style={styles.captureBtn} onPress={takePhoto}>
                <Icon size={100} color='white' style={styles.captureButton} name="circle-thin"></Icon>
                <Icon size={80} color='white' style={styles.cbtn2} name="circle"></Icon>
            </TouchableOpacity>
        </View >
    );
}


function PhotoModal({ route, navigation }) {
    const db = getDatabase();
    const { photoData } = route.params
    const auth = getAuth();
    const user = auth.currentUser;
    useEffect(() => {
        navigation.getParent()?.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
        return () => navigation.getParent()?.getParent()?.setOptions({ tabBarStyle: undefined });
    }, [navigation]);

    const uploadURL = async (url) => {
        const newKey = push(ref_db(db, 'galleryAdmin'), {
            uri: url,
            time: moment().format('MMMM Do YYYY, h:mm a'),
            user: user.uid
        }).key
        update(ref_db(db, 'galleryAdmin/' + newKey), { id: newKey })
    }
    const uploadPhoto = async () => {
        const response = await fetch(photoData.path)
        const blob = await response.blob();
        uploadBytes(ref_st(storage, 'gallery' + uuid.v4()), blob).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => { uploadURL(url) });
            // console.log(x)
            navigation.goBack()
        })
    }

    return (
        <View>
            <Image source={{ uri: photoData.path }} />
            <View style={styles.container}>
                <IconButton icon="close" onPress={() => navigation.goBack()} />
            </View>
        </View>
    );

}


const styles = StyleSheet.create({
    sectionContainer: {
        flex: 1,
    },
    camera: {
        flex: 1
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20
    },
    captureButton: {
        alignSelf: 'center',
        top: Dimensions.get('window').height - 165,
    },
    cbtn2: {
        alignSelf: 'center',
        top: Dimensions.get('window').height - 255,
    },
    takePhoto: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        alignSelf: 'flex-end',
        marginTop: -5,
        position: 'absolute', // add if dont work with above
    }
});
