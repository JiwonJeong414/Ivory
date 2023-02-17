import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Image
        style={styles.graphics}
        source={require("./assets/pictures/home-graphics.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9efe0",
    alignItems: "center",
    justifyContent: "center",
  },
  graphics: {
    width: "100%",
    height: "30%",
  },
});
