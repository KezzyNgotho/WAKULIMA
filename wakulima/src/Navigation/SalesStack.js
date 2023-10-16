import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import { useTheme } from "react-native-paper";
import { Image } from "react-native";

import OrdersScreen from "../Screens/OrderScreen";
import SalesOrdersAdminScreen from "../Screens/SalesOrdersAdminScreen";
import SalesFeedScreen from "../Screens/SalesFeedScreen";
import {  SalesStackNavigator, ContactStackNavigator, } from "./StackNavigator";
import LogoutScreen from "../Screens/LogOutScreen";
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
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color }) => (
            <Image
            source={require('../assets/icons8-logistics-32.png')}  
              style={{  width: 37, height: 30 }}
            />
          ),
        }}
        name="Orders" component={OrdersScreen} />
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
        name="LogOut" component={LogoutScreen} />
     
    </Tab.Navigator>
  );
};



 
export default SalesBottomTabNavigator;
