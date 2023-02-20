import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import * as Google from "expo-google-app-auth";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

export default function LoginScreen2() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const redirectUri = makeRedirectUri({
    useProxy: true,
  });

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

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log("Sign out error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.userContainer}>
          <Text style={styles.userText}>Logged in as:</Text>
          <Text style={styles.userText}>{user.displayName}</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
      ) : (
        <View style={styles.signInContainer}>
          <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
        </View>
      )}
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
