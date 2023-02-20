import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const apiUrl = "https://iusd.instructure.com/api/v1";
const token =
  "3007~pk06pga4ouulN1dGIjmnFdCwfo9DpAJNxTTqlAFpMCKpzHYZALQNobl512KgOQhB";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

async function getAssignments() {
  try {
    const courseId = await getCourseId("Calculus AB-B (AP) - Chang, P");
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
    console.log(course);
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
    const currentUser = firebase.auth().currentUser;
    setUser(currentUser);
  }, []);

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
