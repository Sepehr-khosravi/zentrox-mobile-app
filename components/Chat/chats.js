import { StyleSheet, Text, View, Image , TouchableOpacity   } from 'react-native';
import React, { useEffect, useState } from 'react';


const ONLINE_THRESHOLD = 5 * 60 * 1000;

export default function Chats({ user , navigation }) {
    const isOnline = () => {
        if(user.isOnline){
            return true;
        }
        if (!user || !user.onlineAt) return false;

        const lastOnline = new Date(user.onlineAt).getTime();
        const currentTime = Date.now;

        return (currentTime - lastOnline) < ONLINE_THRESHOLD;
    };
    const lastOnline = ()=>{
        if(!user || !user.onlineAt) return "Unknown ";
        if(isOnline()) return "online";
        const lastOnline = new Date(user.onlineAt).getTime();
        const currentTime = Date.now();

        const diffInSeconds = Math.floor((currentTime - lastOnline) / 1000);
        if(diffInSeconds < 60){
            return `${diffInSeconds} seconds ago`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);

        if(diffInMinutes < 60){
            return  `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);

        if(diffInHours < 24){
            return `${diffInHours} Hour${diffInHours > 1 ? "s" : ""} ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);

        if(diffInDays < 30){
            return `${diffInDays} Day${diffInDays > 1 ? "s" : ""} ago`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        
        if(diffInMonths < 12){
            return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
        }

        const diffInYears = Math.floor(diffInMonths / 12);

        return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;

    }

    return (
        <TouchableOpacity onPress={()=>{
            navigation.navigate("Dm" , {isOnlineParam : isOnline() , conversationIdParam : user.conversationId , userParam : user})
        }} style={styles.userCard}>
            <View style={styles.avatar}>
                <Image
                    source={{ uri: user.profile || 'https://dfge.de/wp-content/uploads/blank-profile-picture-973460_640.png' }}
                    style={styles.avatar}
                />
                <View style={[styles.circle, { backgroundColor: isOnline() ? "green" : "gray" }]}></View>
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name || "unknown"}</Text>
            </View>
            <View style={styles.lastTime}>
                <Text style={{color : "white"}}>{isOnline() ? "" : lastOnline()}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    circle: {
        width: 13,
        height: 13,
        borderRadius: "100%",
        transform: "translate(35px ,-15px) ",
        borderWidth: 2,
        borderColor: "white"
    },
    avatar: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    userCard: {
        flexDirection: 'row',
        backgroundColor: '#1f1f1f',
        borderRadius: 16,
        padding: 14,
        alignItems: 'center',
        marginBottom: 12,
        elevation: 4,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 14,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    userEmail: {
        color: '#bbb',
        fontSize: 14,
        marginTop: 4,
    },
});
