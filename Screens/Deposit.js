import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  Clipboard,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDatabase, ref, set, push, onValue } from 'firebase/database';
import auth from '../config';
import { useClipboard } from '@react-native-community/clipboard';
import { Picker } from '@react-native-picker/picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Deposit = ({ navigation }) => {
  const userId = auth.currentUser?.uid;
  const [amount, setAmount] = useState('Enter amount');
  const [isCopied, setIsCopied] = useState(false);
  const [trxId, setTrxId] = useState('');
  const [selectedChain, setSelectedChain] = useState('bnb'); // Default selected chain
  const [walletAddresses, setWalletAddresses] = useState({});
  const [address, setAddress] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const walletRef = ref(db, 'addresses');
    onValue(walletRef, (snapshot) => {
      if (snapshot.exists()) {
        const addressesData = snapshot.val();
        setWalletAddresses(addressesData);
        setAddress(addressesData[selectedChain]?.wallet || '');
      }
    });
  }, [selectedChain]);

  const copyToClipboard = () => {
    Clipboard.setString(address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 4000);
  };

  const handleAmountChange = (value) => {
    setAmount(value);
  };

  const handleButtonClick = (value) => {
    setAmount(value.toString());
  };

  function post_request() {
    if (amount === '' || trxId === '') {
      return Alert.alert('Please Enter Amount and TrxId of the transfer to proceed.');
    }

    console.log(auth.currentUser.displayName);
    const db = getDatabase();
    const request = ref(db, 'requests');
    const newRequestRef = push(request);
    const reqId = newRequestRef.key;
    console.log(reqId);
    set(newRequestRef, {
      amount: amount,
      status: 'Pending',
      id: userId,
      request: 'Deposit',
      timestamp: Date.now(),
      requestId: reqId,
      username: auth.currentUser.displayName,
      trxId: trxId,
      chain:selectedChain
    });

    Alert.alert('Request posted. Please wait for response');
    console.log('success');
    navigation.goBack();
  }

  return (
    <View style={styles.modal}>
      <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 20, justifyContent: 'space-between', alignItems: 'center' }}>
        <AntDesign name='left' size={24} onPress={() => navigation.goBack()} />
        <Image source={require('../assets/TrustNOVALogo.png')} style={{ height: 60, width: 80 }} />
      </View>

      <Text style={styles.modal_txt}>Send your funds from your wallet</Text>
      <Text style={styles.subHead}>You must transfer from your centralized exchange account</Text>

      <Text style={styles.detail_txt}>Transfer Details</Text>
      <View style={styles.add_container}>
        <Text style={styles.add_txt}>Chain</Text>
        <Picker
          selectedValue={selectedChain}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedChain(itemValue)}
        >
          {Object.keys(walletAddresses).map((chain, index) => (
            <Picker.Item key={index} label={chain.toUpperCase()} value={chain} />
          ))}
        </Picker>
      </View>
      <View style={styles.add}>
        <View style={styles.icon_container}>
          <Text style={styles.add_txt}> Wallet Address</Text>
          <MaterialCommunityIcons name={isCopied ? 'check' : 'content-copy'} size={20} onPress={copyToClipboard} />
        </View>

        <View style={styles.add_container}>
          <Text style={styles.add_link}> {address}</Text>
        </View>
        <Text style={styles.add_txt}>
          Amount
        </Text>

        <View style={styles.add_container}>
          <TextInput style={styles.amountInput} placeholder={amount} placeholderTextColor="black" onChangeText={handleAmountChange} editable={false} />
        </View>

        <View style={styles.setnumber_container}>
          <TouchableOpacity onPress={() => handleButtonClick(200)} style={styles.num_btn}>
            <Text>200</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonClick(400)} style={styles.num_btn}>
            <Text>400</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonClick(600)} style={styles.num_btn}>
            <Text>600</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonClick(800)} style={styles.num_btn}>
            <Text>800</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonClick(1000)} style={styles.num_btn}>
            <Text>1000</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonClick(1500)} style={styles.num_btn}>
            <Text>1500</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonClick(2000)} style={styles.num_btn}>
            <Text>2000</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.add_container}>
          <TextInput style={styles.amountInput} placeholder="Trx Id" placeholderTextColor="#9B9B9B" onChangeText={(text) => setTrxId(text)} value={trxId} />
        </View>

        <TouchableOpacity style={styles.transfer_btn} onPress={post_request}>
          <Text style={styles.btn_txt}>
            I made the transfer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Deposit;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: windowWidth * 0.05,
  },
  modal_txt: {
    fontSize: 22,
    fontWeight: '400'
  },
  subHead: {
    marginVertical: windowHeight * 0.03,
    fontSize: 16,
    color: 'grey',
  },
  detail_txt: {
    marginBottom: windowHeight * 0.03,
    fontWeight: '500'
  },
  add: {
    backgroundColor: '#EDEDED',
    height: windowHeight * 0.5,
    padding: windowWidth * 0.05,
    borderRadius: 10
  },
  add_txt: {
    fontWeight: '600'
  },
  icon_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  add_container: {
    borderBottomWidth: 1,
    marginBottom: windowHeight * 0.01
  },
  add_link: {
    margin: windowWidth * 0.03,
    marginBottom: windowHeight * 0.01
  },
  amountInput: {
    marginTop: windowHeight * 0.025,
  },
  setnumber_container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  num_btn: {
    backgroundColor: 'lightblue',
    margin: windowHeight * 0.005,
    padding: windowHeight * 0.009,
    marginVertical: windowHeight * 0.009,
    borderRadius: 5
  },
  transfer_btn: {
    alignSelf: 'center',
    width: windowWidth * 0.8,
    backgroundColor: '#31A062',
    height: windowHeight * 0.07,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  btn_txt: {
    color: 'white',
    fontWeight: '700'
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
