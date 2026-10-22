import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar, Alert, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, style } from "../config/config";
import axios from 'axios';

const NotificationItem = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("UserProfile", { email: item.from })
      }
      style={[style2.card, { backgroundColor: style.backgroundNotification }]}
    >
      {/* Avatar */}
      <Image
        source={
          item.avatar
            ? { uri: item.avatar }
            : { uri: "https://dfge.de/wp-content/uploads/blank-profile-picture-973460_640.png" }
        }
        style={[style2.avatar, { borderColor: style.borderColor }]}
      />

      {/* Content */}
      <View style={style2.content}>
        <View style={style2.textRow}>
          <Text style={[style2.username, { color: style.textColor }]}>
            {item.username}
          </Text>
          <Text style={[style2.message, { color: style.textColor }]}>
            {item.message}
          </Text>
        </View>

        {/* Info Row */}
        <View style={style2.infoRow}>
          <Ionicons
            name={item.type === "like" ? "heart-outline" : "chatbubble-ellipses-outline"}
            size={16}
            color={style.iconColor}
            style={{ marginRight: 4 }}
          />
          <Text style={[style2.time, { color: style.iconColor }]}>
            {item.time}
          </Text>
        </View>
      </View>

      {/* Post Preview */}
      {
        item.postImage && ( 
        <Image source={{ uri: item.postImage ? item.postImage : "https://dfge.de/wp-content/uploads/blank-profile-picture-973460_640.png"  }} style={style2.postImage} />
        )
      }
        </TouchableOpacity>
  )
};
const style2 = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  textRow: {
    flexDirection: "column",
    marginBottom: 4,
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  time: {
    fontSize: 12,
  },
  postImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginLeft: 10,
  },
});

export default function NotificationScreen({ navigation }) {
  let [notifications, setNotifications] = useState([]);
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState("");
  let [originallResponse, setResponse] = useState({});

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setError("Please First Login Or Register");
        setResponse({});
        BackHandler.exitApp();
        return;
      }
      const response = await axios.get(api.getNotifications, {
        headers: { "auth-token": `Bearer ${token}` }
      });
      if (!response || response.status !== 200 || !response.data.data) {
        setLoading(true);
        setResponse({});
        setError("Please Check You're Connection");
        BackHandler.exitApp();
        return;
      }
      setNotifications(response.data.data);
      setTimeout(() => {
        console.log(notifications);
      }, 1000)
      setLoading(true);
    }
    catch (e) {
      setLoading(true)
      console.log("error in FetchNotifications : ", e);
    }
  }
  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} navigation={navigation} setError={setError} />}
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: style.backgroundColor,
    paddingTop: StatusBar.currentHeight
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: style.borderColor,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: "auto",
    marginLeft: 20
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: style.backgroundCard,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: style.shadowColor,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  textRow: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: 4,

  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  email: {
    fontSize: 13,
    fontWeight: "300",
    color: "gray"
  },
  message: {
    color: '#ddd',
    fontSize: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
  postImage: {
    width: 52,
    height: 52,
    borderRadius: 8,
    marginLeft: 10,
  },
});
