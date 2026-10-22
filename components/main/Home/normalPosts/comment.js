import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Comment({ item }) {
    const createdAt = item.createdAt ? new Date(item.createdAt) : new Date();

    const timeAgo = () => {
        const lastOnline = new Date(createdAt).getTime();
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

    };

    return (
        <View style={styles.commentItem}>
            {item.userId?.avatar ? (
                <Image
                    source={{ uri: item.userId.avatar }}
                    style={styles.avatar}
                />
            ) : (
                <Ionicons name="person-circle-outline" size={32} color="#aaa" style={styles.avatar} />
            )}

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{item.userId?.name || 'User'}</Text>
                    <Text style={styles.time}> • {timeAgo()}</Text>
                </View>
                <Text style={styles.text}>{item.text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    commentItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 8,
        gap: 10,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    name: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    time: {
        color: '#888',
        fontSize: 12,
        marginLeft: 4,
    },
    text: {
        color: '#ccc',
        fontSize: 14,
        lineHeight: 18,
    },
});
