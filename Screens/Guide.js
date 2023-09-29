import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { primary } from '../color';
const Guide = ({navigation}) => {
  return (
    <ScrollView style={styles.modal}>
      <AntDesign name='left' style={{ marginTop:35, marginBottom:20}} size={24} onPress={()=>navigation.goBack()} />
      <Text style={styles.heading}>
        How to invest in App?
      </Text>
      <View style={styles.instructionContainer}>
      <Text style={styles.instructionTxt}>
        1. Choose a plan to you want to invest in. 
        {'\n'}
        2. Deposit the amount in usdt through Account/Deposit screen.
        {'\n'}
        3. Select and activate plan by pressing on invest button
        {'\n'}
        4. You can withdraw your earnings when earning reach $50
      </Text>
      </View>
      <Text style={styles.withdraw_title}>
        Withraw
      </Text>
      <View style={styles.instructionContainer}>
      <Text style={styles.instructionTxt}>
        1. Initialize withdraw request through Account/Withdraw {'\n'}
        2. Admin will repond to your request within 24-72 hours {'\n'}
        3. Transaction request status will be 'Complete' when admin has sent the requested amount. 
      </Text>
      </View>
      <Text style={styles.withdraw_title}>
        Deposit
      </Text>
      <View style={styles.instructionContainer}>
      <Text style={styles.instructionTxt}>
        1. Copy usdt reciver address from deposit screen. {'\n'}
        2. First, send the requested amount and then press 'I made the transfer' button {'\n'}
        3. Your request will be shown in Transactions screen. {'\n'}
        4. When admin has verified the transfer, status will be 'Complete'. {'\n'}
        5. Deposited amont will be reflected in account total asset
      </Text>
      </View>
      <Text style={styles.withdraw_title}>
        Warnings
      </Text>
      <View style={styles.instructionContainer}>
      <Text style={styles.instructionTxt}>
        1. Please confirm your usdt address before making withdraw request.{'\n'}
        2. Send exact amount when sending deposit amount. {'\n'}
        3. if request is bogus, it will be 'rejected'
      </Text>
      </View>
    </ScrollView>
  )
}

export default Guide

const styles = StyleSheet.create({
  modal:{
    flex: 1,
    padding: 10,
},
heading:{
    fontWeight:'600',
    fontSize:20,
    alignSelf:'center'
},
withdraw_title:{
  fontWeight:'600',
  color:primary
},
instructionContainer:{
  margin:10
},
instructionTxt:{
  fontSize:14 
}
})