import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import NavBar from "./Components/NavBar";
import Home from "./Screens/Home";
import CheckIn from "./Screens/CheckIn";
import Social from "./Screens/Social";
import { createStackNavigator } from "@react-navigation/stack";
import { createStore } from "redux";
import Header from "./Components/Header";
import Loading from "./Screens/Loading";
import Login from "./Screens/Login"
import firebaseConfig from "./config"

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
      <PaperProvider>
        <NavigationContainer>
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
        </NavigationContainer>
      </PaperProvider>
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
