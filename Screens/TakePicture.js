import React, { useState, useEffect, useRef } from "react";
import { getDatabase, set, onValue, update, ref, push } from "firebase/database";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { Camera, CameraType } from 'expo-camera';
import Ionicons from "@expo/vector-icons/Ionicons"

export default function TakePicture({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const cameraRef = useRef(null)
    const db = getDatabase()
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);
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
                let photo = await cameraRef.current.takePictureAsync({
                    quality: 1,
                    base64: true
                })
                push(ref(db, 'gallery/'), {
                    uri: photo.uri
                })
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
                        onPress={() => {
                            setType(type === CameraType.back ? CameraType.front : CameraType.back);
                        }}>
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
