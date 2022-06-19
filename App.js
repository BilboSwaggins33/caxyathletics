import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import NavBar from "./Components/NavBar";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./Components/Header";
import Loading from "./Screens/Loading";
import Login from "./Screens/Login";
import Admin from "./Screens/Admin";
import { firebaseConfig } from "./config";
import { initializeApp } from "@firebase/app";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { ActivityIndicator } from "react-native-paper";
import { setUser } from "./redux/actions";
import { useDispatch, useSelector } from "react-redux";

export default function App() {
  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        dispatch(setUser(u));
      } else {
        dispatch(setUser(undefined));
        //navigation.navigate("Login");
      }
      setIsLoading(false);
    });
  }, []);

  console.log(user);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoading ? (
          <Stack.Screen
            name="Loading"
            component={Loading}
            options={{ headerShown: false }}
          />
        ) : !user ? (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        ) : // change dye email for mine for testing
        user.email.includes("myke.chen@students.lfanet.org") ? (
          <Stack.Screen name="Admin" component={Admin} options={{}} />
        ) : (
          <Stack.Screen
            name="Main"
            component={NavBar}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* <NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen
      name="Loading"
      component={Loading}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Main"
      component={NavBar}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
</NavigationContainer> */

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
