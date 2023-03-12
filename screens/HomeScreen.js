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

function getStudentGrades(apiEndpoint, schoolCode, studentId) {
  // Construct the API endpoint URL with the required parameters
  const gradesEndpoint = `/api/v5/schools/600/gpas/118150163`;

  // Make the API call
  return fetch(gradesEndpoint)
    .then((response) => response.json())
    .then((data) => {
      // Return the student's grades
      console.log(data);
      return data;
    });
}

async function getAllCourses() {
  try {
    let courses = [];
    let page = 1;
    let response = await axios.get(
      `${apiUrl}/courses?per_page=100&page=${page}`
    );
    courses = courses.concat(response.data);
    while (response.data.length === 100) {
      page++;
      response = await axios.get(`${apiUrl}/courses?per_page=100&page=${page}`);
      courses = courses.concat(response.data);
    }
    console.log(
      courses
        .filter((course) => course.name !== undefined)
        .map((course) => course.name)
    );
    return courses
      .filter((course) => course.name !== undefined)
      .map((course) => course.name);
  } catch (error) {
    console.error(error);
  }
}

async function getAssignments(courseName) {
  try {
    const courseId = await getCourseId("Calculus AB-B (AP) - Chang, P");
    let assignments = [];
    let page = 1;
    let response = await axios.get(
      `${apiUrl}/courses/${courseId}/assignments?per_page=100&page=${page}`
    );
    assignments = assignments.concat(response.data);
    while (response.data.length === 100) {
      page++;
      response = await axios.get(
        `${apiUrl}/courses/${courseId}/assignments?per_page=100&page=${page}`
      );
      assignments = assignments.concat(response.data);
    }
    return assignments;
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
  let array = assignments.map(function (item) {
    return item["name"];
  });
  console.log(array);
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
      let array = response.data.courses.map(function (item) {
        return item["courseGroupEmail"];
      });
      console.log(array);
      return array;
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

  const handleCamera = async () => {
    navigation.navigate("Camera");
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
      <Button title="Get Canvas Courses" onPress={getAllCourses} />
      <Button title="Get Classroom Courses" onPress={() => getCourses()} />
      <Button title="Camera" onPress={handleCamera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdf8e8",
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
