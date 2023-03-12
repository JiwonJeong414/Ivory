import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import firebase from "./firebase"; // don't get rid (intializing firebase)
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import NameScreen from "./screens/NameScreen";
import CameraScreen from "./screens/CameraScreen";
import InitializeScreen from "./screens/InitializeScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [animation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: state.index,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [animation, state.index]);

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const scale = animation.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [0.8, 1.2, 0.8],
          extrapolate: "clamp",
        });

        const borderScale = animation.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [1, 1.5, 1],
          extrapolate: "clamp",
        });

        return (
          <TouchableOpacity
            key={index}
            style={styles.tabBarButton}
            onPress={onPress}
          >
            <Animated.View
              style={{
                transform: [{ scale }],
              }}
            >
              <MaterialCommunityIcons
                name="hexagon"
                style={{ alignItems: "center" }}
                size={50}
                color={isFocused ? "#e91e63" : "#fdf8e8"}
              ></MaterialCommunityIcons>
              <View style={{ position: "absolute", left: 10, top: 10 }}>
                <MaterialCommunityIcons
                  name={options.tabBarIcon}
                  size={30}
                  color={isFocused ? "black" : "#ccc"}
                />
              </View>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        swipeEnabled: true,
        tabBarActiveTintColor: "red",
        tabBarShowLabel: false,
      }}
      tabBarPosition="bottom"
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: "home",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: "account",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: "cog",
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="Initialize" component={InitializeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9efe0",
    alignItems: "center",
    justifyContent: "center",
  },
  graphics: {
    width: "100%",
    height: "30%",
  },
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fdf8e8",
    borderTopWidth: 1,
    paddingVertical: 10,
    borderTopColor: "#fdf8e8",
  },
  tabBarButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    color: "#ccc",
  },
  tabBarLabelActive: {
    color: "#e91e63",
  },
  hexagonContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
