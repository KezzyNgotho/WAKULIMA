import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { RadioButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import firebase from "../components/firebase"; // Import Firebase

const DeliverySelectionScreen = ({ route, navigation }) => {
  // Constants and State
  const { deliveryFees = 0 } = route.params || {};
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [pickupStation, setPickupStation] = useState("");

  const [editedName, setEditedName] = useState("");
  const [editedMobileNumber, setEditedMobileNumber] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [isUserInformationDirty, setIsUserInformationDirty] = useState(false);

  // Fetch the authenticated user
// Fetch the authenticated user
const user = firebase.auth().currentUser; // Get the current user object

// Fetch user data from Firebase
const fetchUserData = async (userId) => {
  try {
    if (user) {
      // User is authenticated, and user is not null
      const userId = user.uid; // Access the UID
      const userRef = firebase.firestore().collection("users").doc(userId);
      const userData = await userRef.get();
      if (userData.exists) {
        const data = userData.data();
        setEditedName(data.name || "");
        setEditedMobileNumber(data.mobileNumber || "");
        setEditedLocation(data.location || "");
        setAddress(data.address || "");
      } else {
        console.log("User data not found in Firebase.");
      }
    } else {
      // Handle the case where user is not authenticated
      console.error("User is not authenticated");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};





  // Fetch cart data
  const fetchCartData = () => {
    try {
      const cartCollectionRef = firebase.firestore().collection("cart");

      cartCollectionRef.get().then((querySnapshot) => {
        const fetchedCartData = [];

        querySnapshot.forEach((doc) => {
          const cartItem = doc.data();
          fetchedCartData.push(cartItem);
        });

        setCart(fetchedCartData);
      });
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const calculateTotal = () => {
    const cartTotal = calculateCartTotal(cart);
    const deliveryFee = deliveryMethod === "door" ? 500 : 300; // Adjust delivery fees
    return cartTotal + deliveryFee;
  };

  const calculateCartTotal = (cartItems) => {
    if (!cartItems || !Array.isArray(cartItems)) {
      return 0;
    }
    return cartItems.reduce((total, item) => total + parseFloat(item.price || 0), 0);
  };

  const proceedToPayment = () => {
    if (
      !editedName ||
      !editedMobileNumber ||
      !editedLocation ||
      !address ||
      !deliveryMethod ||
      (deliveryMethod === "pickup" && !pickupStation)
    ) {
      Alert.alert("Incomplete Information", "Please fill in all required details.");
      return;
    }

    saveUserData(user.uid);

    navigation.navigate("PaymentSelection", {
      totalAmount: calculateTotal(),
      deliveryFees: deliveryMethod === "door" ? 500 : 300, // Adjust delivery fees
      name: editedName,
      mobileNumber: editedMobileNumber,
      location: editedLocation,
      address,
      deliveryMethod,
      pickupStation,
    });
  };

  // Save user data to Firebase
 // Save user data to Firebase
 const saveUserData = async () => {
  try {
    const user = firebase.auth().currentUser; // Get the current user
    if (user) {
      const userId = user.uid; // Access the UID of the current user
      const userRef = firebase.firestore().collection("other_details").doc(userId);
      await userRef.set({
        name: editedName,
        mobileNumber: editedMobileNumber,
        location: editedLocation,
        address,
      });
      console.log("User data updated successfully in 'other_users' collection!");
      setIsUserInformationDirty(false);
    } else {
      console.error("User is not authenticated");
    }
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};


  

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Delivery Selection</Text>

      {/* Order Summary */}
      <Text style={styles.orderSummary}>
        Total: ${calculateTotal().toFixed(2)} (Delivery Fees: ${deliveryMethod === "door" ? 500 : 300})
      </Text>

      {/* User Information */}
      <View style={styles.userInfoSection}>
        <Text style={styles.label1}>User Information:</Text>
        {/* Name */}
        <View style={styles.userInfoItem}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.userInfoText}
            value={editedName}
            onChangeText={(text) => setEditedName(text)}
            placeholder="Enter Name"
          />
        </View>

        {/* Mobile Number */}
        <View style={styles.userInfoItem}>
          <Text style={styles.label}>Mobile Number:</Text>
          <TextInput
            style={styles.userInfoText}
            value={editedMobileNumber}
            onChangeText={(text) => {
              setEditedMobileNumber(text);
              setIsUserInformationDirty(true);
            }}
            placeholder="Enter Mobile number"
          />
        </View>

        {/* Location */}
        <View style={styles.userInfoItem}>
          <Text style={styles.label}>Location:</Text>
          <TextInput
            style={styles.userInfoText}
            value={editedLocation}
            onChangeText={(text) => {
              setEditedLocation(text);
              setIsUserInformationDirty(true);
            }}
            placeholder="Enter Location"
          />
        </View>

        {/* Delivery Address */}
        <View style={styles.userInfoItem}>
          <Text style={styles.label}>Delivery Address:</Text>
          <TextInput
            style={styles.userInfoText}
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              setIsUserInformationDirty(true);
            }}
            placeholder="Enter Delivery Address"
          />
        </View>

        {/* Save Button */}
        {isUserInformationDirty && (
          <TouchableOpacity style={styles.saveButton} onPress={saveUserData}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label1}>Delivery Method:</Text>

        {/* Radio Buttons for Delivery Method */}
        <RadioButton.Group
          onValueChange={(value) => setDeliveryMethod(value)}
          value={deliveryMethod}
        >
          <View style={styles.radioItem}>
            <RadioButton.Item
              label="Pickup Station"
              value="pickup"
              color="#007BFF"
              uncheckedColor="#007BFF"
            />
          </View>
          <View style={styles.radioItem}>
            <RadioButton.Item
              label="Door Delivery"
              value="door"
              color="#007BFF"
              uncheckedColor="#007BFF"
            />
          </View>
        </RadioButton.Group>

        {deliveryMethod === "pickup" && (
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Select Pickup Station:</Text>
            <Picker
              selectedValue={pickupStation}
              onValueChange={(itemValue) => setPickupStation(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Station 1" value="station1" />
              <Picker.Item label="Station 2" value="station2" />
            </Picker>
          </View>
        )}

        <TouchableOpacity style={styles.proceedButton} onPress={proceedToPayment}>
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
    color:'black'
  },
  orderSummary: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
    color:'black'
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 3,
    elevation: 1,
    marginTop: 16,
  },
  label1: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "orange",
  },
  radioItem: {
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "purple",
  },
  picker: {
    height: 40,
    fontSize: 16,
    color:'black'
  },
  addressInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  proceedButton: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userInfoSection: {
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 3,
    elevation: 1,
  },
  userInfoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userInfoText: {
    flex: 3,
    fontSize: 16,
    color:'black'
  },
});

export default DeliverySelectionScreen;
