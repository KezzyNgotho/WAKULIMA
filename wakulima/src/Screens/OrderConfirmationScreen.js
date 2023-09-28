import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import firebase from "../components/firebase";
import { useNavigation } from "@react-navigation/native";

const OrderConfirmationScreen = ({ route }) => {
  const { address, totalAmount, deliveryMethod } = route.params;
  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      const userId = user.uid;
      const userRef = firebase.firestore().collection("other_details").doc(userId);

      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
          } else {
            console.error("User data not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

      const cartItemsRef = firebase.firestore().collection("cart");
      cartItemsRef
        .where("userId", "==", userId)
        .get()
        .then((querySnapshot) => {
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
          });
          setCartItems(items);
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
        });
    } else {
      console.error("User is not authenticated");
    }
  }, []);

 // ... Previous code ...

const clearCart = () => {
  const user = firebase.auth().currentUser;

  if (user) {
    const userId = user.uid;
    const batch = firebase.firestore().batch();
    const cartItemsRef = firebase.firestore().collection("cart");
    const ordersRef = firebase.firestore().collection("orders");

    const productsOrdered = []; // Array to store products in the order

    cartItems.forEach((item) => {
      // Check for any undefined or missing properties
      if (item.id && item.name && item.price && item.quantity) {
        // Create a product object for this item
        const productOrdered = {
          productId: item.id, // Use 'id' instead of 'productId' if that's the correct field name
          productName: item.name,
          productPrice: item.price,
          productQuantity: item.quantity,
        };

        // Add the product to the productsOrdered array
        productsOrdered.push(productOrdered);

        // Delete the cart item
        const cartItemRef = cartItemsRef.doc(item.id);
        batch.delete(cartItemRef);
      } else {
        console.error("Cart item details are missing or undefined:", item);
      }
    });

    // Check if all order details are defined
    if (userId && address && deliveryMethod && productsOrdered.length > 0) {
      // Create an order document
      const order = {
        userId,
        deliveryAddress: address,
        deliveryMethod,
        orderDate: firebase.firestore.FieldValue.serverTimestamp(),
        productsOrdered: productsOrdered, // Add the productsOrdered array
      };

      // Add the order to the "orders" collection
      batch.set(ordersRef.doc(), order);

      batch
        .commit()
        .then(() => {
          console.log("Order recorded, cart cleared, and stock updated");
          navigation.navigate("CustomerInterface");
        })
        .catch((error) => {
          console.error("Error committing batch:", error);
        });
    } else {
      console.error("Some order details are missing or undefined");
    }
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/icons8-check-mark-50.png")}
            style={styles.checkmarkImage}
          />
          <Text style={styles.header}>Order Confirmed</Text>
        </View>
        <Text style={styles.confirmationText}>
          Your order has been confirmed and dispatched.
        </Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Delivery Address</Text>
            <Text style={styles.infoText}>{address}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Total Amount</Text>
            <Text style={styles.infoText}>${totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Delivery Method</Text>
            <Text style={styles.infoText}>{deliveryMethod}</Text>
          </View>
          {userData && (
            <View style={styles.infoItem}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.infoText}>{userData.name}</Text>
            </View>
          )}
          {userData && (
            <View style={styles.infoItem}>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.infoText}>{userData.mobileNumber}</Text>
            </View>
          )}
          {userData && (
            <View style={styles.infoItem}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.infoText}>{userData.location}</Text>
            </View>
          )}
          <Text style={styles.productsLabel}>Products Ordered:</Text>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.productItem}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>Price: ${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.orderButton} onPress={clearCart}>
        <Text style={styles.orderButtonText}>Complete Order</Text>
      </TouchableOpacity>
    </View>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  card: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "80%",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  checkmarkImage: {
    width: 80,
    height: 80,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    color: "#4CAF50",
  },
  confirmationText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#333333",
  },
  infoContainer: {
    marginTop: 10,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  infoText: {
    fontSize: 16,
    color: "#777777",
  },
  orderButton: {
    marginTop: 16,
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  productsLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 20,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    color: "#333333",
  },
  productPrice: {
    fontSize: 16,
    color: "#777777",
  },
});

export default OrderConfirmationScreen;
