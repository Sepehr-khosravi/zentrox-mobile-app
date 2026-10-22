import { Alert, BackHandler, StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { api } from "../config/config";
import Chats from "../components/Chat/chats";
//socket Context : 
import { SocketContext } from '../context/SocketContext';


export default function ChatScreen({ navigation }) {

    let [users, setUsers] = useState([]);
    const { socket, socketReady } = useContext(SocketContext);

    const getConversations = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                Alert.alert("warning", "please login or register");
                return;
            }
            const response = await axios.get(api.getConversations, {
                headers: {
                    "auth-token": `Bearer ${token}`
                }
            });
            if (response.data.error) {
                setUsers([]);
                return;
            }
            if (!response || response.status !== 200) {
                Alert.alert("Hello", "please cheeck your connection");
                return;
            }
            setUsers(response.data.data);
        }
        catch (e) {
            console.log("getConversations error : ", e);
        }
    }
    const handleOnlineUsers = (data)=>{
        setUsers(prevUsers => prevUsers.map(user => user.userId == data ? {...user , isOnline : true} : user));
    }

    const handleOfflineUsers = (data)=>{
        setUsers(prevUsers => prevUsers.map(user => user.userId == data ? {...user , isOnline : false} : user));
    }

    useFocusEffect(
        useCallback(() => {
            getConversations();
        }, [])
    );

    useEffect(()=>{
        if(!socket) return;
        socket.on("friend_online" , handleOnlineUsers);
        socket.on("friend_offline" , handleOfflineUsers);
        return ()=>{
            socket.off("friend_online" , handleOnlineUsers);
            socket.off("friend_offline" , handleOfflineUsers);
        }
    } ,  [])



    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Zentrox Chat</Text>
                <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => {
                    navigation.navigate("Search");
                }}>
                    <Ionicons name="search" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("FriendRequests");
                }} >
                    <Ionicons name='person' size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={users}
                keyExtractor={(item, index) => item._id?.toString() || index.toString()}
                renderItem={({ item }) => <Chats navigation={navigation} user={item} />}
                contentContainerStyle={styles.chatList}
            />
        </View>
    );
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
    chatList: {
        padding: 16,
    }
});
