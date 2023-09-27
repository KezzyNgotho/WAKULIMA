import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import firebase from "../components/firebase"; // Import your Firebase configuration

const CustomerOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const userId = "your_user_id"; // Replace with the logged-in user's ID

  useEffect(() => {
    // Fetch orders for the logged-in user from Firebase
    const ordersRef = firebase.firestore().collection("orders");

    ordersRef
      .where("userId", "==", userId) // Filter orders by user ID
      .orderBy("orderDate", "desc") // Order orders by date (newest first)
      .get()
      .then((querySnapshot) => {
        const ordersData = [];
        querySnapshot.forEach((doc) => {
          const order = doc.data();
          ordersData.push(order);
        });
        setOrders(ordersData);
      })
      .catch((error) => {
        console.error("Error fetching orders: ", error);
      });
  }, [userId]);

  // Render a single order item
  const renderOrderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.orderItem}>
        <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
        <Text style={styles.orderDate}>
          Order Date: {item.orderDate.toDate().toLocaleString()}
        </Text>
        <Text style={styles.orderStatus}>Status: {item.status}</Text>
        <Text style={styles.orderTotal}>Total: ${item.totalAmount.toFixed(2)}</Text>
        {/* Render order items and their details here */}
        <FlatList
          data={item.items}
          renderItem={({ item: orderItem }) => (
            <View style={styles.orderItemDetails}>
              <Text>{orderItem.name}</Text>
              <Text>Price: ${orderItem.price.toFixed(2)}</Text>
              {/* Add more details as needed */}
            </View>
          )}
          keyExtractor={(orderItem) => orderItem.id}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        style={styles.ordersList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  orderItem: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 14,
    color: "#007BFF",
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  orderItemDetails: {
    marginTop: 8,
  },
  ordersList: {
    flex: 1,
  },
});

export default CustomerOrdersScreen;
