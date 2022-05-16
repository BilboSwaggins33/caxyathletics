import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import NavBar from "./Components/NavBar";
import Home from "./Screens/Home";
import CheckIn from "./Screens/CheckIn";
import Social from "./Screens/Social";
import { createStackNavigator } from "@react-navigation/stack";
import { createStore } from "redux";
import Header from "./Components/Header";
import { firebaseConfig } from "./config";
import Authentication from "./Screens/Authentication";

const initialState = {
  user: null,
};
const reducer = (state = initialState, action) => {
  if (action.type == "SET_USER") {
    return { user: action.info };
  }
  return state;
};
const store = createStore(reducer);
// Need to add loading and sign in screen

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Authentication"
            component={Authentication}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={NavBar}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
