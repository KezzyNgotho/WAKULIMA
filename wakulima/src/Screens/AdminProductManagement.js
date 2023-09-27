import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity,  Image, ScrollView, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Picker from '@react-native-picker/picker'
import firestore from '@react-native-firebase/firestore';

const AddProductScreen = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedVariety, setSelectedVariety] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [quantities, setQuantities] = useState([]);

  const [productVarieties, setProductVarieties] = useState([]); // Array for product varieties
  
  // Fetch varieties and quantities from Firebase Firestore
  useEffect(() => {
    const fetchVarietiesAndQuantities = async () => {
      try {
        // Fetch varieties
        const varietiesSnapshot = await firestore().collection('varieties').get();
        const varietyData = varietiesSnapshot.docs.map((doc) => doc.data().name);
        setVarieties(varietyData);

        // Fetch quantities
        const quantitiesSnapshot = await firestore().collection('quantities').get();
        const quantityData = quantitiesSnapshot.docs.map((doc) => doc.data().name);
        setQuantities(quantityData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchVarietiesAndQuantities();
  }, []);

  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Image selection canceled');
      } else if (response.error) {
        console.error('Image picker error:', response.error);
      } else {
        setProductImages([...productImages, response.uri]);
      }
    });
  };


  // Function to add a new variety with quantity and price
  const addVariety = () => {
    if (selectedVariety && selectedQuantity && productPrice) {
      const newVariety = {
        variety: selectedVariety,
        quantity: selectedQuantity,
        price: productPrice,
      };
      setProductVarieties([...productVarieties, newVariety]);
      setSelectedVariety('');
      setSelectedQuantity('');
      setProductPrice('');
    } else {
      Alert.alert('Missing Information', 'Please select variety, quantity, and enter price.');
    }
  };
  const handleSubmit = async () => {
    if (!productName || !productDescription || productVarieties.length === 0) {
      Alert.alert('Missing Information', MISSING_INFO_ERROR);
      return;
    }

    // Save product data to Firebase Firestore
    try {
      // Define the product object
      const product = {
        name: productName,
        description: productDescription,
        varieties: productVarieties, // Updated to use productVarieties
        images: productImages,
      };

      // Save the product to Firestore
      await firestore().collection('products').add(product);

      // Clear form fields
      setProductName('');
      setProductDescription('');
      setSelectedVariety('');
      setSelectedQuantity('');
      setProductPrice('');
      setProductImages([]);
      setProductVarieties([]);

      // Display a success message or navigate to a different screen
      Alert.alert('Product Added', 'Product has been added successfully.');
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'An error occurred while adding the product. Please try again later.');
    }
  };
  const varietyFields = productVarieties.map((variety, index) => (
    <View key={index}>
      <Text>{`Variety: ${variety.variety}, Quantity: ${variety.quantity}, Price: ${variety.price}`}</Text>
      <TouchableOpacity onPress={() => removeVariety(index)}>
        <Text style={{ color: 'red' }}>Remove</Text>
      </TouchableOpacity>
    </View>
  ));

  const removeVariety = (index) => {
    const updatedVarieties = [...productVarieties];
    updatedVarieties.splice(index, 1);
    setProductVarieties(updatedVarieties);
  };
  return (
    <ScrollView>
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Add Product</Text>
      <TextInput
        label="Product Name"
        placeholder="Enter product name"
        value={productName}
        onChangeText={(text) => setProductName(text)}
        style={styles.input}
      />
      <TextInput
        label="Product Description"
        placeholder="Enter product description"
        value={productDescription}
        onChangeText={(text) => setProductDescription(text)}
        style={styles.input}
      />
      {varietyFields} 
      {varieties.length > 0 ? (
        <Picker
          selectedValue={selectedVariety}
          onValueChange={(itemValue) => setSelectedVariety(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Variety" value="" />
          {varieties.map((variety, index) => (
            <Picker.Item label={variety} value={variety} key={index} />
          ))}
        </Picker>
      ) : null}
      {quantities.length > 0 ? (
        <Picker
          selectedValue={selectedQuantity}
          onValueChange={(itemValue) => setSelectedQuantity(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Quantity" value="" />
          {quantities.map((quantity, index) => (
            <Picker.Item label={quantity} value={quantity} key={index} />
          ))}
        </Picker>
      ) : null}
      <TextInput
        label="Price"
        placeholder="Enter product price"
        value={productPrice}
        onChangeText={(text) => setProductPrice(text)}
        keyboardType="numeric"
        style={styles.input}
      />
      <TouchableOpacity onPress={addVariety} style={styles.button}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Add Variety</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleImageUpload} style={styles.imageButton}>
        <Text style={{ color: 'white' }}>Upload Image</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {productImages.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.productImage} />
        ))}
      </View>
      {productVarieties.length === 0 && (
        <Text style={{ color: 'red' }}>Please add at least one variety</Text>
      )}
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Add Product</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
  );
};
const styles = {
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  button: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 5,
    marginTop: 16,
  },
  imageButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 5,
    marginTop: 16,
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
  },
};

export default AddProductScreen;
