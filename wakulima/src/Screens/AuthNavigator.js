import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../Screens/LoginScreen"; // Import your login screen
import RegistrationScreen from "../Screens/RegistrationScreen"; // Import your registration screen

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      {/* Add more authentication-related screens as needed */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
