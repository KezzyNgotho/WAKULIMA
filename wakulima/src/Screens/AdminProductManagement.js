import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AddProductScreen = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [varietyFields, setVarietyFields] = useState([{ variety: '', quantity: '', price: '' }]);

  const addVarietyField = () => {
    setVarietyFields([...varietyFields, { variety: '', quantity: '', price: '' }]);
  };

  const updateVarietyField = (index, field, value) => {
    const updatedVarietyFields = [...varietyFields];
    updatedVarietyFields[index][field] = value;
    setVarietyFields(updatedVarietyFields);
  };

  const removeVarietyField = (index) => {
    const updatedVarietyFields = [...varietyFields];
    updatedVarietyFields.splice(index, 1);
    setVarietyFields(updatedVarietyFields);
  };

  const handleSubmit = async () => {
    if (!productName || !productDescription || varietyFields.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all fields and add at least one variety.');
      return;
    }

    try {
      const product = {
        name: productName,
        description: productDescription,
        varieties: varietyFields,
      };

      await firestore().collection('products').add(product);

      setProductName('');
      setProductDescription('');
      setVarietyFields([]);

      Alert.alert('Product Added', 'Product has been added successfully.');
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'An error occurred while adding the product. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Product</Text>
      <View style={styles.form}>
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
          style={[styles.input, styles.descriptionInput]}
          multiline
          numberOfLines={4}
        />
        {varietyFields.map((varietyField, index) => (
          <View key={index} style={styles.varietyContainer}>
            <TextInput
              label={`Variety ${index + 1}`}
              placeholder="Enter variety"
              value={varietyField.variety}
              onChangeText={(text) => updateVarietyField(index, 'variety', text)}
              style={styles.input}
            />
            <TextInput
              label={`Quantity ${index + 1}`}
              placeholder="Enter quantity"
              value={varietyField.quantity}
              onChangeText={(text) => updateVarietyField(index, 'quantity', text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label={`Price ${index + 1}`}
              placeholder="Enter price"
              value={varietyField.price}
              onChangeText={(text) => updateVarietyField(index, 'price', text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TouchableOpacity onPress={() => removeVarietyField(index)}>
              <Text style={styles.removeButton}>Remove Variety</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addVarietyField} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Variety</Text>
        </TouchableOpacity>
        {varietyFields.length === 0 && (
          <Text style={styles.errorMessage}>Please add at least one variety</Text>
        )}
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  varietyContainer: {
    marginBottom: 16,
  },
  removeButton: {
    color: 'red',
    textAlign: 'right',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 5,
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 5,
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default AddProductScreen;
