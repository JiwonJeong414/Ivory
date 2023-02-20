import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function NameScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigation = useNavigation();

  const handleSave = async () => {
    const user = firebase.auth().currentUser;
    await user.updateProfile({
      displayName: `${firstName} ${lastName}`,
    });
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your name</Text>
      <TextInput
        style={styles.input}
        placeholder="First name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last name"
        value={lastName}
        onChangeText={setLastName}
      />
      <Button title="Save" onPress={handleSave} />
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
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
});
