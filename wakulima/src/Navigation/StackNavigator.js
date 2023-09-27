import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import AvailableProducts from '../Screens/AvailableProducts';
import LoginScreen from '../Screens/LoginScreen';
import RegistrationScreen from '../Screens/RegistrationScreen';
import CustomerInterface from '../Screens/CustomerInterface';
import PaymentMode from '../Screens/PaymentMode';
import CartScreen from '../Screens/Cart';
import ProductDetails from '../Screens/ProductDetails';
import DeliverySelectionScreen from '../Screens/DeliverySelectionScreen';
import PaymentSelectionScreen from '../Screens/PaymentSelectionScreen';
import OrderConfirmationScreen from '../Screens/OrderConfirmationScreen';
import SalesOrdersAdminScreen from '../Screens/SalesOrdersAdminScreen';
import SalespersonScreen from '../Screens/SalespersonScreen';
import BottomTabNavigator from './TabNavigator';
import AdminBottomTabNavigator from './AdminStacKNavigator'; 
import { AuthProvider, useAuth } from '../components/AuthContext';// Changed this import
import OrderReceptionScreen from '../Screens/OrderReceptionScreen';
import SalesBottomTabNavigator from './SalesStack';
import SalespersonInterface from '../Screens/SalespersonInterface';
import RegistrationSuccessScreen from '../Screens/RegistrationSuccessScreen';
import NotificationsScreen from '../Screens/NotificationsScreen';
const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  const { colors } = useTheme();

  const screenOptionStyle = {
    headerStyle: {},
    headerShown: false,
    headerTintColor: colors.primary,
    headerBackTitle: 'Back',
  };

  return (
    <Stack.Navigator
      screenOptions={screenOptionStyle}
      initialRouteName="CustomerInterface" // Fixed the initialRouteName
    >
      <Stack.Screen name="CustomerInterface" component={CustomerInterface} />
      <Stack.Screen
        options={{ headerShown: false }}
        name="AvailableProducts"
        component={AvailableProducts}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Payment"
        component={PaymentMode}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Cart"
        component={CartScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ProductDetails"
        component={ProductDetails}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SelectDeliveryScreen"
        component={DeliverySelectionScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="PaymentSelection"
        component={PaymentSelectionScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
      />
       <Stack.Screen
        options={{ headerShown: false }}
        name="Notifications"
        component={NotificationsScreen}
      />
    </Stack.Navigator>
  );
};

const SalesStackNavigator = () => {
  const { colors } = useTheme();

  const screenOptionStyle = {
    headerStyle: {},
    headerShown: false,
    headerTintColor: colors.primary,
  };

  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="SalespersonInterface" component={SalespersonInterface} />
    </Stack.Navigator>
  );
};

const AdminStackNavigator = () => {
  const { colors } = useTheme();

  const screenOptionStyle = {
    headerStyle: {},
    headerShown: false,
    headerTintColor: colors.primary,
  };

  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="SalesOrdersAdminScreen"
        component={SalesOrdersAdminScreen}
      />
       <Stack.Screen
        name="OrdersReception"
        component={OrderReceptionScreen}
      />
    </Stack.Navigator>
  );
};

const LoginStackNavigator = () => {
  const { colors } = useTheme();

  const screenOptionStyle = {
    headerStyle: {},
    headerShown: false,
    headerTintColor: colors.primary,
  };

  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccessScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name='AdminStack' component={AdminBottomTabNavigator}/>
      <Stack.Screen name='SalesStack' component={SalesBottomTabNavigator}/>
    </Stack.Navigator>
  );
}

export {
  MainStackNavigator,
  SalesStackNavigator,
  AdminStackNavigator,
  LoginStackNavigator,
};
