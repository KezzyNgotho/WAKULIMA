import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import firebase from '../components/firebase';

const CustomerInterface = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const productsRef = firebase.firestore().collection('products');

    const unsubscribe = productsRef.onSnapshot(snapshot => {
      const productList = [];
      snapshot.forEach(doc => {
        productList.push({id: doc.id, ...doc.data()});
      });
      setProducts(productList);
      setFilteredProducts(productList); // Initialize filtered products with all products
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = query => {
    // Filter products based on the search query
    const filtered = products.filter(product => {
      if (product.productName && query) {
        const productNameLower = product.productName.toLowerCase();
        const queryLower = query.toLowerCase();
        return productNameLower.includes(queryLower);
      }
      return true; // Show all products when the query is empty
    });

    setFilteredProducts(filtered);
    setSearchQuery(query);
  };

  const navigateToProductDetails = product => {
    // Use the navigation hook to navigate to the ProductDetails screen
    navigation.navigate('ProductDetails', {product});
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
        data={filteredProducts}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigateToProductDetails(item)}>
            <View style={styles.productCardContent}>
              {/* Display the product image */}
              <Image
                source={{uri: item.imageUrl}}
                style={styles.productImage}
              />

             
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDescription}>
                Description: {item.productDescription}
              </Text>
              <Text style={styles.productType}>Type: {item.type}</Text>
              <Text style={styles.productPrice}>
                Price: ${item.price ? item.price.toFixed(2) : 'N/A'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    marginBottom: 8,
    backgroundColor:'transparent',
  },
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
    fontFamily: 'YourCustomFont-Bold', // Replace with your custom font or system font
    color: '#333',
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
    width: '48%', // Adjust the width to fit two items in a row
    marginHorizontal: '1%', // Add horizontal margin for spacing between items
    flexDirection: 'column',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    marginRight: 16,
  },
  productCardContent: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontFamily: 'YourCustomFont-Bold', // Replace with your custom font or system font
    color: 'green',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  productDescription: {
    color: 'black',
    marginBottom: 8,
    fontWeight: 'bold,',
    // Replace with your custom font or system font
  },
  productPrice: {
    color: 'orange',
    fontSize: 18, // Replace with your custom font or system font
  },
  productType: {
    color: '#00008B',
    fontSize: 14,
    fontWeight: 'bold', // Replace with your custom font or system font
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
});

export default CustomerInterface;
