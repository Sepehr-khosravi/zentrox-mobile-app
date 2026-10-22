import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Tabs from "./Tabs";
import Setting from "./screens/setting";
import ProfileScreen from "./screens/ProfileScreen";

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="HomeTabs" component={Tabs} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name="Settings" component={Setting} />
        </Drawer.Navigator>
    );
}
