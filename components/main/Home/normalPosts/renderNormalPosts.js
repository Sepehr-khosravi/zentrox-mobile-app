import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Octicons';

import CommentsModal from './comments';
import { style } from '../../../../config/config';

function CommentButton({ onPress, userItem }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.action}>
      <Ionicons name="chatbubble-outline" size={18} color="#666" />
      <Text style={styles.actionText}>
        {userItem?.comments?.length || 0}
      </Text>
    </TouchableOpacity>
  );
}

export default function RenderPost({ item, isLiked, onLike, from }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const preview = item?.description?.slice(0, 150) || '';
  const full = item?.description || '';

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

      if (year > 0) return `${year}y`;
      if (month > 0) return `${month}mo`;
      if (day > 0) return `${day}d`;
      if (hour > 0) return `${hour}h`;
      if (min > 0) return `${min}m`;
      return `${diffSec}s`;
    } catch {
      return 'Now';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          source={{
            uri:
              item?.profile ||
              'https://dfge.de/wp-content/uploads/blank-profile-picture-973460_640.png',
          }}
          style={styles.avatar}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.username}>{item?.name || 'Unknown'}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.time}>{handleTime(item?.createdAt)}</Text>
          </View>

          {/* Post Description */}
          {full.length > 0 && (
            <Text style={styles.description}>
              {isExpanded ? full : preview}
              {full.length > 150 && (
                <Text
                  onPress={() => setIsExpanded(!isExpanded)}
                  style={styles.readMore}
                >
                  {isExpanded ? ' Read less' : ' Read more'}
                </Text>
              )}
            </Text>
          )}

          {/* Actions (Like + Comment) */}
          <View style={styles.actions}>
            {from !== 'profile' && (
              <TouchableOpacity
                onPress={() => onLike(item._id)}
                style={styles.action}
              >
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isLiked ? '#E91E63' : '#666'}
                />
                <Text
                  style={[
                    styles.actionText,
                    { color: isLiked ? '#E91E63' : '#666' },
                  ]}
                >
                  {item?.like || 0}
                </Text>
              </TouchableOpacity>
            )}

            <CommentButton
              onPress={() => setShowComments(true)}
              userItem={item}
            />
          </View>
          {/* <View>
            <Icon name="home" size={24} color={style.iconColor} />;
          </View> */}
        </View>
      </View>

      {/* Comments Modal */}
      <CommentsModal
        visible={showComments}
        onClose={() => setShowComments(false)}
        postId={item?._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
  },
  dot: {
    marginHorizontal: 4,
    color: '#888',
    fontSize: 12,
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#666',
  },
});
