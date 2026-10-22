import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { api } from "../../config/config";


export default function FriendRequestsList({ navigation }) {
    let [users, setUsers] = useState([]);
    const getLists = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                await AsyncStorage.clear();
                Alert.alert("warning", "please login or register");
                setUsers([]);
                return;
            }
            const response = await axios.get(api.getFriendRequestList, {
                headers: {
                    "auth-token": `Bearer ${token}`
                }
            });
            if (response.error) {
                setUsers([]);
                return;
            }
            if (!response || response.status !== 200) {
                Alert.alert("Hello", "please check your connection");
                setUsers([]);
                return;
            }
            setUsers(response.data.data);
        }
        catch (e) {
            console.log("getLists error : ", e);
        }
    }
    useEffect(() => {
        getLists();
    }, []);
    const deleteFromLists = (selfId) => {
        try {
            const newUsers = users.filter(item => item.id !== selfId);
            setUsers(newUsers);
        }
        catch (e) {
            console.log("deleteFromLists error in friendRequestsList.js : ", e);
        }
    }
    const acceptFriend = async (item) => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                Alert.alert("warning!", "please login or register");
                return false;
            }
            const response = await axios.post(api.acceptFriendRequest, { userId: item }, {
                headers: {
                    "auth-token": `Bearer ${token}`
                }
            });
            if (response.data.error) {
                return false;
            }
            if (!response || response.status !== 200) {
                Alert.alert("Hello", "please check your connection");
                return;
            }
            deleteFromLists(item);
            return true;
        }
        catch (e) {
            console.log("acceptFriend error : ", e);
        }
    }

    const renderList = ({ item }) => {

        return (
            <View style={[styles.userCard]}>
                <Image
                    source={{ uri: item.profile || 'https://dfge.de/wp-content/uploads/blank-profile-picture-973460_640.png' }}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.userName}>{item.name || "unknown"}</Text>
                    <Text style={styles.userEmail}>{item.email || "unknown"}</Text>
                </View>
                <View style={[styles.addContract, { marginLeft: "auto", marginRight: 10 }]}>
                    <Text onPress={() => acceptFriend(item.id)} style={[styles.addContractText]}>accept</Text>
                </View>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Friend Requests</Text>
            </View>
            <View style={styles.lists}>
                {
                    users ? (
                        <FlatList
                            data={users}
                            renderItem={renderList}
                            contentContainerStyle={{ paddingTop: 16 }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <Text style={{ flex: 1, textAlign: "center", color: "gray", fontSize: 20, fontWeight: "bold" }}>request not found for now!</Text>
                    )
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101010',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
        flex: 1,
    },
    lists: {
        width: "100%",
        height: "100%",
        marginTop: 50,
        justifyContent: "center",
        alignContent: "center",
        paddingHorizontal: 5
    },
    userCard: {
        flexDirection: 'row',
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    addContractText: {
        color: "white",
        marginLeft: "auto"
    },
    userName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userEmail: {
        color: '#aaa',
        fontSize: 14,
    },
})