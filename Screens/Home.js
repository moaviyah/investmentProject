import { SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, ImageBackground, Image, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { background, primary } from '../color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '../config';
import { getDatabase, ref, onValue, off , update } from "firebase/database";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = ({ navigation }) => {
  const username = auth.currentUser?.displayName
  const [earned, setEarned] = useState(0);

  const openModal = () => {
    console.log('hello')
    navigation.navigate('AllPlans', {balance})
  }

  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const userId = auth.currentUser?.uid;
    const userRef = ref(db, `users/${userId}`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      const plan = data.plan
      console.log(plan)
      if(plan>0){
      const currentTime = new Date();
      const lastUpdateTime = new Date(data.lastUpdate);
      const timeDiffInMs = currentTime - lastUpdateTime;
      const timeDiffInHrs = timeDiffInMs / (1000 * 60 * 60);
      if (timeDiffInHrs >= 24){
        const newBalance = data.balance + data.interestRate
        const newEarned = data.earned + data.interestRate
        update(ref(db, `users/${userId}`), 
        {
          balance: newBalance,
          earned: newEarned,
          lastUpdate: currentTime,
        }
        )
      }
      else{
        console.log(`total hours : ${timeDiffInHrs}` )
      }
      }
      console.log(data.balance);
      setBalance(data.balance);
      setEarned(data.earned)
    });

    return () => {
      // Unsubscribe from the database when the component unmounts
      off(userRef);
    };
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.welcome_txt}>Welcome, {username}</Text>
        <View style={styles.total_card}>
          <Text style={styles.total_txt}>Your total asset portfollio</Text>
          <View style={styles.btn_container}>
            <View>
            <Text style={styles.amout}>
              Total: ${balance}
            </Text>
            <Text style={styles.earned}>
              (earned : ${earned})
            </Text>
            </View>
            <TouchableOpacity style={styles.invest_btn} onPress={openModal}> 
              <Text style={styles.invest_btn_txt}>
                Invest now
              </Text>
            </TouchableOpacity>
            
          </View>
        </View>

        <View style={styles.middle_container}>
          <Text style={styles.middle_txt}>
            Best Plans
          </Text>
          <TouchableOpacity style={styles.all_btn} onPress={openModal}>
            <Text style={styles.all_btn_txt}>
              See All
            </Text>
          </TouchableOpacity>
          <Ionicons name='arrow-forward-sharp' style={styles.forward_icon} color={'red'} size={20} />
        </View>

        <View>
          <ScrollView horizontal={true} >
            <View style={styles.img_card}>

              <Image source={require('../assets/gold_card1.png')} style={styles.gold_img}>

              </Image>
            </View>
            <View style={[styles.img_card, { backgroundColor: '#CAC9C9' }]}>
              <Image source={require('../assets/silver_card.png')} style={styles.gold_img}>

              </Image>
            </View>
            <View style={[styles.img_card, { backgroundColor: '#BA8DF3' }]} >
              <Image source={require('../assets/platinum_card.png')} style={styles.gold_img}>

              </Image>
            </View>
          </ScrollView>
        </View>

        <Text style={styles.last_txt}>
          Investment Guide
        </Text>

        <ScrollView>
          <TouchableOpacity style={styles.guide_btn} onPress={()=>navigation.navigate('Guide')}>
            <Text style={styles.guide_title}>
              Basic type of investment
            </Text>
            <Text style={styles.guide_txt}>
              How to Invest in Whale Profits?
            </Text>
          </TouchableOpacity>
          
        </ScrollView>

      </ScrollView>
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
    marginTop: windowHeight * 0.05,
    marginHorizontal: windowWidth * 0.05,
    fontSize: 28,
    fontWeight: '700',
  },
  total_card: {
    height: windowHeight * 0.2,
    width: windowWidth * 0.87,
    backgroundColor: primary,
    alignSelf: 'center',
    borderRadius: 15,
    margin: windowHeight * 0.035
  },
  total_txt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginTop: windowHeight * 0.04,
    marginLeft: windowWidth * 0.05
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
    fontSize: 22,
    marginBottom: 5,
    fontWeight: '600',
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
  img_txt_title: {

  },
  img_txt: {
    color: background
  },
  earned:{
    color:'#fff'
  }
})