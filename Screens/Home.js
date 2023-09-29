import { SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, ImageBackground, Image, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { background, primary } from '../color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '../config';
import { getDatabase, ref, onValue, off, update } from "firebase/database";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = ({ navigation }) => {
  const [earned, setEarned] = useState(0);
  const [balance, setBalance] = useState(0);
  const [refferalEarning, setRefferalEarning] = useState(0)
  const [loading, setLoading] = useState(true);
  
  const openModal = () => {
    navigation.navigate('AllPlans', { balance: balance })
  }

  const db = getDatabase();
  useEffect(() => {
    // Check for the blocked status when the component is mounted

    const displayName = auth.currentUser?.displayName;
    const userRef = ref(db, `users/${displayName}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      const balance = data.balance;
      const earned = data.earned;
      const refferalEarned = data.refferalEarning
      setRefferalEarning(refferalEarned)
      setBalance(balance);
      setEarned(earned);
      setLoading(false)
    });
    // Clean up the listener when the component unmounts
  }, [db]);


  return (
    <SafeAreaView style={styles.container}>
      {
        loading ?
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator />
          </View>
          :
          <View>
            <ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: windowHeight * 0.05, marginHorizontal: windowWidth * 0.05, }}>
                <Text style={styles.welcome_txt}>Welcome to Nova Trust</Text>
                <Image source={require('../assets/TrustNOVALogo.png')} style={{ height: 60, width: 80 }} />
              </View>
              <View style={styles.total_card}>
                <Text style={styles.total_txt}>Your total asset portfollio</Text>
                <View style={styles.btn_container}>
                  <View>
                    <Text style={styles.amout}>
                      Total: ${balance}
                    </Text>
                    <Text style={styles.earned}>
                      Earned : ${earned}
                    </Text>
                    <Text style={[styles.earned, {marginTop:5}]}>
                      Refferal Earning : ${refferalEarning}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.invest_btn} onPress={openModal}>
                    <Text style={styles.invest_btn_txt}>
                      Invest now
                    </Text>
                  </TouchableOpacity>

                </View>
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: 30 }} onPress={() => navigation.navigate('Guide')}>
                <Image source={require('../assets/notifications.png')} style={{ height: 20, width: 20 }} />
                <Text style={styles.last_txt}>
                  Check Announcements
                </Text>
              </TouchableOpacity>

              <View style={styles.tabContainer}>
                {/* Withdraw */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('Withdraw', { balance })}
                >
                  <Ionicons name="cash" size={40} color='#bc4749' />
                  <Text style={[styles.buttonText, { color: '#bc4749' }]}>Withdraw</Text>
                </TouchableOpacity>

                {/* Deposit */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('Deposit')}
                >
                  <Ionicons name="ios-add-circle" size={40} color='#a3b18a' />
                  <Text style={[styles.buttonText, { color: '#a3b18a' }]}>Deposit</Text>
                </TouchableOpacity>

                {/* Referrals */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('Refferals')}
                >
                  <Ionicons name="people" size={40} color='#f4a261' />
                  <Text style={[styles.buttonText, { color: '#f4a261' }]}>Referrals</Text>
                </TouchableOpacity>

                {/* Learning */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleAction('Learning')}
                >
                  <Ionicons name="book" size={40} color='#48cae4' />
                  <Text style={[styles.buttonText, { color: '#48cae4' }]}>Learning</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
      }

    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background
  },
  welcome_txt: {
    fontSize: 24,
    fontWeight: '800',
  },
  total_card: {
    height: windowHeight * 0.25,
    width: windowWidth * 0.87,
    backgroundColor: primary,
    alignSelf: 'center',
    borderRadius: 15,
    margin: 20
  },
  total_txt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginTop: windowHeight * 0.04,
    marginLeft: windowWidth * 0.05,
  },
  btn_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: windowHeight * 0.017
  },
  amout: {
    fontSize: 24,
    fontWeight: '600',
    color: background,

  },
  invest_btn: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.30,
    backgroundColor: background,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: windowWidth * 0.15,
    justifyContent: 'center',
  },
  invest_btn_txt: {
    color: primary,
    fontSize: 15,
    fontWeight: '500'
  },
  middle_container: {
    flexDirection: 'row',
    margin: windowWidth * 0.05,
    alignItems: 'center'
  },
  middle_txt: {
    fontWeight: '600',
    fontSize: 22
  },
  all_btn: {
    alignContent: 'center',
    marginLeft: windowWidth * 0.4

  },
  all_btn_txt: {
    fontSize: 20,
    color: 'red'
  },

  img_card: {
    height: windowHeight * 0.25,
    width: windowWidth * 0.32,
    backgroundColor: '#DD9939',
    margin: windowWidth * 0.06,
    borderRadius: 20,
    marginRight: 0,
    justifyContent: 'center',
    marginTop: 0,
    alignItems: 'center',
  },
  last_txt: {
    fontSize: 14,
    marginBottom: 5,

    marginLeft: windowWidth * 0.05
  },
  guide_btn: {
    marginHorizontal: windowWidth * 0.05,
    padding: windowHeight * 0.02,
    borderRadius: 10,
    borderBottomWidth: 1
  },
  guide_title: {
    fontSize: 18,
    fontWeight: '700'
  },
  guide_txt: {

  },
  gold_img: {
    height: windowHeight * 0.25,
    width: windowWidth * 0.32,
    backfaceVisibility: 'hidden',
    backgroundColor: 'transparent',
    resizeMode: 'cover',
    borderRadius: 15,
  },

  earned: {
    color: '#fff'
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  button: {
    width: '45%', // Adjust the width to fit your layout
    height: 150, // Adjust the height as needed
    backgroundColor: '#edede9', // Customize the button's background color
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Adjust the margin as needed
  },
  buttonText: {
    color: primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10, // Adjust the margin as needed
  },
});