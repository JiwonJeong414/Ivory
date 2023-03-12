import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as Google from "expo-google-app-auth";
import * as FileSystem from "expo-file-system";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";

const GOOGLE_CLOUD_VISION_API_KEY = "AIzaSyAklSmL7qNTvlC5p1GfbtiuI10QyteWb5c";
const VISION_API_URL =
  "https://vision.googleapis.com/v1/images:annotate?key=${AIzaSyAklSmL7qNTvlC5p1GfbtiuI10QyteWb5c}";

export default function CameraScreen() {
  const navigation = useNavigation();

  const state = {
    image: null,
    uploading: false,
    googleResponse: null,
  };

  const [imageUri, setImageUri] = useState(null);
  const [extractedText, setExtractedText] = useState(null);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.5,
    });
    if (!result.cancelled) {
      setImageUri(result.uri);
      const downloadURL = await uploadImageAsync(result.uri);
      extractTextFromImage(downloadURL);
    }
  };

  const uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const ref = firebase.storage().ref().child(uuid.v4().toString());
    const snapshot = await ref.put(blob);
    blob.close();
    return await snapshot.ref.getDownloadURL();
  };

  const extractTextFromImage = async (downloadURL) => {
    let body = JSON.stringify({
      requests: [
        {
          features: [{ type: "TEXT_DETECTION" }],
          image: {
            source: {
              imageUri: downloadURL,
            },
          },
        },
      ],
    });
    let response = await fetch(
      "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAklSmL7qNTvlC5p1GfbtiuI10QyteWb5c",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: body,
      }
    );
    let responseJson = await response.json();
    const textAnnotations = responseJson.responses[0].fullTextAnnotation;
    const extractedText = textAnnotations && textAnnotations.text;
    setExtractedText(extractedText);
  };

  const handleBack = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      {imageUri && <Image style={styles.image} source={{ uri: imageUri }} />}
      {extractedText && <Text style={styles.text}>{extractedText}</Text>}
      <Button title="Select Image" onPress={handleImagePicker} />
      <Button title="Back" onPress={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 10,
  },
  text: {
    marginVertical: 10,
  },
});
