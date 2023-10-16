import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Checkbox } from 'react-native-paper';

const MyCheckbox = ({ item, selectedProducts, toggleProductSelection }) => {
  return (
    <Checkbox.Item
      label={item.name}
      status={
        selectedProducts.includes(item.id) ? 'checked' : 'unchecked'
      }
      onPress={() => toggleProductSelection(item.id)}
      uncheckedColor="gray" // Customize the color as needed
      checkedColor="green" // Customize the color as needed
      color="green"
      uncheckedIcon={() => (
        <View style={{ width: 24, height: 24, borderWidth: 1, borderColor: 'gray' }}>
          {/* Custom unchecked icon or image */}
          {/* You can use an Image component or any other custom component here */}
          <Text style={{ fontSize: 20, color: 'gray' }}>X</Text>
        </View>
      )}
      checkedIcon={() => (
        <View style={{ width: 24, height: 24, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center' }}>
          {/* Custom checked icon or image */}
          {/* You can use an Image component or any other custom component here */}
          <Text style={{ fontSize: 20, color: 'white' }}>✓</Text>
        </View>
      )}
    />
  );
};

export default MyCheckbox;
