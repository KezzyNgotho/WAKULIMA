import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { RadioButton } from "react-native-paper";
import firebase from "../components/firebase";

const PaymentSelectionScreen = ({ route, navigation }) => {
 /*  const { totalAmount, deliveryFees, address, deliveryMethod } = route.params; */
/* 
  const [paymentMethod, setPaymentMethod] = useState("creditCard"); */
  const { totalAmount, deliveryFees, address, deliveryMethod } = route.params;

  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  const confirmOrder = async () => {
    // Save the order details to Firestore with a "pending" status
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      const orderRef = firebase.firestore().collection("orders").doc();
      await orderRef.set({
        userId,
        totalAmount,
        deliveryFees,
        address,
        deliveryMethod,
        paymentMethod,
        status: "pending", // Set the status to "pending"
      });
  
      navigation.navigate("OrderConfirmation", {
        address,
        totalAmount,
        deliveryMethod,
      });
    } else {
      console.error("User is not authenticated");
    }
  };
  
  /* const confirmOrder = () => {
    // Implement logic to confirm the order and send an SMS
    navigation.navigate("OrderConfirmation", {
      address: "123 Main St", // Replace with the actual address
      totalAmount: 50.0, // Replace with the actual total amount
      deliveryMethod: "Door Delivery", // Replace with the actual delivery method
    });
  }; */

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Selection</Text>
      <Text style={styles.orderSummary}>
        Total: ${totalAmount.toFixed(2)} (Delivery Fees: ${deliveryFees.toFixed(2)})
      </Text>

      {/* Delivery Information */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Delivery Address:</Text>
          <Text style={styles.infoText}>{address}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Delivery Method:</Text>
          <Text style={styles.infoText}>{deliveryMethod}</Text>
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.paymentMethod}>
        <Text style={styles.label}>Select Payment Method:</Text>
        <View style={styles.radioButtons}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setPaymentMethod("creditCard")}
          >
            <Image
              source={paymentMethod === "creditCard" ? require('../assets/icons8-check-mark-50.png') : require('../assets/icons8-visa-94.png')}
              style={styles.paymentIcon}
            />
            <Text style={styles.radioLabel}>Credit Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setPaymentMethod("paypal")}
          >
            <Image
              source={paymentMethod === "paypal" ? require('../assets/icons8-tick-tick-48.png') : require('../assets/icons8-paypal-100.png')}
              style={styles.paymentIcon}
            />
            <Text style={styles.radioLabel}>PayPal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={confirmOrder}>
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  orderSummary: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
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
  paymentMethod: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  radioButtons: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PaymentSelectionScreen;
