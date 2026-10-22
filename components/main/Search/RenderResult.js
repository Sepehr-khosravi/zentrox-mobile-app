import React, { useState, useEffect, useReducer, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    BackHandler,
    Alert,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const RenderResult = ({ item, activeTab, results, addFriend }) => {
    let [TextComponent, setText] = useState(item.isFriend ? "remove" : "add")
    const changeText = () => {
        setText("pending");
    }
    if (activeTab === "posts") {
        return (
            results.length ? (
                <View style={styles.card}>
                    <Text style={styles.subreddit}>
                        {item.name || 'Unknown'} • {handleTime(item.createdAt)}
                    </Text>
                    <Text style={styles.title}>{item.title || 'No title'}</Text>
                    <Text style={styles.text} numberOfLines={5}>
                        {item.description || 'No content'}
                    </Text>
                </View>
            ) : (
                <Text style={{ flex: 1, color: textColor, justifyContent: "center", alignItems: "center" }}>not found Users</Text>
            )
        );
    }
    else {
        return (
            results.length ? (
                <View style={styles.userCard}>
                    <Image
                        source={{ uri: item.profile || 'https://dfge.de/wp-content/uploads/blank-profile-picture-973460_640.png' }}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                    </View>
                    <View style={styles.addContract}><Text onPress={() => {
                        addFriend(item._id)
                        changeText();
                    }} style={styles.addContractText} >{TextComponent}</Text></View>
                </View>
            ) : (
                <Text style={{ flex: 1, color: textColor, justifyContent: "center", alignItems: "center" }}>not found Users</Text>
            )
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    icon: {
        marginLeft: 8,
    },
    tabContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        paddingBottom: 10
    },
    tabButton: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#1e1e1e',
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#333',
    },
    tabText: {
        color: '#aaa',
        fontSize: 16,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
    },
    card: {
        backgroundColor: '#1e1e1e',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    subreddit: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 8,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    text: {
        color: '#ccc',
        fontSize: 14,
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
    userName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userEmail: {
        color: '#aaa',
        fontSize: 14,
    },
    addContract: {
        fontSize: 10,
        width: 60,
        height: 30,
        borderRadius: 20,
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
        marginLeft: "auto"
    },
    addContractText: {
        textAlign: "center",
        color: "white",
        alignContent: "center",
    }
});

export default RenderResult