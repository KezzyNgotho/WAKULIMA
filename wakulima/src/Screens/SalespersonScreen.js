import React from 'react';
import { View, Text, Button } from 'react-native';

export default function SalespersonScreen({ navigation }) {
  const handleOrderButtonClick = () => {
    // Implement logic to handle placing orders on behalf of customers
    // For example, you can navigate to a screen where a salesperson can select products and customers
    navigation.navigate('CreateOrder');
  };

  const handleReportsButtonClick = () => {
    // Implement logic to view salesperson-specific reports
    // Navigate to a screen displaying sales reports
    navigation.navigate('SalesReports');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Salesperson Interface</Text>
      <Button title="Place Order" onPress={handleOrderButtonClick} />
      <Button title="View Reports" onPress={handleReportsButtonClick} />
      {/* Add more UI and functionality specific to salespersons */}
    </View>
  );
}
