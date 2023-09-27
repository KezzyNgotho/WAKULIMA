// App.js or your entry point file

import React from 'react';
import { AuthProvider } from './src/components/AuthContext'; // Import your AuthProvider
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MainStackNavigator, AdminStackNavigator } from '../wakulima/src/Navigation/StackNavigator';
import firebase from './src/components/firebase';
import BottomTabNavigator from './src/Navigation/TabNavigator';
import AdminBottomTabNavigator from './src/Navigation/AdminStacKNavigator';
import { LoginStackNavigator } from '../wakulima/src/Navigation/StackNavigator';

const Tab = createMaterialBottomTabNavigator();

const Lighttheme = {
  // ... (theme configuration)
};

const Darktheme = {
  // ... (theme configuration)
};

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  return (
    <AuthProvider> 
      <PaperProvider theme={isDarkTheme ? Darktheme : Lighttheme}>
        <NavigationContainer>

       <LoginStackNavigator/>

        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;
