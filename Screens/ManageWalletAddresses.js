import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const ManageWalletAddresses = ({ navigation }) => {
  const [walletAddresses, setWalletAddresses] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const walletRef = ref(db, 'addresses');
    onValue(walletRef, (snapshot) => {
      if (snapshot.exists()) {
        const addressesData = snapshot.val();
        setWalletAddresses(addressesData);
        setIsLoading(false);
      }
    });
  }, []);

  const handleSave = () => {
    const db = getDatabase();
    const walletRef = ref(db, 'addresses');
    set(walletRef, walletAddresses)
      .then(() => {
        alert('Wallet addresses updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating wallet addresses:', error);
        alert('Failed to update wallet addresses. Please try again later.');
      });
  };

  const handleEditAddress = (chain, text) => {
    setWalletAddresses({
      ...walletAddresses,
      [chain]: { wallet: text },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesign name='left' size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Manage Wallet Addresses</Text>
      </View>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        Object.entries(walletAddresses).map(([chain, address], index) => (
          <View key={index} style={styles.addressContainer}>
            <Text style={styles.label}>{chain.toUpperCase()} Address:</Text>
            <TextInput
              style={styles.input}
              value={address.wallet}
              onChangeText={(text) => handleEditAddress(chain, text)}
            />
          </View>
        ))
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  addressContainer: {
    marginBottom: 20,
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ManageWalletAddresses;
