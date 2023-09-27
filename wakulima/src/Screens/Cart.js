import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../components/firebase";

const CartScreen = ({ route }) => {
  const { cart } = route.params || { cart: [] };
  const [cartItems, setCartItems] = useState(cart);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch cart items from Firestore based on the user's ID
    const fetchCartItems = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const cartItemsRef = firebase.firestore().collection("cart");

        // Query the cart items collection for items related to the user
        const snapshot = await cartItemsRef.where("userId", "==", userId).get();

        const cartItemList = [];
        snapshot.forEach((doc) => {
          cartItemList.push({ id: doc.id, ...doc.data() });
        });

        setCartItems(cartItemList);
      } else {
        // Handle the case where the user is not authenticated
      }
    };

    // Call the fetchCartItems function when the component mounts
    fetchCartItems();
  }, []);



  const reduceQuantity = (productId) => {
    // Reduce the quantity of a product in the cart
    const updatedCart = cartItems.map((item) => {
      if (item.id === productId) {
        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const increaseQuantity = (productId) => {
    // Increase the quantity of a product in the cart
    const updatedCart = cartItems.map((item) => {
      if (item.id === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const contactSeller = (_ProductId) => {
    // Implement your logic to contact the seller here
    // This can include sending a message, making a call, or opening a contact screen
    // You can use navigation to navigate to a contact screen or any other contact method
  };

  const orderAndPay = () => {
    // Navigate to the screen for selecting delivery
    navigation.navigate("SelectDeliveryScreen", { cartItems });
  };
  const removeFromCart = (productId) => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      const cartItemsRef = firebase.firestore().collection("cart");
      
      // Find the document in Firestore with the matching user and product ID
      cartItemsRef
        .where("userId", "==", userId)
        .where("productId", "==", productId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // Delete the document from Firestore
            doc.ref
              .delete()
              .then(() => {
                // Remove the product from the cart items state
                const updatedCart = cartItems.filter((item) => item.id !== productId);
                setCartItems(updatedCart);
              })
              .catch((error) => {
                console.error("Error deleting product from Firestore: ", error);
              });
          });
        })
        .catch((error) => {
          console.error("Error querying Firestore: ", error);
        });
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>
      <FlatList
       data={cartItems}
       renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cartItemContainer}>
              <Image source={item.image} style={styles.cartItemImage} />
              <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemDescription}>{item.description}</Text>
                <View style={styles.cartItemQuantity}>
                  <TouchableOpacity onPress={() => reduceQuantity(item.id)}>
                    <Text style={styles.cartActionText}>-</Text>
                  </TouchableOpacity>
                  <Text>{item.quantity || 0}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                    <Text style={styles.cartActionText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.cartItemPrice}>Price: ${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
  <Text style={styles.cartActionText}>Remove</Text>
</TouchableOpacity>

          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text style={styles.total}>Total: ${calculateTotal().toFixed(2)}</Text>
      <TouchableOpacity onPress={() => contactSeller(item.id)}>
        <Text style={styles.cartActionText}>Contact Seller</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.orderButton} onPress={orderAndPay}>
        <Text style={styles.orderButtonText}>Order and Pay</Text>
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
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  cartItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Adjust spacing
  },
  cartItemImage: {
    width: 100,
    height: 100,
    marginRight: 16,
    resizeMode: "cover",
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cartItemDescription: {
    color: "#777",
    marginBottom: 8,
  },
  cartItemQuantity: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "right",
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
  cartActionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    marginHorizontal: 8,
  },
});

export default CartScreen;
