import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Google from "expo-google-app-auth";

const apiUrl = "https://iusd.instructure.com/api/v1";
const token =
  "3007~pk06pga4ouulN1dGIjmnFdCwfo9DpAJNxTTqlAFpMCKpzHYZALQNobl512KgOQhB";

// async function getCourses() {
//   try {
//     const response = await axios.get(`${apiUrl}/courses`);
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// }

async function getAssignments(courseName) {
  // const courseId = 69362; // Replace with the desired course ID
  // let courses = await getCourses();
  // const course = courses.find((c) => c.id === courseId);
  // if (course) {
  //   const courseName = course.name;
  //   console.log(courseName);
  // } else {
  //   console.log(`Course with ID ${courseId} not found`);
  // }
  try {
    const courseId = await getCourseId("U.S. History B (AP) - Harrington, J");
    const response = await axios.get(
      `${apiUrl}/courses/${courseId}/announcements`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getCourseId(courseName) {
  try {
    console.log("course: ");
    const response = await axios.get(`${apiUrl}/courses`);
    const course = response.data.find((c) => c.name === courseName);
    console.log(course.id);
    return course.id;
  } catch (error) {
    console.error(error);
  }
}

// Example usage
async function handleClick() {
  const assignments = await getAssignments();
  console.log(assignments);
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Set the authorization header for all Axios requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []);

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    setUser(currentUser);
  }, []);

  const getCourses = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        "https://classroom.googleapis.com/v1/courses",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(response.data.courses);
      return response.data.courses;
    } catch (error) {
      console.error("Error retrieving courses", error);
      throw error;
    }
  };

  const getAccessToken = async () => {
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
      return result.accessToken;
    }
  };

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
      <Button title="Get Assignments" onPress={handleClick} />
      <Button title="Get Courses" onPress={() => getCourses()} />
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
