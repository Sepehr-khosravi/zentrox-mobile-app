import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../config/config';
import { style } from '../config/config';

export default function PostsScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [resultText, setResult] = useState("");
  const [error, setError] = useState("");
  const [description, setDescription] = useState('');
  const [isPremium, setPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardVisible(true);
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -e.endCoordinates.height + 80,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const response = await axios.get(api.checkPremium, {
          headers: {
            "auth-token": `Bearer ${token}`,
          }
        });
        if (!response || response.status !== 200) {
          setPremium(false);
          Alert.alert("Hello", "please check your connection");
        }
        setPremium(response.data.isPremium);
      }
      else {
        setPremium(false);
        Alert.alert("Hello", "please login or register");
      }
    } catch (e) {
      console.log("error in checking isPremium or not :", e);
      setPremium(false);
    }
  };
  //for getting the self data :
  const [user, setUser] = useState();
  const getInfoData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Hello", "please login or register");
        return;
      }
      const response = await axios.get(api.getProfile, {
        headers: {
          "auth-token": `Bearer ${token}`
        }
      });
      if (!response || !response.data.data || response.data.error || response.status !== 200) {
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
    checkPremiumStatus();
    getInfoData();
  }, []);

  const handleCreate = async (Premium) => {
    try {

      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Hello", "please first login or register !");
        return;
      }

      const response = await axios.post(
        api.uploadPost,
        { description : message, isPremium: Premium },
        { headers: { "auth-token": `Bearer ${token}` } }
      );

      if (response.status !== 200) {
        Alert.alert("Hello", "please first check your connection");
        setError(response.data.message);
        return;
      }

      setResult(response.data.message);
      setError("");
      setMessage('');
      navigation.goBack();
    } catch (e) {
      console.log("error in the client for getting the posts :", e);
      setError("An error occurred while creating the post");
    }
  };

  const actionButtons = [
    { icon: 'image-outline', label: 'Gallery' },
    { icon: 'camera-outline', label: 'Camera' },
    { icon: 'happy-outline', label: 'Sticker' },
    { icon: 'ellipsis-horizontal', label: 'More' }
  ];

  return (
    <Modal
      visible={true}
      transparent={false}
      animationType="slide"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  navigation.goBack();
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close-outline" size={28} color={style.iconColor} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create Post</Text>
              <TouchableOpacity
                style={[styles.postButton, !message && styles.postButtonDisabled]}
                disabled={!message}
                onPress={() => handleCreate(false)}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <View style={styles.userInfoContainer}>
              <Image
                source={{
                  uri: user?.profile ? user?.profile : "https://dfge.de/wp-content/uploads/blank-profile-picture-973460_640.png"
                }}
                style={styles.userAvatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.username}>{user?.name ? user?.name : "Unknown"}</Text>
                <TouchableOpacity style={styles.privacyButton}>
                  <Ionicons name="earth" size={14} color="#666" />
                  <Text style={styles.privacyText}>Public</Text>
                  <Ionicons name="chevron-down" size={14} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Text Input */}
            <ScrollView style={styles.contentContainer}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="What's on your mind?"
                placeholderTextColor="#666"
                style={styles.textInput}
                multiline
                textAlignVertical="top"
                maxLength={500}
              />

              {message.length > 0 && (
                <Text style={styles.charCount}>
                  {message.length}/500
                </Text>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              {actionButtons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionButton}
                  onPress={() => Alert.alert(button.label + " clicked")}
                >
                  <Ionicons name={button.icon} size={24} color="#666" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Floating Post Button (appears when keyboard is open) */}
            {/* <Animated.View
              style={[
                styles.floatingPostButton,
                {
                  transform: [{ translateY }],
                  opacity: opacityAnim
                }
              ]}
            >
              <TouchableOpacity
                style={[styles.floatingButton, !message && styles.floatingButtonDisabled]}
                disabled={!message}
                onPress={() => handleCreate(false)}
              >
                <Ionicons name="send" size={20} color="white" />
                <Text style={styles.floatingButtonText}>Post</Text>
              </TouchableOpacity>
            </Animated.View> */}

            {/* Premium Option */}
            {/* {isPremium && (
              <View style={styles.premiumContainer}>
                <TouchableOpacity
                  style={styles.premiumButton}
                  onPress={() => handleCreate(true)}
                >
                  <Ionicons name="diamond" size={20} color="#FFD700" />
                  <Text style={styles.premiumButtonText}>Post as Premium</Text>
                </TouchableOpacity>
              </View>
            )} */}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: style.backgroundColor || '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  postButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
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
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    color: 'white',
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  floatingPostButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  floatingButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  premiumContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  premiumButtonText: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});