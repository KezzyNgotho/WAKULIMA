import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView,Image ,TouchableOpacity} from 'react-native';
import { Button, Card, Title, Paragraph, TextInput, Modal, Portal, FAB, List } from 'react-native-paper';
import firebase from '../components/firebase';


/* import * as ImagePicker from 'react-native-image-picker' */


const SalespersonInterface = () => {
  var ImagePicker = require('react-native-image-picker');

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [order, setOrder] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isAddProductModalVisible, setAddProductModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productStatus, setProductStatus] = useState(''); // Define productStatus state
  const [productImage, setProductImage] = useState(null); // State for storing the selected image

  useEffect(() => {
    const customersRef = firebase.firestore().collection('customers');

    customersRef.onSnapshot((snapshot) => {
      const customerList = [];
      snapshot.forEach((doc) => {
        customerList.push({ id: doc.id, ...doc.data() });
      });
      setCustomers(customerList);
    });

    const productsRef = firebase.firestore().collection('products');

    productsRef.onSnapshot((snapshot) => {
      const productList = [];
      snapshot.forEach((doc) => {
        productList.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productList);
    });
  }, []);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleAddProductToOrder = (product) => {
    setOrder([...order, product]);
  };

  const handlePlaceOrder = () => {
    if (selectedCustomer) {
      const orderRef = firebase.firestore().collection('orders').doc();
      const orderData = {
        customerId: selectedCustomer.id,
        products: order,
        orderDate: new Date(),
      };

      orderRef.set(orderData).then(() => {
        setOrder([]);
        setSelectedCustomer(null);
      });
    }
  };

  const handleAddProduct = () => {
    const productsRef = firebase.firestore().collection('products');
    const newProduct = {
      name: newProductName,
      price: parseFloat(newProductPrice),
      type: selectedType,
      status: productStatus, // Add productStatus
     /*  imageUrl: productImage?.uri, */ // Use the selected image URI
    };

    productsRef
      .add(newProduct)
      .then((docRef) => {
        setProducts([...products, { id: docRef.id, ...newProduct }]);
        setNewProductName('');
        setNewProductPrice('');
        setSelectedType('');
        setProductStatus(''); // Clear productStatus
       /*  setProductImage(null); */ // Clear the selected image
        setAddProductModalVisible(false);
      })
      .catch((error) => {
        console.error('Error adding product: ', error);
      });
  };

  const handleEditProduct = () => {
    if (editingProduct) {
      const productsRef = firebase.firestore().collection('products');
      const updatedProduct = {
        name: newProductName,
        price: parseFloat(newProductPrice),
        type: selectedType,
        status: productStatus, // Add productStatus
        imageUrl: productImage?.uri, // Use the selected image URI
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
          setProductStatus(''); // Clear productStatus
          setProductImage(null); // Clear the selected image
          setAddProductModalVisible(false);
          setEditingProduct(null);
        })
        .catch((error) => {
          console.error('Error updating product: ', error);
        });
    }
  };

  const handleDeleteProduct = (product) => {
    const productsRef = firebase.firestore().collection('products');

    productsRef
      .doc(product.id)
      .delete()
      .then(() => {
        const updatedProducts = products.filter((p) => p.id !== product.id);
        setProducts(updatedProducts);
      })
      .catch((error) => {
        console.error('Error deleting product: ', error);
      });
  };

  const handleSelectImage = () => {
    /* const options = {
      title: 'Select Product Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }; */
    const handleSelectImage = () => {
      const options = {
        title: 'Select Product Image',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
  
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          // Image selected successfully, you can use the `response.uri` here
          setProductImage(response);
        }
      });
    };
  }  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Salesperson Interface</Text>

      <View style={styles.contentContainer}>
        <View style={styles.leftContainer}>
          <Card>
            <Card.Content>
              <Title>Select Customer:</Title>
              <List.Section>
                {customers.map((customer) => (
                  <List.Item
                    key={customer.id}
                    title={customer.name}
                    onPress={() => handleSelectCustomer(customer)}
                  />
                ))}
              </List.Section>
            </Card.Content>
          </Card>

          <Card style={styles.productCard}>
            <Card.Content>
              <Title>Our Products:</Title>
              <List.Section>
                {products.map((product) => (
                 <List.Item
                 key={product.id}
                 title={product.name}
                 description={`Price: $${product.price.toFixed(2)}`}
                 left={() => (
                  <TouchableOpacity
                    onPress={() => {
                      setNewProductName(product.name);
                      setNewProductPrice(product.price.toString());
                      setSelectedType(product.type);
                      setEditingProduct(product);
                      setAddProductModalVisible(true);
                    }}
                    style={styles.iconContainer}
                  >
                    <Image
                      source={require('../assets/icons8-edit-30.png')} // Replace with the path to your pencil image
                      style={styles.imageIcon}
                      resizeMode="contain" // You can adjust the resizeMode based on your image aspect ratio
                    />
                  </TouchableOpacity>
                )}
                 right={() => (
                  <View style={styles.iconContainer}>
                     <TouchableOpacity onPress={() => handleDeleteProduct(product)}>
                       <Image
                         source={require('../assets/icons8-delete-30.png')} // Replace with the path to your delete image
                         style={styles.imageIcon}
                         resizeMode="contain" // You can adjust the resizeMode based on your image aspect ratio
                       />
                     </TouchableOpacity>
                   </View>
                 )}
               />
               
                ))}
              </List.Section>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.rightContainer}>
  <Card>
    <Card.Content>
      <Title>Order Summary:</Title>
      <List.Section>
        {order.map((item) => (
          <List.Item
            key={item.id}
            title={item.name}
            description={`Price: $${item.price.toFixed(2)}`}
            left={() => (
              <Image
                source={require('../assets/icons8-plus-24.png')} // Replace with the path to your plus icon image
                style={styles.imageIcon}
                resizeMode="contain" // You can adjust the resizeMode based on your image aspect ratio
                onPress={() => handleAddProductQuantity(item)} // Make sure to add the onPress event
              />
            )}
            right={() => (
              <View style={styles.quantityContainer}>
                <Text>{item.quantity || 0}</Text>
                <List.Icon
                  icon="minus"
                  onPress={() => handleReduceProductQuantity(item)}
                />
              </View>
            )}
          />
        ))}
      </List.Section>
    </Card.Content>
  </Card>
  <FAB
    style={styles.fab}
    icon={() => (
      <Image
        source={require('../assets/icons8-cart-50.png')} // Replace with the path to your cart icon image
        style={styles.imageIcon} // Define the style for your image icon
        resizeMode="contain" // You can adjust the resizeMode based on your image aspect ratio
      />
    )}
    label="Place Order"
    onPress={handlePlaceOrder}
    disabled={!selectedCustomer || order.length === 0}
  />
  {/* Add the button for adding a new product here */}
  <FAB
    style={styles.fab}
    icon={() => (
      <Image
        source={require('../assets/icons8-plus-24.png')} // Replace with the path to your add icon image
        style={styles.imageIcon}
        resizeMode="contain"
      />
    )}
    label="Add Product"
    onPress={() => setAddProductModalVisible(true)} // Show the product modal when the button is pressed
  />
</View>

      </View>

      <Portal>
        <Modal
          visible={isAddProductModalVisible}
          onDismiss={() => {
            setAddProductModalVisible(false);
            setEditingProduct(null);
            setProductImage(null);
          }}
        >
          <Card>
            <Card.Content>
              <Title>{editingProduct ? 'Edit Product' : 'Add New Product'}</Title>
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
              <TextInput
                label="Product Status"
                value={productStatus}
                onChangeText={(text) => setProductStatus(text)}
                style={styles.input}
              />
              <Button mode="contained" onPress={editingProduct ? handleEditProduct : handleAddProduct} style={styles.addButton}>
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </Button>
             {/*  <Button onPress={handleSelectImage}>Select Image</Button>
              {productImage && (
               <Image
               source={{ uri: productImage?.uri }}
               style={{ width: 100, height: 100 }} // Adjust the image size as needed
             />
              )} */}
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageIcon: {
    width: 24,
    height: 24,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    marginRight: 16,
  },
  rightContainer: {
    flex: 1,
  },
  productCard: {
    marginTop: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginBottom: 16,
  },
  addButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default SalespersonInterface;
