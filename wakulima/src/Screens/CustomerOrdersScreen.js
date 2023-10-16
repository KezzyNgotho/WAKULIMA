
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
  const user = firebase.auth().currentUser; // Get the currently logged-in user
  const userId = user ? user.uid : ""; // Replace with the logged-in user's ID

  useEffect(() => {
    if (!userId) {
      // User is not logged in, handle accordingly
      return;
    }

    // Fetch orders for the logged-in user from Firebase
    const ordersRef = firebase.firestore().collection("orders");

    ordersRef
      .where("userId", "==", userId) // Filter orders by user ID
      .orderBy("orderDate", "asc") // Order orders by date (newest first)
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
      <View style={styles.orderItem}>
        <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
        <Text style={styles.orderDate}>
          Order Date: {item.orderDate.toDate().toLocaleString()}
        </Text>
        <Text style={styles.orderStatus}>Status: {item.status}</Text>
        <Text style={styles.orderAddress}>Delivery Address: {item.deliveryAddress}</Text>
        <Text style={styles.orderAddress}>Delivery Method: {item.deliveryMethod}</Text>
        <Text style={styles.orderFees}>
          Delivery Fees: ${item.deliveryFees ? item.deliveryFees.toFixed(2) : 'N/A'}
        </Text>
        <Text style={styles.orderPaymentMethod}>
          Payment Method: {item.paymentMethod}
        </Text>
        <Text style={styles.orderTotal}>
          Total: ${item.totalAmount ? item.totalAmount.toFixed(2) : 'N/A'}
        </Text>
        {/* Render order items and their details here */}
        {item.productsOrdered.map((product, index) => (
          <View key={index} style={styles.orderItemDetails}>
            <Text style={styles.productName}>Product Name: {product.productName}</Text>
            <Text style={styles.productType}>Product Type: {product.productType}</Text>
            <Text style={styles.productItems}>Items Number: {product.ItemsNumber}</Text>
            <Text style={styles.productPrice}>Price: Ksh {product.productPrice.toFixed(2)}</Text>
            <Text style={styles.productQuantity}>Quantity: {product.productQuantity}</Text>
            {/* Add more details as needed */}
          </View>
        ))}
      </View>
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
    color: "#333", // Change the title text color
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
    color: "black",
  },
  orderDate: {
    fontSize: 14,
    color: "green",
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 16,
    color: "#007BFF",
    marginBottom: 8,
  },
  orderAddress: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color:'black'
  },
  orderFees: {
    fontSize: 16,
    marginBottom: 8,
    color:'black'
  },
  orderPaymentMethod: {
    fontSize: 16,
    marginBottom: 8,
    color:"black"
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginTop: 8,
  },
  orderItemDetails: {
    marginTop: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color:"black"
  },
  productPrice: {
    fontSize: 16,
    color:"black"
  },
  productQuantity: {
    fontSize: 16,
    color:"black"
  },
  productType: {
    fontSize: 16,
    color:"black"
  },
  productItems: {
    fontSize: 16,
    color:"black"
  },
  ordersList: {
    flex: 1,
  },
});

export default CustomerOrdersScreen;
