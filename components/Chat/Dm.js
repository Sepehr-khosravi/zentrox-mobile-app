import React, { useContext, useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    Animated
} from 'react-native';
import MessagesContainer from './Messages';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { api } from "../../config/config";
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { SocketContext } from '../../context/SocketContext';

export default function Dm({ route, navigation }) {
    const { socket } = useContext(SocketContext);
    const [Message, setMessage] = useState("");
    const { userParam, conversationIdParam, isOnlineParam } = route.params;
    let [user, setUser] = useState(userParam);
    let [conversationId, setConversationId] = useState(conversationIdParam);
    let [isOnline, setIsOnline] = useState(isOnlineParam);
    const [online, setOnline] = useState(isOnlineParam);
    const [Messages, setMessages] = useState([]);


    const translateY = useRef(new Animated.Value(0)).current;

    // --- Keyboard Smooth Animation ---
    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardWillShow", (e) => {
            Animated.timing(translateY, {
                toValue: -e.endCoordinates.height,
                duration: 250,
                useNativeDriver: true,
            }).start();
        });
        const hideSub = Keyboard.addListener("keyboardWillHide", () => {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        });
        // Android
        const showSubAndroid = Keyboard.addListener("keyboardDidShow", (e) => {
            if (Platform.OS === "android") {
                Animated.timing(translateY, {
                    toValue: -e.endCoordinates.height,
                    duration: 250,
                    useNativeDriver: true,
                }).start();
            }
        });
        const hideSubAndroid = Keyboard.addListener("keyboardDidHide", () => {
            if (Platform.OS === "android") {
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }).start();
            }
        });

        return () => {
            showSub.remove();
            hideSub.remove();
            showSubAndroid.remove();
            hideSubAndroid.remove();
        };
    }, []);

    // --- last online ---
    const lastOnline = () => {
        if (!user || !user.onlineAt) return "Unknown ";
        if (online) return "online";
        return "last seen recently";
    };

    // --- fetch messages ---
    const fetch = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                Alert.alert("Warning!", "please login or register first");
                return;
            }
            const response = await axios.get(`${api.openDm}/${conversationId}`, {
                headers: { "auth-token": `Bearer ${token}` }
            });
            if (response.data.error) {
                console.log("fetch error in Dm.js about response.data.error");
                setMessages([]);
                return;
            }
            setMessages(response.data.data);
            setTimeout(() => {
                console.log("this is messages : ", response.data.data);
            }, 1000);
        }
        catch (e) {
            console.log("fetch error in Dm.js : ", e);
        }
    };

    // --- socket online/offline ---
    const handleOnlineUsers = (data) => {
        if (!data.includes(user.userId.toString())) setOnline(false);
        else setOnline(true);
    };
    const handleOfflineUsers = (data) => {
        if (data.includes(user.userId.toString())) setOnline(false);
    };
    const handleGetMessages = (data) => {
        setMessages(prev => [data, ...prev]);
    }

    const handleMessageSeen = (data) => {
        if (!data) {
            return;
        }
        const messages = Messages.map(item => {
            item.isSeen = true;
            return item;
        });
        setMessages(messages);
    }

    useEffect(() => {
        fetch();
    }, []);
    useEffect(() => {
        if (!socket) return;
        socket.on("friend_online", handleOnlineUsers);
        socket.on("friend_offline", handleOfflineUsers);
        socket.on("receive_message", handleGetMessages);
        socket.emit("message_seen", { conversationId });
        socket.on("friend_message_seen", handleMessageSeen);
        return () => {
            socket.off("friend_online", handleOnlineUsers);
            socket.off("friend_offline", handleOfflineUsers);
            socket.off("friend_message_seen", handleMessageSeen);
            socket.off("receive_message", handleGetMessages);
        }
    }, [socket]);


    const sendMessage = async (message) => {
        try {
            if (!socket || !message) return;

            const newMessage = {
                _id: Date.now(),
                message: message,
                isSeen: online ? true : false,
                conversationId: conversationId,
                userId: "it's for my self"
            }
            setMessages(prev => [newMessage, ...prev]);

            socket.emit("send_message", { message, conversationId });
            setMessage("");

        }
        catch (e) {
            console.log("sendMessage error :  ", e);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* NAV BAR */}
                <View style={styles.nav_bar}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.avatar}>
                        <Image
                            style={styles.avatar}
                            source={{ uri: user.profile ? user.profile : "https://dfge.de/wp-content/uploads/blank-profile-picture-973460_640.png" }}
                        />
                        <View style={[styles.circle, { backgroundColor: online ? "green" : "gray" }]} />
                    </View>
                    <View style={styles.info}>
                        <Text style={{ color: "white" }}>{user.name}</Text>
                        <Text style={{ color: "white" }}>{lastOnline()}</Text>
                    </View>
                    <TouchableOpacity style={styles.moreButton}>
                        <Feather name="more-vertical" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* MESSAGES */}

                <View style={styles.messages}>
                    <Animated.View style={[styles.messages, { transform: [{ translateY }] }]}>

                        <MessagesContainer messages={Messages} currentUserId={user.userId} />
                    </Animated.View>

                </View>
                <Animated.View style={[styles.inputBar, { transform: [{ translateY }] }]}>

                    {/* INPUT BAR */}
                    <TextInput
                        value={Message}
                        onChangeText={setMessage}
                        placeholder="Message"
                        placeholderTextColor="gray"
                        multiline
                        style={styles.textInput}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(Message)}>
                        <Ionicons name="send" size={20} color="black" />
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "black" },
    nav_bar: {
        width: "100%",
        height: 100,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: 20,
        paddingTop : 40 , 
        zIndex: 1,
        backgroundColor: "black"
    },
    circle: {
        width: 13,
        height: 13,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "white",
        position: "absolute",
        bottom: 0,
        right: 0,
    },
    avatar: { width: 50, height: 50, borderRadius: 50, marginRight: 10 },
    info: { marginLeft: 10 },
    backButton: { marginRight: 15 },
    moreButton: { marginLeft: "auto", marginRight: 25 },
    messages: { flex: 1, width: "100%" },
    inputBar: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0.2,
        borderColor: "white",
        borderRadius: 25,
        marginBottom: 25,
        margin: 10,
        paddingHorizontal: 10,
        height: 50,
        backgroundColor: "black",
    },
    textInput: { flex: 1, color: "white", paddingHorizontal: 10 },
    sendBtn: {
        marginLeft: 5,
        backgroundColor: "white",
        borderRadius: 25,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    }
});
