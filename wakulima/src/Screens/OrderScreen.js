import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('orders')
      .onSnapshot((snapshot) => {
        const ordersData = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          ordersData.push({ ...data, id: doc.id });
        });
        setOrders(ordersData);
      });

    return () => unsubscribe();
  }, []);

  const dispatchOrder = async (order) => {
    try {
      // Dispatch the order by updating its status to "Dispatched" in Firestore
      await firestore().collection('orders').doc(order.id).update({ status: 'Dispatched' });

      // Send a notification to the user (customer) using FCM
      // You'll need to implement this part to send notifications.
      
      // Remove the order from the local state
      const updatedOrders = orders.filter((o) => o.id !== order.id);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error dispatching order:', error);
      Alert.alert('Error', 'An error occurred while dispatching the order. Please try again later.');
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>{`Order ID: ${item.id}`}</Text>
      <Text style={styles.orderText}>{`Product: ${item.productName}`}</Text>
      <Text style={styles.orderText}>{`Quantity: ${item.quantity}`}</Text>
      <TouchableOpacity onPress={() => dispatchOrder(item)} style={styles.dispatchButton}>
        <Text style={styles.buttonText}>Dispatch</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderRow = ({ index }) => {
    if (index % 2 === 0) {
      const rowData = [orders[index]];
      if (index + 1 < orders.length) {
        rowData.push(orders[index + 1]);
      }
      return (
        <View style={styles.orderRow}>
          {rowData.map((item) => (
            <View key={item.id} style={styles.orderContainer}>
              {renderOrderItem({ item })}
            </View>
          ))}
        </View>
      );
    }
    return null;
  };

  const keyExtractor = (item) => item.id;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={keyExtractor}
        renderItem={({ index }) => renderOrderRow({ index })}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf:'center',
    color:'black',
  },
  listContent: {
    paddingBottom: 16,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderContainer: {
    flex: 1,
  },
  orderItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 5,
    elevation: 2,
    marginHorizontal:10,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 8,
  },
  dispatchButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default OrdersScreen;
