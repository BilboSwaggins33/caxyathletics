import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Colors, IconButton, ProgressBar } from "react-native-paper";

export default function RewardsBar() {
  const [percent, setPercent] = useState(0);

  const maxPoints = 1000;

  useEffect(() => {
    setPercent(0);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.firstPoint}></View>
      <View style={styles.barContainer}>
        <ProgressBar
          progress={percent}
          color={"#F37121"}
          style={styles.progressBar}
        />
      </View>
      <IconButton
        icon="plus"
        color="black"
        size={36}
        onPress={() => setPercent(percent + 0.05)}
        style={{ position: "absolute", alignItems: "center" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  barContainer: {
    flex: 1,
    height: 1200,
  },

  progressBar: {
    transform: [{ rotate: "90deg" }, { translateX: -8 }],
    width: 2000,
    height: 10,
    borderRadius: 5,
  },

  firstPoint: {
    backgroundColor: "#F37121",
    height: 75,
    width: 75,
    borderRadius: 50,
    marginTop: 30,
    marginBottom: 1000,
  },
});
