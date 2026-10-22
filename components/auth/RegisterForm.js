import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../config/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterForm = ({ checkToken }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async () => {
        try {
            if (name && email && password && confirmPassword) {
                if (password === confirmPassword) {
                    const user = { name, email, password };
                    const response = await axios.post(api.register, user);
                    console.log(response.data.data);
                    if (response.status !== 200) {
                        await AsyncStorage.clear();
                        return;
                    }
                    if (response.data.data) {
                        await AsyncStorage.setItem("userToken", response.data.data.token);
                        checkToken();
                    }
                }
                else {
                    Alert.alert("Hello", "invalid password");
                }
            }
            else {
                Alert.alert("Hello", "invalid email or password !");
            }
        }
        catch (e) {
            console.log("RegisterForm.js : ", e);
        }
    };

    // برای مخفی کردن کیبورد هنگام کلیک خارج از input
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContainer}
                enableOnAndroid={true}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#555"
                                    value={name}
                                    onChangeText={setName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                />
                                <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#555"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#555"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.icon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#888"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm your password"
                                    placeholderTextColor="#555"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.icon}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#888"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                            <Text style={styles.registerButtonText}>Create Account</Text>
                        </TouchableOpacity>

                        <View style={styles.termsContainer}>
                            <Text style={styles.termsText}>
                                By registering, you agree to our
                                <Text style={styles.linkText}> Terms of Service </Text>
                                and
                                <Text style={styles.linkText}> Privacy Policy</Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        color: '#fff',
        height: 50,
        paddingRight: 10,
    },
    icon: {
        marginLeft: 10,
    },
    registerButton: {
        backgroundColor: '#6200ee',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    termsContainer: {
        marginTop: 20,
    },
    termsText: {
        color: '#888',
        fontSize: 12,
        textAlign: 'center',
    },
    linkText: {
        color: '#6200ee',
    },
});
export default RegisterForm;