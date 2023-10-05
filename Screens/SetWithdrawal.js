import { getAuth } from 'firebase/auth';
import { getDatabase, ref, update } from 'firebase/database';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import your desired icon library for the back button
import { primary } from '../color';

const SetWithdrawal = ({ navigation }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [pin, setPin] = useState('');
  const db = getDatabase();
  const auth = getAuth();

  const handleSave = () => {
    const userId = auth.currentUser?.displayName;
    if (!userId) {
      return;
    }

    const userRef = ref(db, `users/${userId}`);
    const userData = {
      withdrawalAddress: walletAddress,
      withdrawalPIN: pin,
    };

    update(userRef, userData)
      .then(() => {
        // Data successfully saved to the database
        Alert.alert('Success', 'Withdrawal information saved successfully.');
        navigation.navigate('Home')
      })
      .catch((error) => {
        console.error('Error saving data:', error);
        Alert.alert('Error', 'Failed to save withdrawal information. Please try again.');
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>Set Withdrawal Information</Text>
      <Text style={{ color: 'grey', textAlign: 'justify' }}>
        You can only save these for one time, so make sure withdrawal address is correct, and you remember the PIN you set.
      </Text>
      <Text style={styles.label}>USDT (BEP-20) Wallet Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your wallet address"
        value={walletAddress}
        onChangeText={(text) => setWalletAddress(text)}
      />
      <Text style={styles.label}>4-Digit PIN for Withdrawal</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your 4-digit PIN"
        value={pin}
        onChangeText={(text) => setPin(text)}
        keyboardType="numeric"
        maxLength={4}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SetWithdrawal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingVertical: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
