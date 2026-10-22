import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { style } from "../../../config/config";
import Logo from "../../../assets/images/Logo.png";


export default function Navbar({ navigation }) {
  let [search, setSearch] = useState('');


  return (
    <View style={styles.container}>
      <Ionicons onPress={() => navigation.toggleDrawer()}  style={{ fontWeight: "bold" }} name="menu-outline" size={24} color={style.iconColor} />
      <Image source={Logo} style={styles.logo} />
      {/* <View  style={styles.searchInput}>
      <TextInput style={{color : "white" , width : "90%"}}
        placeholder="Search posts..."
        placeholderTextColor="#888"
        value={search}
        onChange={setSearch}
      />
        <Ionicons name="search-outline" size={20} color="#888" style={styles.icon} />
        </View> */}
      <Ionicons onPress={() => { navigation.navigate("Notification") }} name="notifications-outline" size={24} color={style.iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 110,
    justifyContent: "space-between",
    // borderBottomWidth: 1,
    // borderBottomColor: '#222',
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#121212',
  },
  logo: {
    width: 60,
    height: 60
    // fontSize: 23,
    // color: '#fff',
    // fontWeight: 'bold',
    // flex: 1,
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 25,
    outlineWidth: 0,
    outlineOffset: 0,
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 16,
    width: '60%',
    marginRight: 15,
  },
  actions: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
});
