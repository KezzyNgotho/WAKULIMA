import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import { useTheme } from "react-native-paper";
import { Image } from "react-native";


import SalesOrdersAdminScreen from "../Screens/SalesOrdersAdminScreen";

import {  SalesStackNavigator, ContactStackNavigator, } from "./StackNavigator";

import PaymentMode from "../Screens/PaymentMode";
import AvailableProducts from '../Screens/AvailableProducts'

const Tab = createMaterialBottomTabNavigator();

const SalesBottomTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      activeColor={'black'} 
       inactiveColor={colors.onBackground} 
      barStyle={{ backgroundColor: colors.background }} // Use background color from theme
      initialRouteName='SalespersonInterface'
    >
      <Tab.Screen
        options={{
          tabBarLabel: 'Sales',
          tabBarIcon: ({ color }) => (
            <Image
                source={require('../assets/icons8-home-24.png')} 
              style={{ width: 37, height: 30 }}
            />
          ),
        }}
        name="SalespersonInterface" component={SalesStackNavigator} />
      <Tab.Screen
        options={{
          tabBarLabel: 'Payment',
          tabBarIcon: ({ color }) => (
            <Image
            source={require('../assets/icons8-feed-50.png')}  
              style={{  width: 37, height: 30 }}
            />
          ),
        }}
        name="Bills" component={PaymentMode} />
      <Tab.Screen
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => (
            <Image
               source={require('../assets/icons8-test-account-40.png')}  
              style={{  width: 37, height: 30 }}
            />
          ),
        }}
        name="Money" component={AvailableProducts} />
     
    </Tab.Navigator>
  );
};



 
export default SalesBottomTabNavigator;
