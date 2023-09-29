import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, ActivityIndicator, Dimensions, StyleSheet, Alert  } from 'react-native';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import {  set, ref, getDatabase, update, onValue} from 'firebase/database';
import auth from '../config';

const windowWidth = Dimensions.get('window').width;

const windowHeight = Dimensions.get('window').height;

const PlanSelection = ({ navigation, route}) => {
  const { selectedPlan, balance, interest } = route.params;
  const [isConfirming, setIsConfirming] = useState(false);
  console.log( selectedPlan,balance, interest)
  const user = auth.currentUser;
  const [isEmailVerified, setIsEmailVerified] = useState(user?.emailVerified || false);
  const [isDocumentVerified, setIsDocumentVerified] = useState(false);
  console.log(isEmailVerified, isDocumentVerified)
  const db = getDatabase();
  useEffect(() => {
    // Listen for changes in email verification status
    const unsubscribe = auth.onAuthStateChanged((updatedUser) => {
      if (updatedUser) {
        setIsEmailVerified(updatedUser.emailVerified);
      }
    });

    // Get the document verification status
    const getVerificationStatus = () => {
      const userRef = ref(db, `Documents/${auth.currentUser.displayName}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const verificationStatus = data.verified;
          setIsDocumentVerified(verificationStatus === true);
         
        } else {
          setIsDocumentVerified(false);
        }
      });
    };

    getVerificationStatus();
    return () => unsubscribe();
  }, []);



  const Confirm = (plan, interest, balance) => {
    if(isEmailVerified === false){
      Alert.alert('Please Complete Email Verification In order to invest in Nova Trust')
      return
    }
    else if(isDocumentVerified === false){
      Alert.alert('Please Complete Document Verification In order to invest in Nova Trust')
      return
    }else{
    console.log('props',balance, plan, interest)
    balance = balance-plan;
    const userId = auth.currentUser.displayName
    const userRef = ref(getDatabase(), `users/${userId}`);
    const currentTime = new Date();
    update(userRef, {
      plan: plan,
      balance: balance,
      lastUpdate: currentTime.toISOString(),
      earned: 0,
    });
    console.log(`User confirmed ${plan} plan selection`);
    navigation.goBack();
    Alert.alert('Plan Subscribed Successfully')
  }
  };



  const handleConfirm = () => {
    if(balance>selectedPlan){
    setIsConfirming(true);
    Confirm(selectedPlan, interest, balance);

    }  
    else{
        Alert.alert('Insufficient Balance')
        console.log('insufficient balance')
    }
  };


  return (
    <View  animationType="slide" transparent={true} style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin:windowWidth*0.01}}>
        <View style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Confirm Selection</Text>
          <Text style={{ marginBottom: 20 }}>You have selected the {selectedPlan}$ plan. Are you sure you want to proceed?</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Ionicons name="close-circle-outline" size={30} color="#C7C7CC" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm}>
              {isConfirming ? (
                <ActivityIndicator color="#007AFF" />
              ) : (
                <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PlanSelection;

const styles = StyleSheet.create({
    container:{
        flex:1,
        margin: windowWidth*0.001,
        padding:windowHeight*0.01
    }
})