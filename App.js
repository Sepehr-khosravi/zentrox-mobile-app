import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import { style } from "./config/config"
import MyDrawer from './Drawer';
import Navbar from './components/main/Home/navbar';
import Tabs from './Tabs';
import { api } from './config/config';
import Auth from './screens/Auth';
import UserProfile from './screens/userProfile';
import Setting from './screens/setting';
import Dm from './components/Chat/Dm';
import NotificationScreen from './screens/NotificationScreen';
import FriendRequestsList from './components/Chat/friendRequestsList';
import PostsScreen from './screens/PostsScreen';
import ProfileScreen from './screens/ProfileScreen';
// import 'react-native-gesture-handler';


const Stack = createStackNavigator();

export default function App() {
  const [userToken, setToken] = useState(null);
  const [isLogin, setLogin] = useState(null);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const response = await axios.post(api.verifyToken, { token: token });
        if (!response.data.error) {
          setToken(token);
          setLogin(true);
        } else {
          setToken("");
          setLogin(false);
        }
      } else {
        setToken("");
        setLogin(false);
      }
    } catch (e) {
      console.log('error in checking token : ', e);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);
  const personalType = { "colors": { "background": `${style.backgroundColor}`, "border": "rgb(39, 39, 41)", "card": `${style.backgroundColor}`, "notification": "rgb(255, 69, 58)", "primary": "rgb(10, 132, 255)", "text": "rgb(229, 229, 231)" }, "dark": true, "fonts": { "bold": { "fontFamily": "sans-serif", "fontWeight": "600" }, "heavy": { "fontFamily": "sans-serif", "fontWeight": "700" }, "medium": { "fontFamily": "sans-serif-medium", "fontWeight": "bold" }, "regular": { "fontFamily": "sans-serif", "fontWeight": "normal" } } }

  if (isLogin === null) return null;
  return (
    <>
      {
        isLogin ? (
          <>
            <NavigationContainer theme={personalType}>
              <StatusBar barStyle="light-content" />
              <Stack.Navigator screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: style.backgroundColor },
                animation: 'slide_from_right'
              }}>
                <Stack.Screen name='sideBar' component={MyDrawer} />
                <Stack.Screen name="Main" component={Tabs} />
                <Stack.Screen name="Setting" component={Setting} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
                <Stack.Screen name="Dm" component={Dm} />
                <Stack.Screen name="Notification" component={NotificationScreen} />
                <Stack.Screen name="FriendRequests" component={FriendRequestsList} />
                <Stack.Screen name='Dashboard' component={ProfileScreen} />
                <Stack.Screen name="Post" component={PostsScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </>
        ) : (
          <Auth checkToken={checkToken} />
        )
      }
    </>
  );
}

