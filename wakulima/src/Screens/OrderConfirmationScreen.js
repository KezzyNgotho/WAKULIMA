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

  const clearCart = () => {
    const user = firebase.auth().currentUser;

    if (user) {
      const userId = user.uid;
      const batch = firebase.firestore().batch();
      const cartItemsRef = firebase.firestore().collection("cart");
      const ordersRef = firebase.firestore().collection("orders");

      const productsOrdered = [];

      cartItems.forEach((item) => {
        // Check if item has required properties and they are valid
        if (item.id && item.name && item.type && item.items && item.pricePerUnit !== undefined && item.quantity !== undefined) {
          const productOrdered = {
            productId: item.id,
            productName: item.name,
            productType: item.type, // Corrected the typo here
            ItemsNumber: item.items, // Corrected the typo here
            productQuantity: item.quantity,
            productPrice: item.pricePerUnit,
          };

          productsOrdered.push(productOrdered);

          const cartItemRef = cartItemsRef.doc(item.id);
          batch.delete(cartItemRef);
        } else {
          console.error("Invalid cart item:", item);
        }
      });

      if (userId && address && deliveryMethod && productsOrdered.length > 0) {
        const order = {
          userId,
          deliveryAddress: address,
          deliveryMethod,
          location: userData && userData.location,
          orderDate: firebase.firestore.FieldValue.serverTimestamp(),
          productsOrdered: productsOrdered,
        };

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
        console.error("Some order details are missing or invalid");
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
          <InfoItem label="Delivery Address" text={address} />
          <InfoItem label="Total Amount" text={`Ksh ${totalAmount.toFixed(2)}`} />
          <InfoItem label="Delivery Method" text={deliveryMethod} />
          {userData && <InfoItem label="Name" text={userData.name} />}
          {userData && <InfoItem label="Phone Number" text={userData.mobileNumber} />}
          {userData && <InfoItem label="Location" text={userData.location} />}
          <Text style={styles.productsLabel}>Products Ordered:</Text>
          {cartItems.map((item, index) => (
            <ProductItem key={index} name={item.name} price={item.pricePerUnit} type={item.type} ItemsNumber={item.items} />
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.orderButton} onPress={clearCart}>
        <Text style={styles.orderButtonText}>Complete Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const InfoItem = ({ label, text }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const ProductItem = ({ name, price,type ,ItemsNumber }) => (
  <View style={styles.productItem}>
    <Text style={styles.productName}>{name}</Text>
    <Text style={styles.productPrice}>Price: Ksh {price.toFixed(2)}</Text>
    <Text style={styles.productName}>{type}</Text>
    <Text style={styles.productName}>{ItemsNumber}</Text>
  </View>
);


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
