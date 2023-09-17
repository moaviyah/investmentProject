import { StyleSheet, Text, View, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {  set, ref, getDatabase, update} from 'firebase/database';
import auth from '../config';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const All_plans = ({navigation, balance}) => {
  const [rate, setRate] =useState(0)
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePlanSelect = (plan,inRate) => {
    setRate(inRate)
    setSelectedPlan(plan);
    navigation.navigate('PlanSelection',{selectedPlan, balance, interest : {rate}, Confirm} )
  };
//   <PlanSelectionModal
//   isVisible={isModalVisible}
//   selectedPlan={selectedPlan}
//   onClose={handleCancel}
//   onConfirm={handleConfirm}
//   balance={balance}
//   interest={rate}
// />

  const Confirm = (plan, interest) => {

    balance = balance-plan;
    const userId = auth.currentUser.uid
    const userRef = ref(getDatabase(), `users/${userId}`);
    const currentTime = new Date();
    console.log(interest)
    update(userRef, {
      plan: plan,
      balance: balance,
      lastUpdate: currentTime.toISOString(),
      interestRate: rate,
      earned: rate,
    });
    console.log(`User confirmed ${plan} plan selection`);
    navigation.goBack();
  
  };

  // const handleCancel = () => {
  //   setSelectedPlan(null);
  //   setIsModalVisible(false);
  // };


  return (

    <ScrollView>
      <SafeAreaView style={styles.container}>
        
        <AntDesign name='close' style={styles.closeIcon} size={22} onPress={()=>navigation.goBack()} />
        <Text style={styles.head}>Investment Plans</Text>

        <View style={styles.listContainer}>
          <Text style={styles.listTxt}>Investment</Text>
          <Text style={styles.listTxt}>Daily profits</Text>
        </View>

        <TouchableOpacity style={styles.btnContainer} onPress={() => handlePlanSelect(50,0.5)}>
          <Text style={styles.btnTxt}>50 USDT</Text>
          <Text style={styles.btnTxt}>0.5  USDT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnContainer} onPress={() => handlePlanSelect(60,1)}>
          <Text style={styles.btnTxt}>60 USDT</Text>
          <Text style={styles.btnTxt}>1 USDT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnContainer} onPress={() => handlePlanSelect(100,1.5)}>
          <Text style={styles.btnTxt}>100 USDT</Text>
          <Text style={styles.btnTxt}>1.5 USDT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnContainer, {backgroundColor:'#787878'}]} onPress={() => handlePlanSelect(200, 3)}>
          <Text style={styles.btnTxt}>200 USDT</Text>
          <Text style={styles.btnTxt}>3 USDT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnContainer, {backgroundColor:'#787878'}]} onPress={() => handlePlanSelect(300, 6)}>
          <Text style={styles.btnTxt}>300 USDT</Text>
          <Text style={styles.btnTxt}>6 USDT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnContainer, {backgroundColor:'#787878'}]} onPress={() => handlePlanSelect(400, 8)}>
          <Text style={styles.btnTxt}>400 USDT</Text>
          <Text style={styles.btnTxt}>8 USDT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnContainer, {backgroundColor:'#40519D'}]} onPress={() => handlePlanSelect(500, 10)}>
          <Text style={styles.btnTxt}>500 USDT</Text>
          <Text style={styles.btnTxt}>10 USDT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnContainer, {backgroundColor:'#40519D'}]} onPress={() => handlePlanSelect(600, 12)}>
          <Text style={styles.btnTxt}>600 USDT</Text>
          <Text style={styles.btnTxt}>12 USDT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnContainer, {backgroundColor:'#40519D'}]} onPress={() => handlePlanSelect(800, 24)}>
          <Text style={styles.btnTxt}>800 USDT</Text>
          <Text style={styles.btnTxt}>24 USDT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnContainer, {backgroundColor:'#40519D'}]} onPress={() => handlePlanSelect(1000, 30)}>
          <Text style={styles.btnTxt}>1000 USDT</Text>
          <Text style={styles.btnTxt}>30 USDT</Text>
        </TouchableOpacity>

     

      </SafeAreaView>
    </ScrollView>

  )
}

export default All_plans

const styles = StyleSheet.create({
  container:{

  },
  closeIcon:{
    alignSelf: 'flex-end' 
  },
  head:{ 
    alignSelf: 'center', 
    fontSize: 27 
  },
  listContainer:{
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    marginVertical: windowHeight * 0.03,
  },
  listTxt:{ 
    fontSize: 22, 
    fontWeight: 'bold',
  },
  btnContainer:{ 
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    marginVertical: windowHeight * 0.01, 
    backgroundColor: '#DCA846', 
    marginHorizontal: windowWidth * 0.05, 
    borderRadius: 10, 
    padding: windowWidth * 0.05 
  },
  btnTxt:{ 
    fontSize: 22, 
    color: '#fff', 
    fontWeight: 'bold' 
  }
})