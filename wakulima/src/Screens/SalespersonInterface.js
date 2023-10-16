import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  Button,
  Card,
  Title,
 
  Modal,
  Portal,
  Snackbar,
  Checkbox,
} from 'react-native-paper';
import TextInput from 'react-native-elements'
import firebase from '../components/firebase';
import ImagePicker from 'react-native-image-crop-picker';
import { Picker } from '@react-native-picker/picker';

const SalespersonInterface = ({label}) => {
  const [checked, setChecked] = useState(false);
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
 /*  const isSelected = selectedProducts.includes(item.id); */

  const handlePress = () => {
    toggleProductSelection(item.id);
  };
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isOrderModalVisible, setOrderModalVisible] = useState(false);
  const [customerUsername, setCustomerUsername] = useState('');
  
  const [productQuantities, setProductQuantities] = useState({});
  const [quantityInput, setQuantityInput] = useState('');
  const [selectedProductQuantities, setSelectedProductQuantities] = useState({});
  const [items, setItems] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
 

const toggleCheck = (productId) => {
  if (selectedProducts.includes(productId)) {
    setSelectedProducts(selectedProducts.filter((id) => id !== productId));
  } else {
    setSelectedProducts([...selectedProducts, productId]);
  }
};

  /* const [isChecked, setIsChecked] = useState(false);

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };
 */
  const updateProductQuantity = (productId, quantity) => {
    const updatedQuantities = { ...productQuantities, [productId]: quantity };
    setProductQuantities(updatedQuantities);
  };

  const openOrderModal = () => {
    setOrderModalVisible(true);
  };
  const handleClose = () => {
    setOrderModalVisible(false); // Close the modal
  };

  const toggleProductSelection = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelectedProducts) =>
        prevSelectedProducts.filter((id) => id !== productId)
      );
    } else {
      setSelectedProducts((prevSelectedProducts) => [
        ...prevSelectedProducts,
        productId,
      ]);
    }
  };
  /* const placeOrder = () => {
    // Check if a product is selected
    if (!selectedProduct) {
      alert('Please select a product before placing the order.');
      return;
    }

    // Handle placing the order here
    // You can access the state variables here
    // Then, navigate back to the previous screen or perform any other actions
    navigation.goBack();
  };
 */

  const placeOrder = async () => {

    if (!selectedProducts) {
      alert('Please select a product before placing the order.');
      return;
    }
    if (
      customerUsername &&
      selectedProducts.length > 0 &&
      deliveryAddress &&
      mobileNumber &&
      deliveryMethod &&
      paymentMethod
    ) {
      try {
        const userRef = firebase.firestore().collection('users');
        const userQuery = await userRef.where('username', '==', customerUsername).get();
        
        if (!userQuery.empty) {
          const userId = userQuery.docs[0].id;
  
          const order = {
            userId,
            products: selectedProducts.map((productId) => ({
              id: productId,
              quantity: productQuantities[productId],
            })),
            deliveryAddress,
            mobileNumber,
            deliveryMethod,
            paymentMethod,
          };
  
          const ordersRef = firebase.firestore().collection('orders');
          const newOrderRef = await ordersRef.add(order);
          
          console.log('Order placed with ID:', newOrderRef.id);
  
          setCustomerUsername('');
          setSelectedProducts([]);
          setDeliveryAddress('');
          setMobileNumber('');
          setDeliveryMethod('');
          setPaymentMethod('');
          setOrderModalVisible(false);
        } else {
          console.log('User not found.');
        }
      } catch (error) {
        console.error('Error placing order:', error);
      }
    }
  };

  const upload = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        console.log(image);
        setProductImageUri(image.path);
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
      quantitiesAndPrices: quantitiesAndPrices,
    };
  
    productsRef
      .add(newProduct)
      .then((docRef) => {
        setProducts([...products, { id: docRef.id, ...newProduct }]);
        setNewProductName('');
        setNewProductPrice('');
        setSelectedType('');
        setProductImageUri(null);
        setQuantitiesAndPrices([]);
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
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card key={item.id} style={styles.productCard}>
            <Card.Content>
            <Image source={{uri: item.imageUrl}} style={styles.productImage} />
              <Title style={styles.productName}>{item.name}</Title>
              <Text style={styles.productType}>Type: {item.type}</Text>
              {item.quantitiesAndPrices ? (
                <View style={styles.quantityPriceItem}>
                  {item.quantitiesAndPrices.map((qap, index) => (
                    <View key={index} style={styles.quantityPriceItem}>
                      <Text style={styles.productName}>{qap.quantity} ml</Text>
                      <Text style={styles.productPrice}>Price: Ksh {qap.pricePerUnit}</Text>
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
            <View  style={styles.productCard}>
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
                    <Text>Price Per Unit: Ksh {item.pricePerUnit}</Text>
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
            </View>
          </Card>
        </Modal>
      </Portal>

      <Button
        mode="contained"
        onPress={openOrderModal}
        style={styles.placeOrderButton}>
        Place Order
      </Button>
      <Portal>
  <Modal
    visible={isOrderModalVisible}
    onDismiss={() => setOrderModalVisible(false)}
  >
    <ScrollView>
      <Card style={styles.modalCard}>
        <Card.Content>
          <Title style={styles.modalTitle}>Place Order</Title>
          <TextInput
            label="Customer Username"
            value={customerUsername}
            onChangeText={(text) => setCustomerUsername(text)}
            style={styles.input}
          />
          <Text style={styles.sectionTitle}>Customer Details:</Text>
          <TextInput
            label="Delivery Address"
            value={deliveryAddress}
            onChangeText={(text) => setDeliveryAddress(text)}
            style={styles.input}
          />
          <TextInput
            label="Mobile Number"
            value={mobileNumber}
            onChangeText={(text) => setMobileNumber(text)}
            style={styles.input}
          />
          <TextInput
            label="Delivery Method"
            value={deliveryMethod}
            onChangeText={(text) => setDeliveryMethod(text)}
            style={styles.input}
          />
          <TextInput
            label="Payment Method"
            value={paymentMethod}
            onChangeText={(text) => setPaymentMethod(text)}
            style={styles.input}
          />
          <Text style={styles.sectionTitle}>Select Products for the Order:</Text>

          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.productCheckbox}>
                <Image
                  source={
                    selectedProducts.includes(item.id)
                      ? require('../assets/icons8-tick-box-24.png')
                      : require('../assets/icons8-unchecked-24.png')
                  }
                  style={styles.icon}
                />
                <Checkbox.Item
                  label={item.name}
                  status={
                    selectedProducts.includes(item.id) ? 'checked' : 'unchecked'
                  }
                  onPress={() => toggleCheck(item.id)}
                />
                <Text style={styles.productType}>Type: {item.type}</Text>
                {item.quantitiesAndPrices ? (
                  <View style={styles.quantitySection}>
                    <Text style={styles.quantityLabel}>Select Quantity:</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        style={styles.picker}
                        selectedValue={productQuantities[item.id] || ''}
                        onValueChange={(itemValue) =>
                          updateProductQuantity(item.id, itemValue)
                        }
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
                  </View>
                ) : (
                  <Text>N/A</Text>
                )}
                <View style={styles.quantitySection}>
                  <Text style={styles.quantityLabel}>Number of Items:</Text>
                  <View style={styles.quantityButtonsRow}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        setItems(items - 1 >= 1 ? items - 1 : 1)
                      }
                    >
                      <Text style={styles.cartActionText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{items} items</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setItems(items + 1)}
                    >
                      <Text style={styles.cartActionText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
          <View  style={styles.buttonRow}>
          <Button
            mode="contained"
            onPress={placeOrder}
            style={styles.placeOrderButton}
          >
            Place Order
          </Button>
          <Button
           mode="contained"
          onPress={handleClose} 
          style={styles.placeOrderButton1}
          >
            close
            </Button>
      </View>
        </Card.Content>
      </Card>
    </ScrollView>
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingProduct(null);
          setAddProductModalVisible(true);
        }}>
        <Image
          source={require('../assets/icons8-plus-24.png')}
          style={styles.customFabIcon}
        />
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({


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
  orderButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 2,
    marginBottom: 5,
    backgroundColor: 'transparent', // Background color for the input-like container
  },
  picker: {
    height: 20,

    color: '#333', // Text color for selected item
  },
  productCheckbox: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  quantityPriceContainer: {
    marginLeft: 16,
  },

  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },

 
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
    color:'black'
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
    flexDirection: 'column', // Adjust if needed
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
    color:'black'
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
    color:'black'
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
  orderModalContainer: {
    margin: 16,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  customerDetailsText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color:'black'
  },
  productSelectionText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color:'black'
  },
  productCheckbox: {
    marginTop: 10,
  },
  productTypeText: {
    marginTop: 5,
    fontSize: 16,
    color:'black'
  },
  quantityPickerContainer: {
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'black'
  },
 
  viewDetailsButton: {
    marginTop: 10,
  },
  numberOfItemsContainer: {
    marginTop: 10,
  },
  numberOfItemsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'black'
  },
  quantityButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: '#007aff',
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  cartActionText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
  },
  placeOrderButton: {
    marginTop: 16,
  },
  modalCard: {
    margin: 16,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
    color:'black'
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    color:'black'
  },
  input: {
    marginBottom: 8,
  },
  productCheckbox: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  productType: {
    fontSize: 16,
    marginBottom: 8,
    color:'black'
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityLabel: {
    flex: 1,
    fontSize: 16,
    color:'black'
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingLeft: 8,
  },
  picker: {
    height: 40,
  },
  quantityButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  cartActionText: {
    color: 'white',
    fontSize: 20,
  },
  quantityValue: {
    fontSize: 18,
    color:'black'
  },
placeOrderButton: {
  backgroundColor: 'blue', // Change the background color to blue
  borderRadius: 4,
  padding: 12,
  alignItems: 'center',
  marginTop: 16,
  width: 160, // Add some top margin to separate it from other elements
},
placeOrderButton1: {
  backgroundColor: 'red', // Change the background color to blue
  borderRadius: 4,
  padding: 12,
  alignItems: 'center',
  marginTop: 16,
  width: 160, 
 // Add some top margin to separate it from other elements
},
placeOrderButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
buttonRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
},
/* placeOrderButton: {
  backgroundColor: 'blue',
  borderRadius: 4,
  paddingVertical: 8,
  paddingHorizontal: 12,
  alignItems: 'center',
}, */
});

export default SalespersonInterface;