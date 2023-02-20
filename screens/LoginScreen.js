import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import * as Google from "expo-google-app-auth";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";

export default function LoginScreen() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        setEmail("");
        setPassword("");
        navigation.navigate("Name");
        console.log("Registered: ", user.email);
      })
      .catch((error) => alert(error.message));
  };

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        setEmail("");
        setPassword("");
        navigation.navigate("Home");
        console.log("Loggined in with: ", user.email);
      })
      .catch((error) => alert(error.message));
  };

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
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signInContainer}>
        <TouchableOpacity
          style={[styles.button2, styles.googleButton]}
          onPress={handleGoogleSignIn}
        >
          <MaterialCommunityIcons
            name="google"
            size={24}
            color="#4285F4"
            style={styles.googleIcon}
          />
          <Text style={[styles.buttonText2, styles.googleButtonText]}>
            {"        "}Sign in with Google
          </Text>
        </TouchableOpacity>
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
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: moderateScale(250),
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  button2: {
    width: moderateScale(210),
    height: moderateScale(40),
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4285F4",
  },
  googleIcon: {
    right: moderateScale(170),
    position: "absolute",
  },
  googleButtonText: {
    color: "#4285F4",
  },
});
