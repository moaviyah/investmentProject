import { SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, ScrollView, Modal, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { background } from '../color';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { signOut } from "firebase/auth";
import auth from '../config';

import { getDatabase, ref, onValue, off, update } from "firebase/database";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const Account = ({ navigation }) => {
  const [link, setLink] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F')

  const name = auth.currentUser?.displayName;
  const email = auth.currentUser?.email
  const [balance, setBalance] = useState()
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('signed out')
        navigation.navigate('Welcome')
      })
      .catch((error) => {
        console.log("Error logging out:", error);
      });
  }

  useEffect(() => {
    const db = getDatabase();
    const userId = auth.currentUser?.displayName;
    const userRef = ref(db, `users/${userId}`);
    const Unsubscribe = () => onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      const balance = data.balance
      console.log(data.balance);
      setBalance(balance);
    });

    return () => {
      Unsubscribe
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView >
        <View style={{ flexDirection: 'row', marginTop: 35, justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20 }}>
          <Text style={styles.head}>Profile</Text>
          <Image source={require('../assets/TrustNOVALogo.png')} style={{ height: 60, width: 80 }} />
        </View>
        <TouchableOpacity style={styles.profile_button}>
          <AntDesign name='profile' size={28} color='#FF9500' />
          <View style={styles.mid_btn_container}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}> {email}</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.account_head}>Account</Text>

        <TouchableOpacity style={styles.account_btn} onPress={() => navigation.navigate('CurrentPlan')}>
          <Image source={require('../assets/return-of-investment.png')} style={{ height: 28, width: 28 }} />
          <Text style={styles.btn_head}>My Investments</Text>
          <Ionicons name='chevron-forward-outline' size={24} style={styles.forward_icon}></Ionicons>
        </TouchableOpacity>

        <TouchableOpacity style={styles.account_btn} onPress={() => navigation.navigate('Verification')}>
          <Image source={require('../assets/verification.png')} style={{ height: 28, width: 28 }} />
          <Text style={styles.btn_head}>Account Verification</Text>
          <Ionicons name='chevron-forward-outline' size={24} style={styles.forward_icon}></Ionicons>
        </TouchableOpacity>

        <TouchableOpacity style={styles.account_btn} onPress={() => navigation.navigate('CurrentPlan')}>
          <Image source={require('../assets/technical-support.png')} style={{ height: 28, width: 28 }} />
          <Text style={styles.btn_head}>Support</Text>
          <Ionicons name='chevron-forward-outline' size={24} style={styles.forward_icon}></Ionicons>
        </TouchableOpacity>

        <TouchableOpacity style={styles.account_btn} onPress={() => navigation.navigate('AboutUs')}>
          <Image source={require('../assets/info.png')} style={{ height: 28, width: 28 }} />
          <Text style={styles.btn_head}>About Us</Text>
          <Ionicons name='chevron-forward-outline' size={24} style={styles.forward_icon}></Ionicons>
        </TouchableOpacity>

        <TouchableOpacity style={styles.account_btn} onPress={() => navigation.navigate('Privacy')}>
          <Image source={require('../assets/insurance.png')} style={{ height: 28, width: 28 }} />
          <Text style={styles.btn_head}>Privacy Policy</Text>
          <Ionicons name='chevron-forward-outline' size={24} style={styles.forward_icon}></Ionicons>
        </TouchableOpacity>

        <TouchableOpacity style={styles.account_btn} onPress={() => navigation.navigate('UserAgreement')}>
          <Image source={require('../assets/agreement.png')} style={{ height: 28, width: 28 }} />
          <Text style={styles.btn_head}>User Agreement</Text>
          <Ionicons name='chevron-forward-outline' size={24} style={styles.forward_icon}></Ionicons>
        </TouchableOpacity>

        <TouchableOpacity style={styles.account_btn} onPress={() => navigation.navigate('Admin')}>
          <Image source={require('../assets/agreement.png')} style={{ height: 28, width: 28 }} />
          <Text style={styles.btn_head}>Admin</Text>
          <Ionicons name='chevron-forward-outline' size={24} style={styles.forward_icon}></Ionicons>
        </TouchableOpacity>


        <TouchableOpacity onPress={handleSignOut} style={[styles.account_btn, { width: windowWidth * 0.6, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }]}>
          <MaterialCommunityIcons name='logout' size={28} color={'red'} />
          <Text style={[styles.btn_head, { color: 'red', marginLeft: windowWidth * 0.03 }]}>Log out</Text>
        </TouchableOpacity>



      </ScrollView>
    </SafeAreaView>
  )
}

export default Account

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  head: {
    fontSize: 26,
    fontWeight: '800'
  },
  profile_button: {
    flexDirection: 'row',
    height: windowHeight * 0.1,
    backgroundColor: background,
    marginHorizontal: windowWidth * 0.05,
    borderRadius: 10,
    marginVertical: windowHeight * 0.03,
    alignItems: "center",
    paddingHorizontal: windowWidth * 0.05
  },
  account_btn: {
    flexDirection: 'row',
    height: windowHeight * 0.1,
    backgroundColor: background,
    marginHorizontal: windowWidth * 0.05,
    borderRadius: 10,
    marginVertical: windowHeight * 0.01,
    alignItems: "center",
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth * 0.05
  },
  forward_icon: {
    marginLeft: windowWidth * 0.2
  },
  name: {
    fontWeight: 'bold'
  },
  mid_btn_container: {
    padding: windowHeight * 0.01
  },
  account_head: {
    marginLeft: windowWidth * 0.05,
    fontSize: 26,
    fontWeight: '600',
    marginBottom: windowHeight * 0.02
  },
  btn_head: {
    fontSize: 18,
    fontWeight: '500',
    alignSelf: 'auto',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: windowHeight * 0.05,
  },
  modal_txt: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  link: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: windowHeight * 0.05
  }
})