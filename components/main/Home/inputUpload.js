import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Touchable, Button, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { style, api } from '../../../config/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InputUpload = ({ navigation }) => {
    const [user, setUser] = useState({});
    const getInfoData = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                console.log("please login or regitser");
                Alert.alert("Hello", "please login or register")
                return;
            }
            const response = await axios.get(api.getProfile, {
                headers: {
                    "auth-token": `Bearer ${token}`
                }
            });
            if (!response || !response.data.data || response.status !== 200 || response.data.error) {
                console.log("please check your connection!");
                Alert.alert("Hello", "please check your connection");
                return;
            }
            setUser(response.data.data);
        }
        catch (e) {
            console.log("getInfoData error : ", e);
        }
    }
    useEffect(() => {
        getInfoData();
    }, []);
    return (
        <TouchableOpacity onPress={() => { navigation.navigate("Post") }} style={styles.userInfoContainer}>
            <View style={styles.userInfo}>
                <Image
                    source={{
                        uri: user?.profile ? user?.profile : "https://dfge.de/wp-content/uploads/blank-profile-picture-973460_640.png"
                    }}
                    style={styles.userAvatar}
                />
                <Text style={styles.username}>{user?.name ? user?.name : "Unknown"}</Text>
            </View>
            <View style={styles.input}>
                <TextInput
                    // value={message}
                    // onChangeText={setMessage}
                    onPress={() => { navigation.navigate("Post") }}
                    placeholder="What's on your mind?"
                    placeholderTextColor="#666"
                    style={styles.textInput}
                    textAlignVertical="top"
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    userInfoContainer: {
        flexDirection: 'column',
        paddingVertical: 14,
        paddingHorizontal: 22,

        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
        height: 80
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    userInfo: {
        gap: 2,
        justifyContent: "flex-start",
        // alignItems: "center",
        flexDirection: "row",
        width: "100%"
    },
    username: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5
    },
    privacyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    privacyText: {
        color: '#666',
        fontSize: 12,
        marginHorizontal: 4,
    },
    textInput: {
        width: "60%",
        color: 'white',
        fontSize: 16,
        textAlignVertical: 'top',
        marginLeft: 60,
        transform: "translateY(-30px)"
    },

});

export default InputUpload;