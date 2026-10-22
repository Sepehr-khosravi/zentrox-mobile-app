import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from './screens/HomeScreen';
import PostsScreen from './screens/PostsScreen';
import ProfileScreen from './screens/ProfileScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import SearchScreen from "./screens/searchScreen";
import ChatScreen from "./screens/chatScreen";
import { TouchableOpacity } from "react-native";


const Tab = createBottomTabNavigator();

export default function Tabs({ navigation }) {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'gray',
                tabBarShowLabel: false,
                tabBarStyle: {

                    backgroundColor: '#121212',
                    borderTopWidth: 0,
                    // borderTopColor: "#121212",
                    height: 75,

                    // width : "100%" ,
                    // height : "100%"
                },
                tabBarButton: (props) => {
                    const { children, onPress, style, ...otherProps } = props;

                    return (
                        <TouchableOpacity
                            {...otherProps}
                            onPress={onPress}
                            activeOpacity={1}
                            style={[
                                style,
                                {
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }
                            ]}
                        >
                            {children}
                        </TouchableOpacity>
                    );
                },
                tabBarIcon: ({ color, size, focused, style = {} }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Search':
                            iconName = focused ? "search" : "search-outline";
                            break;
                        case 'Post':
                            style = {
                                backgroundColor: "#1F1F1F",
                                width: 65,
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                height: 50,
                                paddingTop: "10",
                                borderRadius: 15
                            }
                            iconName = 'add';
                            size = 30;
                            color = focused ? 'white' : 'gray';
                            break;
                        case 'Chats':
                            iconName = focused ? "chatbubble" : "chatbubble-outline"
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'ellipse-outline';
                    }

                    return <Ionicons style={style} name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen options={{
                animation: "shift"
            }} name="Home" >
                {() => <HomeScreen navigationSec={navigation} />}
            </Tab.Screen>
            <Tab.Screen name="Search">
                {() => <SearchScreen />}
            </Tab.Screen>
            <Tab.Screen name="Post" component={PostsScreen} />
            <Tab.Screen name="Chats" component={ChatScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}