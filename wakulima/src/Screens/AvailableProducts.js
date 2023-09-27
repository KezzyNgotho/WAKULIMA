import React, { useState } from "react";
import { View, Text, Button, TextInput, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CustomerInterface = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([
    { id: 1, name: "Product 1", price: 10, description: "Lorem ipsum dolor sit amet." },
    { id: 2, name: "Product 2", price: 15, description: "Consectetur adipiscing elit." },
    // Add more product data
  ]);

  const [cart, setCart] = useState([]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateToAvailableProducts = () => {
    // Implement navigation to the Available Products screen
  };

  const navigateToPaymentMode = () => {
    // Implement navigation to the Payment Mode screen
  };

  const navigateToRouteScheduling = () => {
    // Implement navigation to the Route Scheduling screen
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <View>
      <Text>Welcome, Customer!</Text>
      <TextInput
        placeholder="Search Products"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text>{item.name}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Price: ${item.price}</Text>
            <Button title="Add to Cart" onPress={() => addToCart(item)} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text>Your Cart:</Text>
      <FlatList
        data={cart}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text>{item.name}</Text>
            <Text>Price: ${item.price}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="View Available Products" onPress={navigateToAvailableProducts} />
      <Button title="Proceed to Payment" onPress={navigateToPaymentMode} />
      <Button title="Schedule Route" onPress={navigateToRouteScheduling} />
      {/* Add more buttons or components for ordering products */}
    </View>
  );
};

export default CustomerInterface;
