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
import { api } from '../config/config';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RenderResult from '../components/main/Search/RenderResult';

export default function SearchScreen() {

  const [activeTab, setActiveTab] = useState("posts");
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [textColor, setTextColor] = useState("#121212");

  const addFriend = async(id)=>{
      try{
        const token = await AsyncStorage.getItem("userToken");
        if(!token){
          Alert.alert("warning!" , "please login or register");
          return false;
        }
        const response = await axios.post(api.sendFriendRequest , {userId : id} , {
          headers : {
            "auth-token" : `Bearer ${token}`
          }
        });
        if(!response || response.status !== 200){
          Alert.alert("hello" , "please check your connection");
          return false;
        }
        if(response.data.error){
          return false;
        }
        console.log("ok");
        return true;
      }
      catch(e){
        console.log("addFriend error : " , e);
      }
  }


  useEffect(() => {
    if (query.length > 0) fetchResults();
    else setResults([]);
  }, [activeTab]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Hello", "Please login or register");
        return BackHandler.exitApp();
      }

      const url = activeTab === "posts" ? api.searchThePosts : api.searchTheUsers;
      const res = await axios.post(url, { search: query }, {
        headers: { "auth-token": `Bearer ${token}` }
      });

      if (res.data.data.length > 0) {
        setResults(res.data.data);
      }
      else if (res.data.data.length === 0) {
        setResults([]);
        setTextColor("#ffff")
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  };

  const handleTime = (createdAt) => {
    try {
      const now = new Date();
      const created = new Date(createdAt);
      const diffSec = Math.floor((now - created) / 1000);
      const min = Math.floor(diffSec / 60);
      const hour = Math.floor(min / 60);
      const day = Math.floor(hour / 24);
      const month = Math.floor(day / 30);
      const year = Math.floor(month / 12);

      if (year > 0) return `${year} year${year > 1 ? "s" : ""} ago`;
      if (month > 0) return `${month} month${month > 1 ? "s" : ""} ago`;
      if (day > 0) return `${day} day${day > 1 ? "s" : ""} ago`;
      if (hour > 0) return `${hour} hour${hour > 1 ? "s" : ""} ago`;
      if (min > 0) return `${min} minute${min > 1 ? "s" : ""} ago`;
      return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;
    } catch {
      return "Just now";
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={fetchResults}
          returnKeyType="search"
        />
        <Ionicons name="search-outline" size={20} color="#888" style={styles.icon} />
      </View>

      <View style={styles.tabContainer}>
        {['posts', 'users'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#888" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <RenderResult item={item} activeTab={activeTab} results={results} addFriend={addFriend}  />}
          contentContainerStyle={{ paddingTop: 16 }}
        />
      )}
      <View style={{ flex: 1, width: "100%", height: '10', justifyContent: "center", alignItems: "center" }}>
        {
          !results.length ? (
            <Text style={{ flex: 1, color: textColor, justifyContent: "center", alignItems: "center" }}>{`${activeTab}`} Not Find.</Text>
          ) : (
            <View></View>
          )
        }
      </View>
    </View>
  );
}

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
    paddingBottom : 10
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
    fontSize : 10 ,
    width: 60,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignContent: "center",
    textAlign : "center" ,
    marginLeft: "auto"
  },
  addContractText: {
    textAlign: "center",
    color: "white",
    alignContent: "center",
  }
});