import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getDatabase, ref, onValue, update } from 'firebase/database';

const UserDetails = ({ navigation, route }) => {
  const { user } = route.params;
  const db = getDatabase();

  const [isAgent, setIsAgent] = useState(user.isAgent);
  const [isBlocked, setIsBlocked] = useState(user.isBlocked);
  const [editedPlan, setEditedPlan] = useState(user.plan.toString()); // Initialize editedPlan state
  const [editedBalance, setEditedBalance] = useState(user.balance.toString()); // Initialize editedBalance state

  // Function to toggle user as an agent
  const toggleAgentStatus = () => {
    const userRef = ref(db, `users/${user.username}`);
    const updatedStatus = !isAgent;

    update(userRef, { isAgent: updatedStatus })
      .then(() => {
        console.log(`User is now ${updatedStatus ? 'an agent' : 'not an agent'}`);
        setIsAgent(updatedStatus);
      })
      .catch((error) => {
        console.error('Error toggling agent status:', error);
        // Handle the error
      });
  };

  // Function to toggle user's blocked status
  const toggleBlockedStatus = () => {
    const userRef = ref(db, `users/${user.username}`);
    const updatedStatus = !isBlocked;

    update(userRef, { isBlocked: updatedStatus })
      .then(() => {
        console.log(`User is now ${updatedStatus ? 'blocked' : 'unblocked'}`);
        setIsBlocked(updatedStatus);
      })
      .catch((error) => {
        console.error('Error toggling blocked status:', error);
        // Handle the error
      });
  };

  // Function to update user's plan
  const updatePlan = () => {
    const userRef = ref(db, `users/${user.username}`);

    // Parse the editedPlan to a number (assuming it should be a numeric value)
    const newPlan = parseFloat(editedPlan);

    if (!isNaN(newPlan)) {
      update(userRef, { plan: newPlan })
        .then(() => {
          console.log(`User's plan has been updated to: ${newPlan}`);
        })
        .catch((error) => {
          console.error('Error updating user plan:', error);
          // Handle the error
        });
    } else {
      console.error('Invalid plan value');
      // Handle the error (e.g., display a message to the admin)
    }
  };

  // Function to update user's balance
  const updateBalance = () => {
    const userRef = ref(db, `users/${user.username}`);

    // Parse the editedBalance to a number (assuming it should be a numeric value)
    const newBalance = parseFloat(editedBalance);

    if (!isNaN(newBalance)) {
      update(userRef, { balance: newBalance })
        .then(() => {
          console.log(`User's balance has been updated to: ${newBalance}`);
        })
        .catch((error) => {
          console.error('Error updating user balance:', error);
          // Handle the error
        });
    } else {
      console.error('Invalid balance value');
      // Handle the error (e.g., display a message to the admin)
    }
  };

  return (
    <View style={styles.container}>
      <AntDesign
        name="left"
        style={styles.backButton}
        size={24}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.userInfoContainer}>
        <FontAwesome5 name="user" style={styles.userIcon} size={40} />
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      <View style={styles.userDetailsContainer}>
        <Text style={styles.userDetail}>Balance: {user.balance}</Text>
        <Text style={styles.userDetail}>Date of Birth: {user.dateOfBirth}</Text>
        <Text style={styles.userDetail}>Country: {user.country}</Text>
        <Text style={styles.userDetail}>Earned: {user.earned}</Text>
        <Text style={styles.userDetail}>Email: {user.email}</Text>
        <Text style={styles.userDetail}>Plan: ${user.plan}</Text>
        <Text style={styles.userDetail}>Referred By: {user.referredBy}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Edit Plan"
          value={editedPlan}
          onChangeText={(text) => setEditedPlan(text)}
        />
        <TouchableOpacity style={styles.editButton} onPress={updatePlan}>
          <Text style={styles.editButtonText}>Edit Plan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Edit Balance"
          value={editedBalance}
          onChangeText={(text) => setEditedBalance(text)}
        />
        <TouchableOpacity style={styles.editButton} onPress={updateBalance}>
          <Text style={styles.editButtonText}>Edit Balance</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleAgentStatus}>
          <Text style={styles.buttonText}>
            {isAgent ? 'Remove Agent' : 'Make Agent'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isBlocked ? 'green' : 'red' }]}
          onPress={toggleBlockedStatus}
        >
          <Text style={styles.buttonText}>
            {isBlocked ? 'Unblock User' : 'Block User'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... (styles and export)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    marginTop: 35,
    marginBottom: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  userIcon: {
    marginRight: 10,
    color: '#333',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userDetailsContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  userDetail: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: 'white',
  },
  editButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: 100,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserDetails;
