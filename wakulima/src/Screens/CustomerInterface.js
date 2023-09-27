import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Button,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import firebase from "../components/firebase";
import VarietySelector from "../components/VarietySelector";

const CustomerInterface = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariety, setSelectedVariety] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const productsRef = firebase.firestore().collection("products");

    productsRef.onSnapshot((snapshot) => {
      const productList = [];
      snapshot.forEach((doc) => {
        productList.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productList);
    });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchVarietiesForProduct = (product) => {
    const productRef = firebase
      .firestore()
      .collection("products")
      .doc(product.id)
      .collection("varieties"); // Reference the subcollection "varieties" of the selected product

    productRef.onSnapshot((snapshot) => {
      const varietyList = [];
      snapshot.forEach((doc) => {
        varietyList.push({ id: doc.id, ...doc.data() });
      });

      setSelectedProduct(product);
      setSelectedVariety(varietyList[0]); // Select the first variety by default
      animateCardIn();
    });
  };

  const navigateToProductDetails = (product) => {
    fetchVarietiesForProduct(product);
  };

  const animateCardIn = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const animateCardOut = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => {
      setSelectedProduct(null);
      setSelectedVariety("");
      setQuantity(1);
    });
  };

  const cardTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const addToCart = () => {
    // Add the selected product, variety, and quantity to the cart
    // You can implement this logic as per your cart management system
    console.log("Added to cart:", selectedProduct.productName, selectedVariety.varietyName, quantity);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Welcome, Customer!</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate("Cart")}
          >
            <Image
              source={require("../assets/icons8-cart-50.png")}
              style={styles.actionButtonImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Image
              source={require("../assets/icons8-bell-50.png")}
              style={styles.actionButtonImage}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigateToProductDetails(item)}
          >
            <Image source={{ uri: item.productImage }} style={styles.productImage} />
            <View style={styles.productCardContent}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.productDescription}>{item.productDescription}</Text>
              <Text style={styles.productPrice}>Price: ${item.productPrice}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
      {selectedProduct && (
        <Animated.View
          style={[
            styles.selectedProductCard,
            { transform: [{ translateY: cardTranslateY }] },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={animateCardOut}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: selectedProduct.productImage }}
            style={styles.productImage}
          />
          <View style={styles.productCardContent}>
            <Text style={styles.productName}>{selectedProduct.productName}</Text>
            <Text style={styles.productDescription}>
              {selectedProduct.productDescription}
            </Text>
            <Text style={styles.productPrice}>
              Price: ${selectedProduct.productPrice}
            </Text>
            {selectedVariety && (
              <View>
                <VarietySelector
                  variety={selectedVariety}
                  selectedQuantity={quantity}
                  onSelectQuantity={setQuantity}
                />
                <TextInput
                  label="Quantity"
                  keyboardType="numeric"
                  value={quantity.toString()}
                  onChangeText={(value) => setQuantity(value)}
                />
                <Button title="Add to Cart" onPress={addToCart} />
              </View>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontFamily: "YourCustomFont-Bold", // Replace with your custom font or system font
    color: "#333",
  },
  headerButtons: {
    flexDirection: "row",
  },
  cartButton: {
    padding: 8,
    marginLeft: 8,
  },
  notificationButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 6,
    padding: 3,
    marginBottom: 14,
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: "48%", // Adjust the width to fit two items in a row
    marginHorizontal: "1%", // Add horizontal margin for spacing between items
    flexDirection: "column",
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    marginRight: 16,
  },
  productCardContent: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontFamily: "YourCustomFont-Bold", // Replace with your custom font or system font
    color: "green",
    marginBottom: 8,
    fontWeight: "bold",
  },
  productDescription: {
    color: "black",
    marginBottom: 8,
    // Replace with your custom font or system font
  },
  productPrice: {
    color: "orange",
    fontSize: 18, // Replace with your custom font or system font
  },
  actionButtonImage: {
    width: 29,
    height: 29,
  },
  selectedProductCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    padding: 16,
    zIndex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  closeButtonText: {
    fontSize: 18,
    color: "gray",
  },
});

export default CustomerInterface;
