import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// پیام تک
const MessageItem = ({ message, currentUserId }) => {
    const isMine = message.userId !== currentUserId;

    return (
        <View
            style={[
                styles.messageContainer,
                isMine ? styles.mineContainer : styles.theirContainer
            ]}
        >
            <Text style={[styles.messageText, isMine ? styles.mineText : styles.theirText]}>
                {message.message}
            </Text>
            {isMine && (
                <View style={styles.statusIcon}>
                    {message.isSeen ? (
                        <>
                            <Ionicons name="checkmark-done" size={16} color="white" />
                        </>
                    ) : (
                        <Ionicons name="checkmark" size={16} color="gray" />
                    )}
                </View>
            )}
        </View>
    );
};

// کامپوننت والد برای تمام پیام‌ها
export default function MessagesContainer({ messages , currentUserId }){
    return (
        <FlatList
            data={messages}
            keyExtractor={(item) => item._id.toString()}
            scrollEnabled = {true}
            renderItem={({ item }) => (
                <MessageItem message={item} currentUserId={currentUserId} />
            )}
            contentContainerStyle={styles.listContainer}
            inverted // برای اینکه پیام جدید پایین بیاد
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
    },
    messageContainer: {
        marginVertical: 5,
        maxWidth: '70%',
        padding: 10,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    mineContainer: {
        backgroundColor: '#0b93f6',
        alignSelf: 'flex-end',
        borderTopRightRadius: 0,
    },
    theirContainer: {
        backgroundColor: '#e5e5ea',
        alignSelf: 'flex-start',
        borderTopLeftRadius: 0,
    },
    messageText: {
        fontSize: 16,
    },
    mineText: {
        color: 'white',
    },
    theirText: {
        color: 'black',
    },
    statusIcon: {
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
