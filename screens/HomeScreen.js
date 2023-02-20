import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    setUser(currentUser);
  }, []);

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate("Login");
    } catch (error) {
      console.log("Sign out error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      {user && (
        <View>
          <Text style={styles.userText}>Name: {user.displayName}</Text>
          <Text style={styles.userText}>Email: {user.email}</Text>
        </View>
      )}
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
