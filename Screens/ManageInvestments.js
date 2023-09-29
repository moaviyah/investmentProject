import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import { getDatabase, ref, onValue, update, off, get } from 'firebase/database';
import { primary } from '../color';

const ManageInvestments = ({ navigation }) => {
  // State to store the selected plan level and entered amount
  const [selectedPlanLevel, setSelectedPlanLevel] = useState('Plan 200');
  const [amount, setAmount] = useState('');
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const db = getDatabase();

  // Fetch user data from Firebase Realtime Database
  useEffect(() => {
    const usersRef = ref(db, 'users');

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        // Convert the data into an array of user objects
        const userList = Object.keys(data).map((username) => {
          return {
            username,
            ...data[username],
          };
        });
        setUsers(userList);
      } else {
        console.log('no Data')
      }
    });
  }, [db]);

  // Function to calculate the distributed amount for each user
  const calculateDistributedAmount = () => {
    if (selectedPlanLevel === 'Select Plan') {
      Alert.alert('Please Select a Plan');
    } else if (amount === '') {
      Alert.alert('Please Enter an Amount to Distribute');
    } else {
      const distributionAmount = parseFloat(amount);

      // Filter users based on the selected plan level
      const filteredUsers = users.filter((user) => user.plan === parseInt(selectedPlanLevel));

      if (filteredUsers.length === 0) {
        // No eligible users
        setEligibleUsers([]);
        return;
      }

      // Calculate the user share
      const userShare = distributionAmount / filteredUsers.length;

      // Calculate and set the distributed amount for each user
      const usersWithDistributedAmount = filteredUsers.map((user) => {
        const referralBonus = user.referredBy ? 0.1 * userShare : 0; // 10% referral bonus
        return {
          ...user,
          distributedAmount: userShare ,
          parentRefferal: referralBonus
        };
      });

      // Set the eligible users for rendering
      setEligibleUsers(usersWithDistributedAmount);
    }
  };

const handleConfirm = async () => {
  try {
    const updates = {};
    
    // Step 1: Update the user's balance in Firebase
    eligibleUsers.forEach((user) => {
      const distributedAmount = user.distributedAmount;
      const referralBonus = user.referredBy ? 0.1 * distributedAmount : 0;
      const remainingAmount = distributedAmount - referralBonus;
      const earnedAmount = user?.earned || 0;

      // Update the balance field in Firebase
      const newBalance = user.balance + remainingAmount + earnedAmount; // Add both earned and referral bonuses
      updates[`users/${user.username}/balance`] = newBalance;
      updates[`users/${user.username}/earned`] = earnedAmount + remainingAmount;
    });
  
    // Perform the batch update for balance in Firebase
    await update(ref(db), updates);

    // Step 2: Fetch the updated user data from Firebase
    const snapshot = await get(ref(db, 'users'));
    const usersData = snapshot.val() || {};

    // Step 3: Calculate and distribute profits to referred users
    const referralGroups = {};
    eligibleUsers.forEach((user) => {
      // Group eligible users by their referrer
      if (user.referredBy) {
        if (!referralGroups[user.referredBy]) {
          referralGroups[user.referredBy] = [];
        }
        referralGroups[user.referredBy].push(user);
      }
    });

    // Step 4: Update referral earnings for referrers and calculate total referral bonuses
    for (const referrerUsername in referralGroups) {
      if (referralGroups.hasOwnProperty(referrerUsername)) {
        const referredUsers = referralGroups[referrerUsername];
        const totalReferralBonus = referredUsers.reduce((total, referredUser) => {
          return total + (0.1 * referredUser.distributedAmount);
        }, 0);

        // Calculate the updated balance for the referrer, including referral bonuses
        const referrerBalance = usersData[referrerUsername]?.balance || 0;
        const newReferrerBalance = referrerBalance + totalReferralBonus;
        
        // Update the balance and referral earnings for this referrer
        updates[`users/${referrerUsername}/balance`] = newReferrerBalance;
        updates[`users/${referrerUsername}/refferalEarning`] = totalReferralBonus; // Update referral earnings
      }
    }
  
    // Step 5: Perform the final batch update for referral earnings and balance in Firebase
    await update(ref(db), updates);

    // Step 6: Clear state and show success message
    setSelectedPlanLevel();
    setAmount();
    setEligibleUsers([]);
    Alert.alert('Distributed successfully');
  } catch (error) {
    console.error('Error distributing: ', error);
    Alert.alert('Error distributing amount');
  }
};

  
  
  
  
  


  return (
    <View style={styles.container}>
      <AntDesign
        name="left"
        style={{ marginTop: 35, marginBottom: 20 }}
        size={24}
        onPress={() => navigation.goBack()}
      />

      <Text style={styles.label}>Select Plan Level:</Text>
      <Picker
        style={styles.input}
        selectedValue={selectedPlanLevel}
        onValueChange={(itemValue) => setSelectedPlanLevel(itemValue)}
      >
        <Picker.Item label="Select Plan" value="Select Plan" />
        <Picker.Item label="Plan $200" value="200" />
        <Picker.Item label="Plan $400" value="400" />
        <Picker.Item label="Plan $600" value="600" />
        <Picker.Item label="Plan $800" value="800" />
        <Picker.Item label="Plan $1000" value="1000" />
        <Picker.Item label="Plan $1500" value="1500" />
        <Picker.Item label="Plan $2000" value="2000" />
      </Picker>

      <Text style={styles.label}>Enter Amount:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />

      <Button title="Calculate Distributed Amount" onPress={calculateDistributedAmount} color={primary}/>


      {eligibleUsers.length === 0 ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text>No eligible users for the selected plan level</Text>
        </View>

      ) : (
        <View>
        <FlatList
          data={eligibleUsers}
          keyExtractor={(item) => item.username}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text>{`Id: ${item.username || 'N/A'}`}</Text>
              <Text>{`User: ${item.name || 'N/A'}`}</Text>
              <Text>{`Plan Level: $${item.plan || 'N/A'}`}</Text>
              <Text>{`Referred By: ${item.referredBy || 'None'}`}</Text>
              <Text>{`Distributed Amount: $${item.distributedAmount || 'N/A'}`}</Text>
              <Text>{`$${item.parentRefferal || 'N/A'} will go to ${item.referredBy}`}</Text>
            </View>
          )}
        />
        <TouchableOpacity style={{backgroundColor:primary, paddingVertical:15, borderRadius:10, alignItems:'center' } } onPress={handleConfirm}>
          <Text style={{color:'#fff', fontWeight:'500', fontSize:18}}>
            Confirm
          </Text>
        </TouchableOpacity>
        </View>
      )}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  userItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default ManageInvestments;
