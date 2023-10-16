import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import firebase from '../components/firebase';
import { Button, Card, Title, TextInput } from 'react-native-paper';

const CustomerInterface = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    const productsRef = firebase.firestore().collection('products');

    productsRef.onSnapshot((snapshot) => {
      const productList = [];
      snapshot.forEach((doc) => {
        productList.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productList);
    });
  }, []);

  const handleSearch = (query) => {
    const filtered = products.filter((product) => {
      if (product.name && query) {
        const productNameLower = product.name.toLowerCase();
        const queryLower = query.toLowerCase();
        return productNameLower.includes(queryLower);
      }
      return true;
    });

    setFilteredProducts(filtered);
    setSearchQuery(query);
  };

  const navigateToProductDetails = (product) => {
    navigation.navigate('ProductDetails', { product, selectedQuantity });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Welcome, Customer!</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}>
            <Image
              source={require('../assets/icons8-cart-50.png')}
              style={styles.actionButtonImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}>
            <Image
              source={require('../assets/icons8-bell-50.png')}
              style={styles.actionButtonImage}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for products..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredProducts.length > 0 ? filteredProducts : products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <Title style={styles.productName}>{item.name}</Title>
            <Text style={styles.productType}>Type: {item.type}</Text>
            {item.quantitiesAndPrices ? (
  <View>
    <Text style={styles.quantityLabel}>Select Quantity:</Text>
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        selectedValue={selectedQuantity}
        onValueChange={(itemValue) => setSelectedQuantity(itemValue)}
      >
        <Picker.Item label="Select Quantity" value="" />
        {item.quantitiesAndPrices.map((qap, index) => (
          <Picker.Item
            key={index}
            label={`${qap.quantity} ml - Ksh ${qap.pricePerUnit}`}
            value={qap.quantity}
          />
        ))}
      </Picker>
    </View>
    <Button
      mode="contained"
      onPress={() => navigateToProductDetails(item)}
      style={styles.viewDetailsButton}
    >
      View Details
    </Button>
  </View>
) : (
  <Text>N/A</Text>
)}

          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontFamily: 'YourCustomFont-Bold',
    color: 'black',
  },
  headerButtons: {
    flexDirection: 'row',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 6,
    padding: 3,
    marginBottom: 14,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    marginHorizontal: '1%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    marginRight: 16,
    backgroundColor: 'transparent',
  },
  productName: {
    fontSize: 18,
    fontFamily: 'YourCustomFont-Bold',
    color: 'black',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  productType: {
    color: '#00008B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtonImage: {
    width: 29,
    height: 29,
  },
  selectedProductCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    padding: 16,
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'gray',
  },
  quantityLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 2,
    marginBottom: 5,
    backgroundColor: 'white', // Background color for the input-like container
  },
  picker: {
    height: 20,
    color: 'black',
  },
  viewDetailsButton: {
    marginTop: 10,
    backgroundColor: 'orange',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomerInterface;
