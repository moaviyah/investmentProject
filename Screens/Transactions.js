import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, orderByChild, equalTo, query } from 'firebase/database';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import auth from '../config';

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
        const req = Object.values(request)
        console.log(request)
        setRequests(req);
        setIsLoading(false)
      } else {
        setRequests([])
        setIsLoading(true)
      }
    });

  }, []);

  return (
    <ScrollView style={styles.container}>

      {isLoading ? (
        <Text>Loading...</Text>
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
                request.status === 'Complete'
                  ? { color: 'green' }
                  : request.status === 'Pending'
                  ? { color: 'blue' }
                  : { color: 'red' }
                  , {fontWeight:'600'}]}>
               {request.status}
              </Text>
            </View>

            <View style={styles.cardRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="time-outline" size={20} color="gray" />
                <Text style={[styles.cardText, {fontWeight: '300'}]}>{request.timestamp}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="dollar-sign" size={20} color="gray" />
                <Text style={styles.cardText}>{request.amount}</Text>
              </View>
            </View>


            <View style={styles.instructions}>
              <Text>
                1. Admin will verify the request/ send amount.
                {'\n'}
                2.Request status will be completed.
                {'\n'}
                3.Deposit amount will be reflected in portfolio
                {'\n'}
                4.Withdraw amount will be sent through trust wallet
              </Text>
            </View>
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
    padding: 10,
    backgroundColor: '#f8f8f8',
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
    margin:windowHeight*0.005 
  },
  cardText: {
    fontWeight: 'bold',
  },
  status: {

  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start'
  },
  requestType: {
    fontWeight: '600'
  },
  instructions:{
  margin: windowHeight*0.001
  }
})