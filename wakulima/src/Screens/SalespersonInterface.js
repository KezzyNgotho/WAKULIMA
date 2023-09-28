import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import {
  Button,
  Card,
  Title,
  TextInput,
  Modal,
  Portal,
  Snackbar,
} from 'react-native-paper';
import firebase from '../components/firebase';
import ImagePicker from 'react-native-image-crop-picker';

const SalespersonInterface = () => {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isAddProductModalVisible, setAddProductModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productImageUri, setProductImageUri] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [quantitiesAndPrices, setQuantitiesAndPrices] = useState([]);
  
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const upload = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        console.log(image);
        setProductImageUri(image.path); // Set the selected image URI
      })
      .catch((err) => {
        console.log(err);
        setSnackbarMessage('Image selection failed.');
        setSnackbarVisible(true);
      });
  };

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

  const handleEditProduct = () => {
    if (editingProduct) {
      const productsRef = firebase.firestore().collection('products');
      const updatedProduct = {
        name: newProductName,
        price: parseFloat(newProductPrice),
        type: selectedType,
        imageUrl: productImageUri,
      };

      productsRef
        .doc(editingProduct.id)
        .update(updatedProduct)
        .then(() => {
          const updatedProducts = products.map((product) =>
            product.id === editingProduct.id ? { ...product, ...updatedProduct } : product
          );
          setProducts(updatedProducts);
          setNewProductName('');
          setNewProductPrice('');
          setSelectedType('');
          setProductImageUri(null);
          setAddProductModalVisible(false);
          setEditingProduct(null);
        })
        .catch((error) => {
          console.error('Error updating product: ', error);
        });
    }
  };
  const handleAddProduct = () => {
    const productsRef = firebase.firestore().collection('products');
    const newProduct = {
      name: newProductName,
      price: parseFloat(newProductPrice),
      type: selectedType,
      imageUrl: productImageUri,
      quantitiesAndPrices: quantitiesAndPrices, // Include the quantities and prices
    };
  
    productsRef
      .add(newProduct)
      .then((docRef) => {
        setProducts([...products, { id: docRef.id, ...newProduct }]);
        setNewProductName('');
        setNewProductPrice('');
        setSelectedType('');
        setProductImageUri(null);
        setQuantitiesAndPrices([]); // Clear quantities and prices after adding
        setAddProductModalVisible(false);
      })
      .catch((error) => {
        console.error('Error adding product: ', error);
      });
  };
  
  const handleAddQuantityAndPrice = () => {
    if (quantity && pricePerUnit) {
      const newItem = {
        quantity: parseInt(quantity),
        pricePerUnit: parseFloat(pricePerUnit),
      };
      setQuantitiesAndPrices([...quantitiesAndPrices, newItem]);
      setQuantity('');
      setPricePerUnit('');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
    <Text style={styles.header}>Salesperson Interface</Text>
    <FlatList
        data={products}
        numColumns={2} // Display in rows of two
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card key={item.id} style={styles.productCard}>
            <Card.Content>
              <Title style={styles.productName}>{item.name}</Title>
             {/*  <Text style={styles.productPrice}>
                Price: {item.price ? `Ksh ${item.price.toFixed(2)}` : 'N/A'}
              </Text> */}
              <Text style={styles.productType}>Type: {item.type}</Text>
             {/*  <Text>Quantities and Prices:</Text> */}
              {item.quantitiesAndPrices ? (
                <View style={styles.quantityPriceItem}>
                  {item.quantitiesAndPrices.map((qap, index) => (
                    <View key={index} style={styles.quantityPriceItem}>
                      <Text style={styles.productName}>{qap.quantity} ml</Text>
                      <Text  style={styles.productPrice}>Price: Ksh {qap.pricePerUnit}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text>N/A</Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  setNewProductName(item.name);
                  setNewProductPrice(item.price.toString());
                  setSelectedType(item.type);
                  setEditingProduct(item);
                  setProductImageUri(item.imageUrl);
                  setAddProductModalVisible(true);
                }}
                style={styles.iconContainer}>
                <Image
                  source={require('../assets/icons8-edit-30.png')}
                  style={styles.imageIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
             
            </Card.Content>
          </Card>
        )}
      />
  

<Portal>
  <Modal
    visible={isAddProductModalVisible}
    onDismiss={() => {
      setAddProductModalVisible(false);
      setEditingProduct(null);
      setProductImageUri(null);
    }}>
    <Card>
      <Card.Content>
        <Title>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </Title>
        <TextInput
          label="Product Name"
          value={newProductName}
          onChangeText={(text) => setNewProductName(text)}
          style={styles.input}
        />
        <TextInput
          label="Product Price"
          value={newProductPrice}
          onChangeText={(text) => setNewProductPrice(text)}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Product Type"
          value={selectedType}
          onChangeText={(text) => setSelectedType(text)}
          style={styles.input}
        />
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>
            Quantities and Prices
          </Text>
          {quantitiesAndPrices.map((item, index) => (
            <View key={index} style={styles.quantityPriceItem}>
              <Text>Quantity: {item.quantity}</Text>
              <Text>Price Per Unit: Ksh{item.pricePerUnit}</Text>
            </View>
          ))}
          <View style={styles.addQuantityPriceContainer}>
            <TextInput
              label="Quantity"
              value={quantity}
              onChangeText={(text) => setQuantity(text)}
              keyboardType="numeric"
              style={styles.quantityInput}
            />
            <TextInput
              label="Price Per Unit"
              value={pricePerUnit}
              onChangeText={(text) => setPricePerUnit(text)}
              keyboardType="numeric"
              style={styles.priceInput}
            />
            <Button
              mode="contained"
              onPress={handleAddQuantityAndPrice}
              style={styles.addButton}>
              Add
            </Button>
          </View>
        </View>
        <Text>Selected Image URI: {productImageUri}</Text>
        
        {/* Place the two buttons inside a Card */}
        <Card style={styles.cardButtonsContainer}>
          <Card.Content style={styles.cardButtonsContent}>
            <Button mode="contained" onPress={upload} style={styles.cardButton}>
              Select Image
            </Button>
            <Button
              mode="contained"
              onPress={editingProduct ? handleEditProduct : handleAddProduct}
              style={styles.cardButton}>
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </Button>
          </Card.Content>
        </Card>
        
      </Card.Content>
    </Card>
  </Modal>
</Portal>




      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}>
        {snackbarMessage}
      </Snackbar>
      {/* Floating Action Button for adding a new product */}
      {/* Replace the FAB component with a custom image */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingProduct(null);
          setAddProductModalVisible(true);
        }}>
        <Image
          source={require('../assets/icons8-plus-24.png')} // Replace with the correct path to your custom image
          style={styles.customFabIcon}
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  productType:{
    color:'#00008B',
    fontWeight:'bold',
    fontSize:16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productCard: {
    elevation: 1,
    flexBasis: '47%', // Set width for two columns
    marginBottom: 10, // Add margin between cards
    backgroundColor: 'white', // Card background color
    borderRadius: 2,
    
    marginHorizontal:5, // Card border radius
  },
  contentContainer: {
    marginBottom: 16,
    flexDirection: 'row', // Adjust if needed
    flexWrap: 'wrap', // Allows cards to wrap to the next row
  },
  cardContent: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'black',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'orange',
  },
  productInfo: {
    marginTop: 5,
    fontSize: 16,
  },
  quantitiesAndPrices: {
    marginTop: 5,
    color:'red',
  },
  quantityPriceItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  imageIcon: {
    width: 30,
    height: 30,
  },
  input: {
    marginBottom: 10,
    backgroundColor:"transparent",
  },
  addButton: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007aff', // FAB background color
    borderRadius: 25, // FAB border radius to make it round
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6, // Elevation for shadow
    width: 50,
    height: 50,
  },
  customFabIcon: {
    width: 30,
    height: 30,
    tintColor: 'white', // Icon color
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quantityInput: {
    flex: 1,
    marginRight: 5,
    backgroundColor:"transparent",
  },
  priceInput: {
    flex: 1,
    marginLeft: 5,
    backgroundColor:"transparent",
  },
  addQuantityPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
});

export default SalespersonInterface;
