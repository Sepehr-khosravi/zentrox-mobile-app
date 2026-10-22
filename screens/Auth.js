import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const Auth = ({checkToken}) => {
  const tokenCheck = ()=>{
    checkToken();
  }
  const [activeTab, setActiveTab] = useState('login');
  const translateX = React.useRef(new Animated.Value(0)).current;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    Animated.spring(translateX, {
      toValue: tab === 'login' ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  const loginTranslateX = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -500],
  });

  const registerTranslateX = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'login' && styles.activeTab]}
            onPress={() => handleTabChange('login')}
          >
            <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'register' && styles.activeTab]}
            onPress={() => handleTabChange('register')}
          >
            <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formContainer}>
          {activeTab === 'login' && <LoginForm checkToken={tokenCheck} />}
          {activeTab === 'register' && <RegisterForm checkToken={tokenCheck} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    marginTop: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6200ee',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  formContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  form: {
    width: '100%',
  },
});

export default Auth;