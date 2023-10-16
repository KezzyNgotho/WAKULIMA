import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import firebase from '../components/firebase';

const OrdersScreen = ({userRoutes}) => {
  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Pending'); // Default tab is 'Pending'
  

 
  useEffect(() => {
    const user = firebase.auth().currentUser; // Get the current user

    if (!user) {
      // Handle the case when the user is not logged in
      return;
    }

    const unsubscribe = firestore()
      .collection('orders')
      .where('status', '==', selectedTab)
      .onSnapshot((snapshot) => {
        const ordersData = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const orderLocation = data.location; // Replace with the actual field name in your Firestore orders collection
          
          // Check if the order's location is within the user's routes
          if (userRoutes.includes(orderLocation)) {
            ordersData.push({ ...data, id: doc.id });
          }
        });
        setOrders(ordersData);
      });

    return () => unsubscribe();
  }, [selectedTab, userRoutes]);


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

  const confirmArrival = async (order) => {
    try {
      // Confirm the arrival of the order by updating its status to "Arrived" in Firestore
      await firestore().collection('orders').doc(order.id).update({ status: 'Arrived' });

      // Send a notification to the user (customer) using FCM
      // You'll need to implement this part to send notifications.

      // Remove the order from the local state
      const updatedOrders = orders.filter((o) => o.id !== order.id);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error confirming order arrival:', error);
      Alert.alert('Error', 'An error occurred while confirming the order arrival. Please try again later.');
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>{`Order ID: ${item.id}`}</Text>
      <Text style={styles.orderText}>{`Product: ${item.productName}`}</Text>
      <Text style={styles.orderText}>{`Quantity: ${item.quantity}`}</Text>
      {selectedTab === 'Pending' && (
        <TouchableOpacity onPress={() => dispatchOrder(item)} style={styles.dispatchButton}>
          <Text style={styles.buttonText}>Dispatch</Text>
        </TouchableOpacity>
      )}
      {selectedTab === 'Dispatched' && (
        <TouchableOpacity onPress={() => confirmArrival(item)} style={styles.arrivalButton}>
          <Text style={styles.buttonText}>Confirm Arrival</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const keyExtractor = (item) => item.id;

  return (
    <View style={styles.container}>
      <View style={styles.tabButtons}>
        <TouchableOpacity onPress={() => setSelectedTab('Pending')} style={styles.tabButton}>
          <Text style={[styles.tabText, selectedTab === 'Pending' && styles.selectedTab]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('Dispatched')} style={styles.tabButton}>
          <Text style={[styles.tabText, selectedTab === 'Dispatched' && styles.selectedTab]}>Dispatched</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Orders - {selectedTab}</Text>
      <FlatList
        data={orders}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => renderOrderItem({ item })}
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
    alignSelf: 'center',
    color: 'black',
  },
  listContent: {
    paddingBottom: 16,
  },
  tabButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  tabText: {
    fontSize: 16,
  },
  selectedTab: {
    backgroundColor: 'orange',
    color: 'white',
  },
  orderItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 5,
    elevation: 2,
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
  arrivalButton: {
    backgroundColor: 'green',
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
