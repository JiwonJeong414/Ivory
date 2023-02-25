import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Google from "expo-google-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InitializeScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [canvas, setCanvas] = useState(false);
  const [classroom, setClassroom] = useState(false);

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (canvas && classroom) navigation.navigate("Home");
  }, [canvas, classroom]);

  const getCanvasCourses = async () => {
    const apiUrl = "https://iusd.instructure.com/api/v1";
    const canvasToken = await getCanvasAccessToken();
    try {
      let courses = [];
      let page = 1;
      let config = {
        headers: { Authorization: `Bearer ${canvasToken}` },
        params: { per_page: 100, page: page },
      };
      let response = await axios.get(`${apiUrl}/courses`, config);
      courses = courses.concat(response.data);
      while (response.data.length === 100) {
        page++;
        config.params.page = page;
        response = await axios.get(`${apiUrl}/courses`, config);
        courses = courses.concat(response.data);
      }
      const finalCourses = courses
        .filter((course) => course.name !== undefined)
        .filter((course) => !course.name.includes("Irvine"))
        .map((course) => course.name);
      const uid = user.uid;
      const userRef = firebase.firestore().collection("students").doc(uid);
      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const currentCourses = doc.data().courses || [];
            const combinedCourses = [...currentCourses, ...finalCourses];
            return userRef.update({
              courses: combinedCourses,
            });
          } else {
            return userRef.set({
              courses: finalCourses,
            });
          }
        })
        .then(() => {
          console.log("Successfully saved courses for user", uid);
        })
        .catch((error) => {
          console.error("Error saving courses for user", uid, error);
        });
      setCanvas(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getClassroomCourses = async () => {
    try {
      const accessToken = await getClassroomAccessToken();
      const response = await axios.get(
        "https://classroom.googleapis.com/v1/courses",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const array = response.data.courses
        .filter((course) => course.courseState === "ACTIVE")
        .map(function (item) {
          return item["name"];
        });
      const uid = user.uid;
      const userRef = firebase.firestore().collection("students").doc(uid);
      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const currentCourses = doc.data().courses || [];
            const combinedCourses = [...currentCourses, ...array];
            return userRef.update({
              courses: combinedCourses,
            });
          } else {
            return userRef.set({
              courses: array,
            });
          }
        })
        .then(() => {
          console.log("Successfully saved courses for user", uid);
        })
        .catch((error) => {
          console.error("Error saving courses for user", uid, error);
        });
      setClassroom(true);
    } catch (error) {
      console.error("Error retrieving courses", error);
      throw error;
    }
  };

  const getCanvasAccessToken = async () => {
    // temp Access Token
    // ToDo: Oauth2.0 method
    const token =
      "3007~pk06pga4ouulN1dGIjmnFdCwfo9DpAJNxTTqlAFpMCKpzHYZALQNobl512KgOQhB";
    await AsyncStorage.setItem("CanvasToken", token);
    return token;
  };

  const getClassroomAccessToken = async () => {
    const result = await Google.logInAsync({
      iosClientId:
        "767171017028-j0d27kq4l9o6d2ntlnnppv4mbqk77kml.apps.googleusercontent.com",
      scopes: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/classroom.courses.readonly",
        "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
      ],
    });
    if (result.type === "success") {
      await AsyncStorage.setItem("ClassroomToken", result.accessToken);
      return result.accessToken;
    }
  };

  return (
    <View style={styles.container}>
      <Text>Use Your IUSD Email To Sign In!</Text>
      <Button title="Initialize Canvas" onPress={getCanvasCourses} />
      {canvas ? <Text>Success</Text> : <></>}
      <Button title="Initialize Classroom" onPress={getClassroomCourses} />
      {classroom ? <Text>Success</Text> : <></>}
    </View>
  );
};

export default InitializeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdf8e8",
  },
});
