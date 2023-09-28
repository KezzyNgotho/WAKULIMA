import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Card,
  Title,
  TextInput,
  Modal,
  Portal,
  List,
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
    };

    productsRef
      .add(newProduct)
      .then((docRef) => {
        setProducts([...products, { id: docRef.id, ...newProduct }]);
        setNewProductName('');
        setNewProductPrice('');
        setSelectedType('');
        setProductImageUri(null);
        setAddProductModalVisible(false);
      })
      .catch((error) => {
        console.error('Error adding product: ', error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Salesperson Interface</Text>

      <View style={styles.contentContainer}>
        <Card style={styles.productCard}>
          <Card.Content>
            <Title>Our Products:</Title>
            <List.Section>
              {products.map((product) => (
                <List.Item
                  key={product.id}
                  title={product.name}
                  description={`Price: $${
                    product.price ? product.price.toFixed(2) : 'N/A'
                  }`}
                  left={() => (
                    <TouchableOpacity
                      onPress={() => {
                        setNewProductName(product.name);
                        setNewProductPrice(product.price.toString());
                        setSelectedType(product.type);
                        setEditingProduct(product);
                        setProductImageUri(product.imageUrl);
                        setAddProductModalVisible(true);
                      }}
                      style={styles.iconContainer}>
                      <Image
                        source={require('../assets/icons8-edit-30.png')}
                        style={styles.imageIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}
                  right={() => (
                    <View style={styles.iconContainer}>
                      {/* Prevent deletion */}
                    </View>
                  )}
                />
              ))}
            </List.Section>
          </Card.Content>
        </Card>
      </View>

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
              <Text>Selected Image URI: {productImageUri}</Text>
              <Button mode="contained" onPress={upload}>
                Select Image
              </Button>
              <Button
                mode="contained"
                onPress={editingProduct ? handleEditProduct : handleAddProduct}
                style={styles.addButton}>
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </Button>
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
  contentContainer: {
    marginBottom: 16,
  },
  productCard: {
    elevation: 4,
  },
  iconContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  imageIcon: {
    width: 30,
    height: 30,
  },
  input: {
    marginBottom: 10,
  },
  addButton: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },

  customFabIcon: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
  },
});

export default SalespersonInterface;
