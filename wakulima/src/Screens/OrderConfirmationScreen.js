import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image,TouchableOpacity } from "react-native";
import firebase from "../components/firebase"; // Import Firebase
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook

const OrderConfirmationScreen = ({ route }) => {
  const { address, totalAmount, deliveryMethod } = route.params;
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation(); // Create a navigation object

  useEffect(() => {
    // Fetch user data from Firestore based on the current user's UID
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
    } else {
      console.error("User is not authenticated");
    }
  }, []);

  // Function to clear the cart
  const clearCart = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      const cartItemsRef = firebase.firestore().collection("cart");
      // Delete all cart items related to the user
      cartItemsRef
        .where("userId", "==", userId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
          // Navigate to a success screen or home screen after clearing the cart
          navigation.navigate("CustomerInterface");
        })
        .catch((error) => {
          console.error("Error clearing cart:", error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/icons8-check-mark-50.png")} // Replace with the correct path to your checkmark image
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
        </View>
        {/* Implement SMS confirmation here */}
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
    width: "80%", // Adjust the width as needed
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
});

export default OrderConfirmationScreen;
