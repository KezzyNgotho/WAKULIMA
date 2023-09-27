import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import { useTheme } from "react-native-paper";
import { Image } from "react-native";


import SalesOrdersAdminScreen from "../Screens/SalesOrdersAdminScreen";

import {  AdminStackNavigator , ContactStackNavigator, } from "./StackNavigator";
import AdminProductManagement from "../Screens/AdminProductManagement";
import PaymentMode from "../Screens/PaymentMode";
import AvailableProducts from '../Screens/AvailableProducts'
import StaffScreen from "../Screens/StaffScreen";
const Tab = createMaterialBottomTabNavigator();

const AdminBottomTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      activeColor={'black'} 
       inactiveColor={colors.onBackground} 
      barStyle={{ backgroundColor: colors.background }} // Use background color from theme
      initialRouteName='SalesOrdersAdminScreen'
    >
      <Tab.Screen
        options={{
          tabBarLabel: 'Admin',
          tabBarIcon: ({ color }) => (
            <Image
                source={require('../assets/icons8-home-24.png')} 
              style={{ width: 37, height: 30 }}
            />
          ),
        }}
        name="SalesOrderSAdminScreen" component={AdminStackNavigator} />
      <Tab.Screen
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => (
            <Image
            source={require('../assets/icons8-feed-50.png')}  
              style={{  width: 37, height: 30 }}
            />
          ),
        }}
        name="Products" component={AdminProductManagement} />
      <Tab.Screen
        options={{
          tabBarLabel: 'Staff',
          tabBarIcon: ({ color }) => (
            <Image
               source={require('../assets/icons8-home-office-50.png')}  
              style={{  width: 37, height: 30 }}
            />
          ),
        }}
        name="Staff" component={StaffScreen} />
     
    </Tab.Navigator>
  );
};



 
export default AdminBottomTabNavigator;
