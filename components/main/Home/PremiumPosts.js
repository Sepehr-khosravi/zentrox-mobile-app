import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../config/config';

export default function PremiumPosts({ refreshFlag }) {
  const [premiumPosts, setPremiumPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);

  const fetchPremiumPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(api.getPostS, {
        headers: { 'auth-token': `Bearer ${token}` },
      });
      if (res.status === 200) {
        setPremiumPosts(res.data.data);
      } else {
        Alert.alert('Error', 'Could not load premium posts');
      }
    } catch (err) {
      console.log('PremiumPosts error:', err);
    }
  };

  useEffect(() => {
    fetchPremiumPosts();
  }, [refreshFlag]);

  const renderPremiumPost = ({ item, index }) => {
    const isExpanded = expandedPost === index;
    const description = isExpanded || item.description.length < 100
      ? item.description
      : `${item.description.substring(0, 100)}...`;

    return (
      <View style={styles.cardWrapper}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setExpandedPost(isExpanded ? null : index)}
        >
          <View style={[styles.postCard, isExpanded && styles.postCardExpanded]}>
            <View style={styles.userRow}>
              <Image
                source={{ uri: item?.avatar || 'https://dfge.de/wp-content/uploads/blank-profile-picture-973460_640.png' }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item?.name || 'Unknown User'}</Text>
                <Text style={styles.userEmail}>{item?.email || 'No email'}</Text>
              </View>
              <Ionicons name="diamond" size={20} color="#fff" style={{ marginLeft: 'auto' }} />
            </View>

            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postDesc}>
              {description}
            </Text>

            {item.description.length >= 100 && (
              <Text style={styles.readMore}>
                {isExpanded ? 'Show less ▲' : 'Read more ▼'}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      horizontal
      data={premiumPosts}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderPremiumPost}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
    />
  );
}

const styles = StyleSheet.create({
  horizontalList: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 20,
  },
  cardWrapper: {
    paddingRight: 16,
  },
  postCard: {
    backgroundColor: '#1c1c1e',
    padding: 20,
    borderRadius: 20,
    width: 300,
    borderWidth: 1,
    borderColor: '#292929',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    transition: 'all 0.3s ease-in-out',
  },
  postCardExpanded: {
    backgroundColor: '#232323',
    borderColor: '#fff',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 14,
    backgroundColor: '#444',
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  userEmail: {
    color: '#999',
    fontSize: 12,
  },
  postTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postDesc: {
    color: '#e0e0e0',
    fontSize: 15,
    lineHeight: 22,
  },
  readMore: {
    marginTop: 10,
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});
