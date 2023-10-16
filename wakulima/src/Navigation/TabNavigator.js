import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import { useTheme } from "react-native-paper";
import { Image } from "react-native";


import CustomerInterface from "../Screens/CustomerInterface";

import { MainStackNavigator, ContactStackNavigator, } from "./StackNavigator";

import PaymentMode from "../Screens/PaymentMode";
import AvailableProducts from '../Screens/AvailableProducts'
import CustomerOrdersScreen from "../Screens/CustomerOrdersScreen";
import FeedScreen from "../Screens/FeedsScreen";
import CustomerProfileScreen from "../Screens/CustomerProfileScreen";

const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      activeColor={'black'} 
       inactiveColor={colors.onBackground} 
      barStyle={{ backgroundColor: colors.background }} // Use background color from theme
      initialRouteName='CustomerInterface'
    >
      <Tab.Screen
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
                source={require('../assets/icons8-home-24.png')} 
              style={{ width: 37, height: 30 }}
            />
          ),
        }}
        name="CustomerInterface" component={MainStackNavigator} />
      <Tab.Screen
        options={{
          tabBarLabel: 'orders',
          tabBarIcon: ({ color }) => (
            <Image
            source={require('../assets/icons8-logistics-32.png')}  
              style={{  width: 37, height: 30 }}
            />
          ),
        }}
        name="Orders" component={CustomerOrdersScreen} />
      <Tab.Screen
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Image
               source={require('../assets/icons8-male-user-24.png')}  
              style={{  width: 37, height: 30 }}
            />
          ),
        }}
        name="Profile" component={CustomerProfileScreen} />
     
    </Tab.Navigator>
  );
};



 
export default BottomTabNavigator;
