import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    FlatList,
    BackHandler
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { api, style } from '../config/config';
import RenderPost from '../components/main/Home/normalPosts/renderNormalPosts';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [tab, setTab] = useState("posts");

    const fetchUser = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');

            if (!token ) {
                Alert.alert("Error", "Please login or register first");
                navigation.navigate('Auth');
                BackHandler.exitApp();
                return;
            }

            const response = await axios.get(api.getProfile, {
                headers: {
                    "auth-token": `Bearer ${token}`
                }
            });

            if (!response || response.status !== 200) {
                Alert.alert("Error", "Failed to load profile data");
                return;
            }

            setUser(response.data.data);

        } catch (error) {
            console.error("Profile fetch error:", error);
            Alert.alert("Error", "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const getPosts = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                Alert.alert("Warning!", "please login or register!");
                return;
            }
            const response = await axios.get(api.getSelfePost, {
                headers: {
                    "auth-token": `Bearer ${token}`
                }
            });
            if (!response || !response.data.data || response.status !== 200 || response.data.error) {
                Alert.alert("Hello", "please check your connection");
                return;
            }
            setPosts(response.data.data);
        }
        catch (e) {
            console.log("getPosts error from profileScreen : ", e);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (tab === "posts") {
            getPosts();
        }
    }, [tab]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>User data not available</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchUser}
                >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.SafeArea} >
            <StatusBar translucent backgroundColor="transparent" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                        <Feather name="settings" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <ScrollView>

                    {/* Profile Content */}
                    {/* User Info Section */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: user.profile || "https://dfge.de/wp-content/uploads/blank-profile-picture-973460_640.png" }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.editAvatarBtn}>
                                <MaterialIcons name="edit" size={18} color="white" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.name}>{user.name || 'No Name'}</Text>
                        <Text style={styles.username}>{user.email ? `${user.email}` : ''}</Text>
                        <Text style={styles.bio}>{user.bio || 'No bio available'}</Text>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{user.followers || 0}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{user.following || 0}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.editProfileBtn}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <Text style={styles.editProfileBtnText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Profile Tabs */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity onPress={() => setTab("posts")} style={styles.tab}>
                            <Ionicons
                                name="grid"
                                size={24}
                                color={tab === "posts" ? style.textColor : style.iconColor}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setTab("saves")} style={styles.tab}>
                            <Ionicons
                                name="bookmark"
                                size={24}
                                color={tab === "saves" ? style.textColor : style.iconColor}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setTab("friends")} style={styles.tab}>
                            <Ionicons
                                name="person"
                                size={24}
                                color={tab === "friends" ? style.textColor : style.iconColor}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* User Posts */}
                    <View style={styles.postsContainer}>
                        {posts.length > 0 ? (
                            <FlatList
                                data={posts}
                                keyExtractor={(item) => item._id}
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <RenderPost
                                        item={item}
                                        isLiked={false}
                                        onLike={() => { }}
                                        from="profile"
                                        ListEmptyComponent={<Text style={styles.emptyText}>No posts yet.</Text>}
                                        style={styles.verticalList}
                                    />
                                )}
                            />
                        ) : (
                            <Text style={styles.emptyPostsText}>No posts yet</Text>
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    SafeArea: {
        flex: 1,
        backgroundColor: '#121212'
    },
    verticalList: { paddingHorizontal: 10 },
    emptyText: { color: '#aaa', textAlign: 'center', marginTop: 30 },
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: StatusBar.currentHeight
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
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
    retryButton: {
        backgroundColor: '#333',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        paddingBottom: 20,
    },
    profileSection: {
        alignItems: 'center',
        padding: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#444',
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#444',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    username: {
        color: '#aaa',
        fontSize: 16,
        marginBottom: 8,
    },
    bio: {
        color: '#ddd',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
        maxWidth: '80%',
        lineHeight: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#aaa',
        fontSize: 14,
    },
    editProfileBtn: {
        backgroundColor: '#333',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 8,
    },
    editProfileBtnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#333',
        paddingVertical: 12,
    },
    tab: {
        padding: 8,
    },
    postsContainer: {
        width: "100%",
    },
    emptyPostsText: {
        color: '#777',
        fontSize: 16,
    },
});

export default ProfileScreen;
