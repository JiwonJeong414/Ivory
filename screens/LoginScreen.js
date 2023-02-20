import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import * as Google from "expo-google-app-auth";
import { makeRedirectUri } from "expo-auth-session";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        navigation.navigate("Home");
      }
    });

    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId:
          "767171017028-j0d27kq4l9o6d2ntlnnppv4mbqk77kml.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        const { idToken, accessToken } = result;
        const credential = firebase.auth.GoogleAuthProvider.credential(
          idToken,
          accessToken
        );
        await firebase.auth().signInWithCredential(credential);
      }
    } catch (error) {
      console.log("Google Sign-In error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.signInContainer}>
        <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userContainer: {
    alignItems: "center",
  },
  userText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  signInContainer: {
    padding: 20,
  },
});
