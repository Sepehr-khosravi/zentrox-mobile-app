import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Comment from './comment';

const { height } = Dimensions.get('window');

export default function CommentsModal({ visible, onClose, postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;
      const response = await axios.post(api.getComments, { _id: postId }, {
        headers: {
          "auth-token": `Bearer ${token}`,
        }
      });
      if (response?.status === 200 && response.data.data) {
        setComments(response.data.data);
      } else {
        setComments([]);
      }
    } catch (e) {
      console.log("error in get comments", e);
    }
  };

  const submitNotification = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;
      const getTheToInfo = await axios.post(api.getAPost, {
        postId: postId
      }, {
        headers: { 'auth-token': `Bearer ${token}` }
      });
      const getTheSelfInfo = await axios.get(api.getId, {
        headers: { 'auth-token': `Bearer ${token}` }
      });
      const notification = {
        from: getTheSelfInfo.data.info.email,
        to: getTheToInfo.data.data.email,
        message: `${getTheSelfInfo.data.info.name} commented your post  : \n ${newComment}`,
        type: "comment"
      };
      const response = await axios.post(api.sendNotification, notification, {
        headers: { 'auth-token': `Bearer ${token}` }
      });
      if(!response || !response.data.data || response.status !== 200 || response.data.error){
        return;
      }
    } catch (e) {
      console.log("error in the submit Notification : ", e);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.post(api.uploadComment, {
        _id: postId,
        text: newComment.trim(),
      }, {
        headers: {
          'auth-token': `Bearer ${token}`,
        }
      });

      if (response?.status === 200 && response.data.data) {
        submitNotification();
        setNewComment('');
        fetchComments();
      }
    } catch (e) {
      console.log("error in upload comment :", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) fetchComments();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Comments</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color="#bbb" />
          </TouchableOpacity>
        </View>

        {/* Comments List */}
        {comments.length > 0 ? (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={Comment}
            contentContainerStyle={styles.commentList}
            style={{ flex: 1 }}
          />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No comments yet.</Text>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor="#666"
            value={newComment}
            multiline
            onChangeText={setNewComment}
            editable={!loading}
            maxLength={500}
          />
          <TouchableOpacity onPress={submitComment} disabled={loading}>
            <Ionicons name="send" size={20} color={loading ? '#666' : '#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    height: height * 0.85,
    backgroundColor: '#121212',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 0.5,
    borderColor: '#2b2b2b',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  commentList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderColor: '#2a2a2a',
    backgroundColor: '#1a1a1a',
  },
  input: {
    flex: 1,
    backgroundColor: '#2c2c2c',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#fff',
    fontSize: 14,
    marginRight: 10,
  },
});
