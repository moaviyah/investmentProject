import { StyleSheet, Text, View, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, orderByChild, equalTo, query } from 'firebase/database';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import auth from '../config';
import { primary } from '../color';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Transactions = () => {
  const [requests, setRequests] = useState([]);
  const [amount, setAmount] = useState()
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const db = getDatabase()
    const userId = auth.currentUser?.uid;
    const requestsRef = ref(db, 'requests/');
    const userRequestsRef = query(requestsRef, orderByChild('id'), equalTo(userId));

    return onValue(userRequestsRef, (querySnapShot) => {
      let data = querySnapShot.val() || {};
      if (data) {
        let request = { ...data };
        const req = Object.values(request).reverse()
        setRequests(req);
        setIsLoading(false)
      } else {
        setRequests([])
        setIsLoading(true)
      }
    });

  }, []);

  const getDayName = (timestamp) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(timestamp);
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  };
  const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 20, justifyContent: 'space-between', alignItems: 'center', marginHorizontal:10 }}>
      <Text style={styles.welcome_txt}>Transaction History</Text>
                <Image source={require('../assets/TrustNOVALogo.png')} style={{ height: 60, width: 80 }} />
      </View>
      {isLoading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator/>
        </View>
      )
        :
        (requests.map((request) =>
        (
          <View style={styles.card} key={request.requestId}>
            <View style={styles.statusContainer}>
              <Text style={styles.requestType}>
                {request.request} Request
              </Text>
              <Text style={[
                request.status === 'Completed'
                  ? { color: primary }
                  : request.status === 'Pending'
                    ? { color: 'blue' }
                    : { color: 'red' }
                , { fontWeight: '600' }]}>
                {request.status}
              </Text>
            </View>

            <View style={styles.cardRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="time-outline" size={20} color="gray" />
                <Text style={[styles.cardText, { fontWeight: '300' }]}>{getDayName(request.timestamp)} {formatTime(request.timestamp)} </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>Amount:</Text>
                <Feather name="dollar-sign" size={20} color="gray" />
                <Text style={styles.cardText}>{request.amount}</Text>
              </View>
            </View>


            {/* <View style={styles.instructions}>
              {
                request.request === 'Deposit' ?
                  (
                    <Text>
                      1. Admin will verify the amount sent by user.
                      {'\n'}
                      2.Request status will be completed.
                      {'\n'}
                      3.Deposit amount will be reflected in portfolio
                    </Text>
                  ) :
                  <Text>

                    1. Admin will send requested amount in user's wallet.
                    {'\n'}
                    2.Request status will be completed.
                    {'\n'}
                    4.Requested amount will be sent through trust wallet
                  </Text>
              }

            </View> */}
          </View>
        )
        )
        )
      }
    </ScrollView>
  );

}

export default Transactions


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
    paddingHorizontal:10
  },
  welcome_txt: {
    fontSize: 26,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: windowHeight * 0.005
  },
  cardText: {
    fontWeight: 'bold',
  },

  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  requestType: {
    fontWeight: '600'
  },
  instructions: {
    margin: windowHeight * 0.001
  }
})