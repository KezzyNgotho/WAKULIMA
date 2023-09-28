import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert
} from "react-native";
import firebase from "../components/firebase";
import "firebase/auth";
import "firebase/firestore";

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;
  console.log("Product:", product);

  const [selectedVariety, setSelectedVariety] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Use this effect to respond to changes in the product object
    // For example, you can check if varieties have been added or modified
  }, [product]);

  const addToCart = async () => {
    const user = firebase.auth().currentUser;

    if (!user) {
      // User is not logged in, show an error or redirect to the login screen
      return;
    }

    const updatedProduct = {
      ...product,
      variety: selectedVariety,
      quantity: quantity,
      userId: user.uid,
    };

    console.log("updatedProduct", updatedProduct);

    try {
      await firebase.firestore().collection("cart").add(updatedProduct);

      Alert.alert(
        "Added to Cart",
        "What would you like to do?",
        [
          {
            text: "Continue Shopping",
            onPress: () => {
              navigation.navigate("CustomerInterface");
            },
            style: "cancel",
          },
          {
            text: "View Cart",
            onPress: () => {
              navigation.navigate("Cart");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  };

  const inquire = () => {
    // Implement logic for inquiring about the product
    // This can include sending an inquiry to the seller or displaying contact information
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Product Details</Text>
      <View style={styles.card}>
        <Image
          source={require("../assets/coffee.jpg")}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>
            Description: {product.description}
          </Text>
          <Text style={styles.productType}>Type: {product.type}</Text>
          <Text style={styles.productPrice}>Price: ${product.price}</Text>
          <Text style={styles.itemsLeft}>Items Left: {product.itemsLeft}</Text>
        </View>
      </View>

      {/* Additional info section */}
      <View style={styles.additionalInfoSection}>
        <Text style={styles.additionalInfoHeader}>Additional Info:</Text>

        {/* Quantity section */}
        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <View style={styles.quantityButtonsRow}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity - 1 >= 1 ? quantity - 1 : 1)}
            >
              <Text style={styles.cartActionText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.cartActionText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action buttons section */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={inquire}>
            <Image
              source={require("../assets/icons8-call-30.png")}
              style={styles.actionButtonImage}
            />
            <Text style={styles.buttonText}>Inquire</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("CustomerInterface")}
          >
            <Image
              source={require("../assets/icons8-home-24.png")}
              style={styles.actionButtonImage}
            />
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={addToCart}
          >
            <Image
              source={require("../assets/icons8-cart-50.png")}
              style={styles.actionButtonImage}
            />
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
    resizeMode: "cover",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "orange",
    marginBottom: 8,
  },
  productType: {
    fontSize: 18,
    fontWeight:"bold",
    color:"#00008B",
    marginBottom: 8,
  },
  productDescription: {
    color: "green",
    marginBottom: 8,
    fontWeight:'bold',
  },
 
  itemsLeft: {
    color: "#333",
  },
  additionalInfoSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  additionalInfoHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  quantitySection: {
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  quantityButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 4,
  },
  cartActionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#007BFF",
    borderRadius: 4,
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 4,
  },
  actionButtonImage: {
    width: 20,
    height: 20,
    marginRight: 3,
  },
});

export default ProductDetails;
