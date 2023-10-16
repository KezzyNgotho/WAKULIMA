
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../components/firebase";

const CartScreen = ({ route }) => {
  const { cart } = route.params || { cart: [] };
  const [cartItems, setCartItems] = useState(cart);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const cartItemsRef = firebase.firestore().collection("cart");

        const snapshot = await cartItemsRef.where("userId", "==", userId).get();

        const cartItemList = [];
        snapshot.forEach((doc) => {
          const itemData = doc.data();
          const totalPrice = itemData.pricePerUnit * itemData.itemsNumber;

          const itemWithTotalPrice = {
            id: doc.id,
            ...itemData,
            total: totalPrice.toFixed(2),
          };

          cartItemList.push(itemWithTotalPrice);
        });

        setCartItems(cartItemList);
      } else {
        // Handle the case where the user is not authenticated
      }
    };

    fetchCartItems();
  }, []);

  const orderAndPay = () => {
    navigation.navigate("SelectDeliveryScreen", { cartItems });
  };

  const updateCartItem = (updatedItem, updatedItems) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === updatedItem.id) {
        return { ...item, items: updatedItems };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const reduceItemsNumber = (productId) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === productId && item.items > 1) {
        return { ...item, items: item.items - 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.pricePerUnit * item.items,
      0
    ).toFixed(2);
  };

  const contactSeller = (productId) => {
    // Implement your logic to contact the seller here
    // This can include sending a message, making a call, or opening a contact screen
    // You can use navigation to navigate to a contact screen or any other contact method
  };

  const removeFromCart = (productId) => {
    // Call your backend or Firestore to remove the item from the cart
    // Assuming you have a Firebase Firestore setup
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      const cartItemsRef = firebase.firestore().collection("cart");
  
      cartItemsRef
        .where("userId", "==", userId)
        .where("productId", "==", productId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref
              .delete()
              .then(() => {
                // Update the cartItems state to remove the item
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
              <Image source={{ uri: item.image }} style={styles.cartItemImage} />
              <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.type}>Type: {item.type}</Text>
                <Text style={styles.Description}>Quantities: {item.quantity}</Text>
                <View style={styles.cartItemQuantity}>
                  <TouchableOpacity onPress={() => reduceItemsNumber(item.id)}>
                    <Text style={styles.cartActionText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityLabel}>Items: {item.items}</Text>
                  <TouchableOpacity onPress={() => updateCartItem(item, item.items + 1)}>
                    <Text style={styles.cartActionText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.cartItemPrice}>Price: Ksh {item.pricePerUnit.toFixed(2)}</Text>
                <Text style={styles.cartItemPrice}>
                  Total Price: Ksh{(item.pricePerUnit * item.items).toFixed(2)}
                </Text>
              </View>
            </View>
            
            <View style={styles.actionContainer}>
           
                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  style={styles.actionButton}
                >
                  <Image
                    source={require("../assets/icons8-delete-30.png")} // Replace with actual icon image source
                    style={styles.actionIcon}
                  />
                  <Text style={styles.actionText}>Remove</Text>
                </TouchableOpacity>

                {/* "Contact Seller" Action */}
                <TouchableOpacity
                  onPress={() => contactSeller(item.id)}
                  style={styles.actionButton}
                >
                  <Image
                    source={require("../assets/icons8-call-30.png")} // Replace with actual icon image source
                    style={styles.actionIcon}
                  />
                  <Text style={styles.actionText}>Contact Seller</Text>
                </TouchableOpacity>
              </View>
            </View>
     
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <Text style={styles.total}>Total: Ksh{calculateTotal()}</Text>
      <TouchableOpacity onPress={orderAndPay} style={styles.orderButton}>
        <Text style={styles.orderButtonText}>Order and Pay</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  Description:{
color:'orange',
fontWeight:'bold'
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  type:{
color:'green',
fontWeight:'bold'
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
  quantityLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    marginRight: 8,
  },
  itemCountLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  actionIcon: {
    width: 16, // Adjust icon size as needed
    height: 16,
    marginRight: 4,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default CartScreen;
