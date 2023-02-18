import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { GOOGLE_CLIENT_ID } from "../config";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

const redirectUri = makeRedirectUri({
  useProxy: true,
});

const scopes = ["email"];
const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <GoogleSignInButton />
    </View>
  );
};

function GoogleSignInButton() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: scopes,
      redirectUri: redirectUri,
      usePKCE: false,
      prompt: "select_account",
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      // TODO: Handle authentication object
    }
  }, [response]);

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
