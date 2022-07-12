import React, { useState, useEffect, useRef } from "react";
import { getDatabase, set, onValue, update, ref, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { Camera, CameraType } from 'expo-camera';
import Ionicons from "@expo/vector-icons/Ionicons"
import moment from "moment"
import * as ImagePicker from 'expo-image-picker';

export default function TakePicture({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [image, setImage] = useState(null);

    const cameraRef = useRef(null)
    const db = getDatabase()
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
            base64: true,

        }).then(photo => { return photo.base64 })
        if (result) {
            console.log(result)
            push(ref(db, 'gallery/'), {
                uri: 'data:image/jpg;base64,' + result,
                postedBy: user.uid,
                time: moment().format('MMMM Do YYYY, h:mm a')
            }).then(() => navigation.goBack())
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const handleTakePicture = async () => {
        console.log("picture clicked")
        if (cameraRef) {
            try {
                let p = await cameraRef.current.takePictureAsync({
                    quality: 1,
                    base64: true
                }).then(photo => {
                    return photo.base64
                })
                push(ref(db, 'gallery/'), {
                    uri: 'data:image/jpg;base64,' + p,
                    postedBy: user.uid,
                    time: moment().format('MMMM Do YYYY, h:mm a')
                })
                navigation.goBack()
            } catch (e) {
                //console.log(e)
            }

        }
    }


    return (
        <View style={styles.sectionContainer}>
            <Camera style={styles.camera} type={type} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.takePhoto}
                        onPress={pickImage}>
                        <Ionicons name='cloud-upload-outline' size={40} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.takePhoto}
                        onPress={handleTakePicture}>
                        <Ionicons name='scan-circle-outline' size={70} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setType(type === CameraType.back ? CameraType.front : CameraType.back);
                        }}>
                        <Ionicons name='sync-circle-outline' size={40} color="white" />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View >
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
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    takePhoto: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    }
});
