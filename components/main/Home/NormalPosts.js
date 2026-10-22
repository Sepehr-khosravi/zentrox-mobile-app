import React, { useState, useEffect } from 'react';
import { FlatList, Text, StyleSheet, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RenderPost from './normalPosts/renderNormalPosts';
import { api } from '../../../config/config';

export default function NormalPosts({ refreshFlag }) {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState({});
    const [userId, setUserId] = useState(null);

    const fetchUserId = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) return;

            const res = await axios.get(api.getId, {
                headers: { 'auth-token': `Bearer ${token}` },
            });
            if (res.status === 200) setUserId(res.data.data);
        } catch (err) {
            console.log('getId error:', err);
        }
    };

    const fetchPosts = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                // BackHandler.exitApp();
                return Alert.alert('Hello', 'please login or register')
            };

            const res = await axios.get(api.explore, {
                headers: { 'auth-token': `Bearer ${token}` },
            });

            if (res.status === 200) {
                const fetched = res.data.data;

                const likeMap = {};
                fetched.forEach(p => {
                    likeMap[p._id] = p.likedUsers?.includes(userId);
                });

                setLikedPosts(likeMap);
                setPosts(fetched);
            } else {
                Alert.alert('Error', 'Could not load posts');
            }
        } catch (err) {
            console.log('NormalPosts error:', err);
        }
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) fetchPosts();
    }, [userId, refreshFlag]);
    //for handeling the submit notification : 
    const submitNotification = async (postId) => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                Alert.alert("Hello", "please first login or register.");
                // BackHandler.exitApp();
                await AsyncStorage.clear();
                return;
            };
            const getTheToInfo = await axios.post(api.getAPost, {
                postId: postId
            }, {
                headers: { 'auth-token' : `Bearer ${token}` }
            });
            if (!getTheToInfo || getTheToInfo.status !== 200 || !getTheToInfo.data.data) {
                Alert.alert("Error !!", "please check your connection one");
                // BackHandler.exitApp();
                return;
            }
            const getTheSelfInfo = await axios.get(api.getId, {
                headers: { 'auth-token' : `Bearer ${token}` }
            });
            if (!getTheSelfInfo || getTheSelfInfo.status !== 200 || !getTheSelfInfo.data.data) {
                Alert.alert("Error !!", "please check your connection Two");
                // BackHandler.exitApp();
                return;
            };
            const notification = {
                from: getTheSelfInfo.data.info.email,
                to: getTheToInfo.data.data.email,
                message: `${getTheSelfInfo.data.info.name} liked your post`,
                type: "like"
            }
            const response = await axios.post(api.sendNotification, notification, {
                headers: { 'auth-token' : `Bearer ${token}` }
            });
            if (!response || response.status !== 200) {
                Alert.alert("Warning!!", "please check your connection! response");
                // BackHandler.exitApp();
                return;
            };
        }
        catch (e) {
            console.log("error is in the submit Notifcation api : ", e);
            Alert.alert("Warrningg!!", "please check you'r connection!");
            // BackHandler.exitApp();
        }
    }
    const handleLike = async postId => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) return;

            const res = await axios.post(
                api.like,
                { _id: postId },
                { headers: { 'auth-token': `Bearer ${token}` } }
            );

            if (res.status === 200) {
                submitNotification(postId);
                setPosts(prev =>
                    prev.map(p =>
                        p._id === postId
                            ? { ...p, like: likedPosts[postId] ? p.like - 1 : p.like + 1 }
                            : p
                    )
                );
                setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
            }
        } catch (err) {
            console.log('like error:', err);
        }
    };

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <RenderPost
                    item={item}
                    isLiked={likedPosts[item._id]}
                    onLike={handleLike}
                />
            )}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.emptyText}>No posts yet.</Text>}
            style={styles.verticalList}
        />
    );
}

const styles = StyleSheet.create({
    verticalList: { paddingHorizontal: 10 },
    emptyText: { color: '#aaa', textAlign: 'center', marginTop: 30 },
});
