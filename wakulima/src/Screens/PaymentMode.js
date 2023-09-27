import React, { useState } from "react";
import { View, Text, Button, Radio, RadioGroup } from "react-native";

const PaymentMode = () => {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("creditCard");
  const paymentModes = [
    { label: "Credit Card", value: "creditCard" },
    { label: "Debit Card", value: "debitCard" },
    { label: "PayPal", value: "paypal" },
    // Add more payment modes as needed
  ];

  const handlePayment = () => {
    // Implement payment processing logic based on the selected payment mode
    switch (selectedPaymentMode) {
      case "creditCard":
        // Implement credit card payment logic
        break;
      case "debitCard":
        // Implement debit card payment logic
        break;
      case "paypal":
        // Implement PayPal payment logic
        break;
      default:
        // Handle other payment modes
        break;
    }
  };

  return (
    <View>
      <Text>Select Payment Mode</Text>
      <RadioGroup
        selectedIndex={paymentModes.findIndex((mode) => mode.value === selectedPaymentMode)}
        onChange={(index) => setSelectedPaymentMode(paymentModes[index].value)}
      >
        {paymentModes.map((mode) => (
          <Radio key={mode.value}>{mode.label}</Radio>
        ))}
      </RadioGroup>
      <Button title="Pay Now" onPress={handlePayment} />
    </View>
  );
};

export default PaymentMode;
