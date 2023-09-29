import { StyleSheet, Text, View, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { set, ref, getDatabase, update } from 'firebase/database';
import auth from '../config';
import { primary } from '../color';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const All_plans = ({ navigation, route }) => {
  const { balance } = route.params
  const handlePlanSelect = (plan, inRate) => {
    navigation.navigate('PlanSelection', { selectedPlan: plan, balance: balance, interest: inRate })
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginTop: 35, marginBottom: 20 }}>
          <AntDesign name='left' size={24} onPress={() => navigation.goBack()} />
          <Text style={styles.head}>Investment Plans</Text>
        </View>


        <TouchableOpacity style={styles.btnContainer} onPress={() => handlePlanSelect(200, 0.5)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>Plan 1</Text>
            <AntDesign name='right' size={24} />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:5}}>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Investment</Text>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Returns upto</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={styles.btnTxt}>$ 200</Text>
          <Text style={[styles.btnTxt, {color:primary}]}>$ 1000</Text>
          </View> 
        </TouchableOpacity>


        <TouchableOpacity style={styles.btnContainer} onPress={() => handlePlanSelect(400, 1)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>Plan 2</Text>
            <AntDesign name='right' size={24} />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:5}}>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Investment</Text>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Returns upto</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={styles.btnTxt}>$ 400</Text>
          <Text style={[styles.btnTxt, {color:primary}]}>$ 2000</Text>
          </View> 
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnContainer} onPress={() => handlePlanSelect(600, 1.5)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>Plan 3</Text>
            <AntDesign name='right' size={24} />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:5}}>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Investment</Text>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Returns upto</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={styles.btnTxt}>$ 600</Text>
          <Text style={[styles.btnTxt, {color:primary}]}>$ 3000</Text>
          </View> 
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnContainer,]} onPress={() => handlePlanSelect(800, 3)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>Plan 4</Text>
            <AntDesign name='right' size={24} />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:5}}>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Investment</Text>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Returns upto</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={styles.btnTxt}>$ 800</Text>
          <Text style={[styles.btnTxt, {color:primary}]}>$ 4000</Text>
          </View> 
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnContainer,]} onPress={() => handlePlanSelect(1000, 6)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>Plan 5</Text>
            <AntDesign name='right' size={24} />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:5}}>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Investment</Text>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Returns upto</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={styles.btnTxt}>$ 1000</Text>
          <Text style={[styles.btnTxt, {color:primary}]}>$ 5000</Text>
          </View> 
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnContainer,]} onPress={() => handlePlanSelect(1500, 8)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>Plan 6</Text>
            <AntDesign name='right' size={24} />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:5}}>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Investment</Text>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Returns upto</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={styles.btnTxt}>$ 1500</Text>
          <Text style={[styles.btnTxt, {color:primary}]}>$ 7500</Text>
          </View> 
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnContainer,]} onPress={() => handlePlanSelect(2000, 10)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>Plan 7</Text>
            <AntDesign name='right' size={24} />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:5}}>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Investment</Text>
            <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Returns upto</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={styles.btnTxt}>$ 2000</Text>
          <Text style={[styles.btnTxt, {color:primary}]}>$ 10000</Text>
          </View> 
        </TouchableOpacity>

      </SafeAreaView>
    </ScrollView>

  )
}

export default All_plans

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: 10
  },
  head: {
    alignSelf: 'center',
    fontSize: 22,
    marginLeft: 50,
    fontWeight: '600',
  },
  btnContainer: {
    justifyContent: 'space-evenly',
    marginVertical: windowHeight * 0.01,
    backgroundColor: '#fff',
    marginHorizontal: windowWidth * 0.05,
    borderRadius: 10,
    padding: windowWidth * 0.05,
    elevation: 1
  },
  btnTxt: {
    fontSize: 18,
    fontWeight: '500'
  }
})