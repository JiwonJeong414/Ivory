import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  var provider = new firebase.auth.GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      await firebase.auth().signInWithRedirect(provider);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRedirectResult = async () => {
    try {
      const result = await firebase.auth().getRedirectResult();
      if (result.user) {
        console.log(result.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleGoogleSignIn} />
      <Button title="Check redirect result" onPress={handleRedirectResult} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
