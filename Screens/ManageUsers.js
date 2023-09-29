import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Added FontAwesome5 for user icon
import { getDatabase, ref, onValue } from 'firebase/database';


const ManageUsers = ({ navigation }) => {
  const db = getDatabase(); // Initialize Firebase database reference
  const [users, setUsers] = useState([]); // State to store user data

  // Fetch user data from Firebase database
  useEffect(() => {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        // Convert the Firebase object into an array of users with document IDs as usernames
        const userList = Object.keys(userData).map((username) => ({
          username, // Use the document ID as the username
          ...userData[username],
        }));
        setUsers(userList);
      }
    });
  }, [db]);

  // Function to navigate to UserDetails screen and pass user data
  const navigateToUserDetails = (user) => {
    navigation.navigate('UserDetails', { user });
  };

  return (
    <View style={styles.container}>
      <AntDesign
        name="left"
        style={styles.backButton}
        size={24}
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={users}
        keyExtractor={(user) => user.username} // Use the document ID as the key
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userContainer}
          >
            <View style={styles.userIconContainer}>
              <FontAwesome5 name="user" size={24} color="#3498db" />
            </View>
            <View style={styles.userInfoContainer}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.plan}>Plan: {item.plan}</Text>
              <Text style={styles.referrals}>
                Referrals: {item.referrals ? Object.keys(item.referrals).length : 0}
              </Text>
            </View>
            <TouchableOpacity style={styles.detailsButton} onPress={() => navigateToUserDetails(item)}>
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5', // Background color for the container
  },
  backButton: {
    marginTop: 35,
    marginBottom: 20, 
  },
  userContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 1,
    flexDirection: 'row', // Align user icon, user info, and details button horizontally
    alignItems: 'center', // Center items vertically
  },
  userIconContainer: {
    marginRight: 15,
  },
  userInfoContainer: {
    flex: 1, // Takes up remaining space
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // Username text color
  },
  plan: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555', // Plan text color
  },
  referrals: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555', // Referrals text color
  },
  detailsButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ManageUsers;
