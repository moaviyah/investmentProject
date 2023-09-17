import React, { useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDatabase, ref, set, serverTimestamp, push } from "firebase/database";
import auth from '../config';
import {useClipboard} from '@react-native-community/clipboard';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Deposit = ({ navigation }) => {
  const userId = auth.currentUser?.uid;
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('0x6fBEb69011a02216a3Ed618C26fD5B71fC401193')
  const [isCopied, setIsCopied] = useState(false);
  const [time, setTime] =useState()
  const [data, setString] = useState();
  useEffect(() => {

    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    setTime(
      hours + ':' + min
    );
  }, []);

  const copyToClipboard = () => {
    // Clipboard.setStringAsync('0x6fBEb69011a02216a3Ed618C26fD5B71fC401193');
    setString(address);
    console.log('success')
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
    const db = getDatabase();

    const request = ref(db, "requests");
    const newRequestRef = push(request);
    const reqId = newRequestRef.key;
    console.log(reqId);

    set(newRequestRef, {
      amount: amount,
      status: 'pending',
      id: userId,
      request: 'Deposit',
      timestamp:time,
      requestId: reqId
  });

    Alert.alert('Request posted. Please wait for response')
    console.log('success');
    navigation.goBack();
  }

  return (
    <View style={styles.modal}>

      <AntDesign name='close' style={{ alignSelf: 'flex-end' }} size={22} onPress={()=>navigation.goBack()} />

      <Text style={styles.modal_txt}>Send your funds from your wallet</Text>
      <Text style={styles.subHead}>You must transfer from your centralized exchange account</Text>

      <Text style={styles.detail_txt}>Transfer Details</Text>

      <View style={styles.add}>
        <View style={styles.icon_container}>
          <Text style={styles.add_txt}> Wallet Address</Text>
          <MaterialCommunityIcons name={isCopied ? 'check' : 'content-copy'} size={20} onPress={copyToClipboard}/>
        </View>

        <View style={styles.add_container}>
          <Text style={styles.add_link}> {address}</Text>
        </View>
        <Text style={styles.add_txt}>
          Amount
        </Text>

        <View style={styles.add_container}>
          <TextInput style={styles.amountInput} placeholder="Enter amount" placeholderTextColor="#9B9B9B" onChangeText={handleAmountChange} value={amount} />
        </View>

        <View style={styles.setnumber_container}>
          <TouchableOpacity onPress={() => handleButtonClick(50)} style={styles.num_btn}>
            <Text>50</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonClick(100)} style={styles.num_btn}>
            <Text>100</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonClick(200)} style={styles.num_btn}>
            <Text>200</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonClick(500)} style={styles.num_btn}>
            <Text>500</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.transfer_btn} onPress={post_request}>
            <Text style={styles.btn_txt}>
                I made the transfer
            </Text>
        </TouchableOpacity>
      </View>



    </View>
  )
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
  transfer_btn:{
    alignSelf:'center',
    width:windowWidth*0.8,
    backgroundColor:'#31A062',
    height:windowHeight* 0.07,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    marginTop:windowHeight*0.09
  },
  btn_txt:{
    color:'white',
    fontWeight:'700'
  }
})