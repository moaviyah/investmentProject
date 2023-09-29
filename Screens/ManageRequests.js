import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Clipboard } from 'react-native';
import { getDatabase, ref, onValue, update, get } from "firebase/database";
import { AntDesign, MaterialCommunityIcons } from 'react-native-vector-icons';
import { background } from '../color';


const ManageRequests = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const db = getDatabase();
  const copyToClipboardAndToggleIcon = (item) => {
    Clipboard.setString(item.trxId);
    item.isCopied = true; // Toggle the isCopied property for the clicked request item
    setRequests([...requests]); // Update the state to re-render the FlatList
    setTimeout(() => {
      item.isCopied = false; // Reset the isCopied property after 4 seconds
      setRequests([...requests]); // Update the state to re-render the FlatList
    }, 4000);
  };

  useEffect(() => {
    const requestsRef = ref(db, 'requests');
    onValue(requestsRef, (snapshot) => {
      if (snapshot.exists()) {
        const requestData = snapshot.val();
        const requestArray = Object.values(requestData).reverse().map(item => ({
          ...item,
          isCopied: false, // Add isCopied property for each item
        }));
        setRequests(requestArray);
      }
    });
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

  const handleCompleteRequest = (requestId, username, amount, request) => {
    const userBalanceRef = ref(db, `users/${username}`);
    const requestRef = ref(db, `requests/${requestId}`);
    // Get the current user's balance from the database
    if(request === 'Deposit'){
      get(userBalanceRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const currentBalance = parseFloat(snapshot.val().balance) ;
          console.log('current balance',typeof parseFloat(currentBalance) , 'amount', typeof parseFloat(amount) )
          const newBalance = currentBalance + parseFloat(amount);
          console.log('new balance', newBalance)
          // Update the user's balance in the database
          update(userBalanceRef, {balance: newBalance})
          update(requestRef, { status: 'Completed' })
            .then(() => {
              // Successfully updated
              Alert.alert('Request Completed', 'The request has been marked as complete.');
            })
            .catch((error) => {
              // Handle error
              Alert.alert('Error', 'Unable to complete the request. Please try again later.');
            });
        } else {
          // Handle the case where the user's balance does not exist
          Alert.alert('Error', 'User balance not found.');
        }
      })
      .catch((error) => {
        // Handle error
        Alert.alert('Error', 'Unable')
        console.log(error.message)
      })
    }else{
      get(userBalanceRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const currentBalance = parseFloat(snapshot.val().balance);
          // Calculate the new balance by subtracting the amount
          const newBalance = currentBalance - parseFloat(amount);
  
          // Update the user's balance in the database
          update(userBalanceRef, {balance: newBalance})
          update(requestRef, { status: 'Completed' })
            .then(() => {
              // Successfully updated
              Alert.alert('Request Completed', 'The request has been marked as complete.');
            })
            .catch((error) => {
              // Handle error
              Alert.alert('Error', 'Unable to complete the request. Please try again later.');
            });
        } else {
          // Handle the case where the user's balance does not exist
          Alert.alert('Error', 'User balance not found.');
        }
      })
      .catch((error) => {
        // Handle error
        Alert.alert('Error', 'Unable')
        console.log(error.message)
      })
    }

    }
    
  const handleRejectRequest = (requestId) => {
    // Update the request status to "Rejected" in the database
    const requestRef = ref(db, `requests/${requestId}`);
    update(requestRef, { status: 'Rejected' })
      .then(() => {
        // Successfully updated
        Alert.alert('Request Rejected', 'The request has been rejected.');
      })
      .catch((error) => {
        // Handle error
        Alert.alert('Error', 'Unable to reject the request. Please try again later.');
      });
  };


  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 35, marginBottom: 20, backgroundColor:background }}>
        <AntDesign
          name="left"
          style={{ marginRight: 10 }}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={{ fontSize: 18, fontWeight: '500', color: '#333' }}>Manage Requests</Text>
      </View>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.requestId}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <View style={styles.entry}>
              <MaterialCommunityIcons name="account" size={24} color="#333" />
              <Text style={[styles.entryTitle, { color: '#333' }]}>Username:</Text>
              <Text style={[styles.entryValue, { color: '#444' }]}>{item.username}</Text>
            </View>
            <View style={styles.entry}>
              <AntDesign name="creditcard" size={24} color="#333" />
              <Text style={[styles.entryTitle, { color: '#333' }]}>Amount:</Text>
              <Text style={[styles.entryValue, { color: '#444' }]}>${item.amount}</Text>
            </View>
            <View style={styles.entry}>
              <MaterialCommunityIcons name="file-document" size={24} color="#333" />
              <Text style={[styles.entryTitle, { color: '#333' }]}>Request Type:</Text>
              <Text style={[styles.entryValue, { color: '#444' }]}>{item.request}</Text>
            </View>
            {
              item.trxId && (
                <View style={styles.entry}>
                <MaterialCommunityIcons name="key" size={24} color="#333" />
                <Text style={[styles.entryTitle, { color: '#333' }]}>Trx Id:</Text>
                <View style={{ width:270, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={[styles.entryValue, { color: '#444' }]}>{item.trxId}</Text>
                <MaterialCommunityIcons
                    name={item.isCopied ? 'check' : 'content-copy'}
                    size={20}
                    onPress={() => copyToClipboardAndToggleIcon(item)}
                  />
                </View>
                </View>
              )
            }
            <View style={styles.entry}>
              <MaterialCommunityIcons name="calendar" size={24} color="#333" />
              <Text style={[styles.entryTitle, { color: '#333' }]}>Status:</Text>
              <Text style={styles.entryValue}>{item.status}</Text>
            </View>
            
            <View style={styles.entry}>
              <MaterialCommunityIcons name="calendar" size={24} color="#333" />
              <Text style={[styles.entryTitle, { color: '#333' }]}>Date:</Text>
              <Text style={[styles.entryValue, { color: '#444' }]}>{formatDate(item.timestamp)}</Text>
            </View>
            <View style={styles.entry}>
              <MaterialCommunityIcons name="clock" size={24} color="#333" />
              <Text style={[styles.entryTitle, { color: '#333' }]}>Time:</Text>
              <Text style={[styles.entryValue, { color: '#444' }]}>{formatTime(item.timestamp)}</Text>
            </View>
            {item.status === 'Pending' && (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.completeButton]}
                  onPress={() => handleCompleteRequest(item.requestId, item.username, item.amount, item.request)}
                >
                  <Text style={styles.buttonText}>Complete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleRejectRequest(item.requestId)}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        )}
      />
    </View>
  );
  // return (
  //   <View style={styles.container}>
  //       <View style={{flexDirection:'row', alignItems:'center', marginTop: 35, marginBottom: 20}}>
  //     <AntDesign
  //       name="left"
  //       style={{  }}
  //       size={24}
  //       onPress={() => navigation.goBack()}
  //     />
  //     <Text style={{fontSize:18, fontWeight:'500', marginLeft:20}}>Manage Requests</Text>
  //     </View>
  //     <FlatList
  //       data={requests}
  //       keyExtractor={(item) => item.requestId}
  //       renderItem={({ item }) => (
  //         <View style={styles.requestItem}>
  //           <Text style={styles.requestText}>Username: {item.username}</Text>
  //           <Text style={styles.requestText}>Amount: {item.amount}</Text>
  //           <Text style={styles.requestText}>Request Type: {item.request}</Text>
  //           {
  //             item.trxId && (
  //               <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
  //               <Text style={styles.requestText}>Trx Id: {item.trxId}</Text>
  //               <MaterialCommunityIcons name={isCopied ? 'check' : 'content-copy'} size={20} onPress={()=>copyToClipboard(item.trxId)} />
  //               </View>
  //             )
  //           }
  //           <Text style={styles.requestText}>Status: {item.status}</Text>
  //           <Text style={styles.requestText}>Date: {formatDate(item.timestamp)}</Text>
  //           <Text style={styles.requestText}>Time: {formatTime(item.timestamp)}</Text>

  //           {item.status === 'Pending' && (
  //             <View style={styles.buttonsContainer}>
  //               <TouchableOpacity
  //                 style={[styles.button, styles.completeButton]}
  //                 onPress={() => handleCompleteRequest(item.requestId, item.username, item.amount, item.request)}
  //               >
  //                 <Text style={styles.buttonText}>Complete</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style={[styles.button, styles.rejectButton]}
  //                 onPress={() => handleRejectRequest(item.requestId)}
  //               >
  //                 <Text style={styles.buttonText}>Reject</Text>
  //               </TouchableOpacity>
  //             </View>
  //           )}
            
  //         </View>
  //       )}
  //     />
  //   </View>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor:background
  },
  requestItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    elevation:1
  },
  requestText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    margin: 5,
  },
  completeButton: {
    backgroundColor: '#4caf50', // Green color for complete
  },
  rejectButton: {
    backgroundColor: '#f44336', // Red color for reject
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  entryTitle: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  entryValue: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default ManageRequests;
