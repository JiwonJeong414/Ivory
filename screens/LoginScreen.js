import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import React, { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { AuthError, makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { GOOGLE_CLIENT_ID } from "../config";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/app";
import "firebase/auth";
import uuid from "react-native-uuid";

const state = uuid.v4().toString();

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

const redirectUri = makeRedirectUri({
  useProxy: true,
});

// https://auth.expo.io/@jiwonjeong414/Ivory

const scopes = ["openid", "profile", "email"];

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  async function handleLogin() {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      // Handle login error
    }
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <GoogleSignInButton />
    </View>
  );
};

function GoogleSignInButton() {
  const navigation = useNavigation();

  const [request, response, promptAsync, promptAsyncCallback] = useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: scopes,
      redirectUri: redirectUri,
      usePKCE: false,
      state: state,
      prompt: "select_account",
      useProxy: false,
    },
    discovery
  );

  React.useEffect(() => {
    console.log(request);
    if (response.type === "success") {
      const { authentication } = response;
      const credential = firebase.auth.GoogleAuthProvider.credential(
        authentication.accessToken
      );
      firebase
        .auth()
        .signInWithCredential(credential)
        .then((userCredential) => {
          const { email } = userCredential.user;
          // TODO: Redirect to homepage and display user email
          navigation.navigate("Home", { email });
        })
        .catch((error) => {
          console.log(error);
          // Handle sign-in error
        });

      WebBrowser.dismissBrowser();
    } else if (response?.type === "error") {
      try {
        const authError = new AuthError(response.params);
        console.log(authError);
      } catch (e) {
        console.log(response.params);
      }
    }
  }, [response]);

  React.useEffect(() => {
    if (promptAsyncCallback) {
      promptAsyncCallback().catch(onError);
    }
  }, [promptAsyncCallback]);

  return (
    <Button
      disabled={!request}
      onPress={() => {
        promptAsync();
      }}
      title="Sign in with Google"
    />
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
