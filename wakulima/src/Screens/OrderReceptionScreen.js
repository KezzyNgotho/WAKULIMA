import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

const OrderReceptionScreen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch incoming orders from your database
    // Update the 'orders' state with fetched data
  }, []);

  const handleOrderReceived = (orderId) => {
    // Implement logic to mark the order as received in the database
  };

  return (
    <View>
      <Text>Order Reception Screen</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>Order ID: {item.id}</Text>
            <Text>Customer Name: {item.customerName}</Text>
            {/* Display other order details */}
            <Button title="Received" onPress={() => handleOrderReceived(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default OrderReceptionScreen;
