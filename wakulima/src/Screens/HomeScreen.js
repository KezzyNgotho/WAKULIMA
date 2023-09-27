// screens/HomeScreen.js

import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to Your App</Text>
      <Button
        title="Go to Customer Interface"
        onPress={() => navigation.navigate('Customer')}
      />
      <Button
        title="Go to Salesperson Interface"
        onPress={() => navigation.navigate('Salesperson')}
      />
      <Button
        title="Go to Sales Orders Admin"
        onPress={() => navigation.navigate('SalesOrdersAdmin')}
      />
    </View>
  );
}
