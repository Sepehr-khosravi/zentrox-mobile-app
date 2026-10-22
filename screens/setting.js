import { StyleSheet, Text, View, TouchableOpacity , StatusBar, BackHandler, Alert } from 'react-native'
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import React from 'react'

export default function Setting({navigation}) {
  const logOut = async ()=>{
    try{
      await AsyncStorage.clear();
      BackHandler.exitApp();
    }
    catch(e){
      Alert.alert("Hello" , "pleas check you'r connection");
      BackHandler.exitApp();
      console.log("error in log out systems :" , e);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setting</Text>
      </View>
      <Text onPress={logOut} style={{color : "red" , position : "absolute" , top : "50%" , right : "50%" , transform : "translate(50% , 50%)"  }}>Log out</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop : StatusBar.currentHeight ,
    textAlign : "center"
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
    marginRight : "auto" ,
    marginLeft : 20
  },
})