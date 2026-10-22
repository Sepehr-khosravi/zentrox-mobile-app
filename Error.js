import React, { useEffect } from 'react';
import { View, Text, StyleSheet , TouchableOpacity, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ErrorNetwork() {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>data not available</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        padding: 20,
    },
    errorText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 20,
    },
})