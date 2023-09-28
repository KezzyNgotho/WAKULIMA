import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const ProductModal = ({ visible, onClose, onSubmit }) => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productType, setProductType] = useState('');
  const [productImageURL, setProductImageURL] = useState('');
  const [varietyFields, setVarietyFields] = useState([{ variety: '', quantity: '', price: '' }]);

  const handleAddProduct = () => {
    // Validate and submit product data to the parent component
    // Reset form fields after submission
    onSubmit({
      name: productName,
      description: productDescription,
      price: productPrice,
      type: productType,
      imageUrl: productImageURL,
      varieties: varietyFields,
    });
    resetForm();
  };

  const resetForm = () => {
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductType('');
    setProductImageURL('');
    setVarietyFields([{ variety: '', quantity: '', price: '' }]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add/Edit Product</Text>
          
          {/* Product Name */}
          <TextInput
            placeholder="Product Name"
            value={productName}
            onChangeText={(text) => setProductName(text)}
            style={styles.input}
          />
          
          {/* Product Description */}
          <TextInput
            placeholder="Product Description"
            value={productDescription}
            onChangeText={(text) => setProductDescription(text)}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.descriptionInput]}
          />
          
          {/* Product Price */}
          <TextInput
            placeholder="Product Price"
            value={productPrice}
            onChangeText={(text) => setProductPrice(text)}
            keyboardType="numeric"
            style={styles.input}
          />
          
          {/* Product Type */}
          <TextInput
            placeholder="Product Type"
            value={productType}
            onChangeText={(text) => setProductType(text)}
            style={styles.input}
          />
          
          {/* Product Image URL */}
          <TextInput
            placeholder="Image URL"
            value={productImageURL}
            onChangeText={(text) => setProductImageURL(text)}
            style={styles.input}
          />

          {/* Variety Fields */}
          {varietyFields.map((varietyField, index) => (
            <View key={index}>
              <TextInput
                placeholder={`Variety ${index + 1}`}
                value={varietyField.variety}
                onChangeText={(text) => updateVarietyField(index, 'variety', text)}
                style={styles.input}
              />
              <TextInput
                placeholder={`Quantity ${index + 1}`}
                value={varietyField.quantity}
                onChangeText={(text) => updateVarietyField(index, 'quantity', text)}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder={`Price ${index + 1}`}
                value={varietyField.price}
                onChangeText={(text) => updateVarietyField(index, 'price', text)}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          ))}
          
          <TouchableOpacity onPress={handleAddProduct} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};





const styles = StyleSheet.create({
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 5,
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 5,
    marginTop: 8,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ProductModal;
