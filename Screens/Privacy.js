// AboutUs.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, onValue, off } from 'firebase/database';


const Privacy = ({ navigation }) => {
  const [aboutUsContent, setAboutUsContent] = useState("Loading Privacy Policy...");

  // Function to fetch and update "About Us" content from Firebase
  useEffect(() => {
    const db = getDatabase();
    const aboutUsRef = ref(db, 'privacypolicy'); // Replace with your Firebase Realtime Database reference

    onValue(aboutUsRef, (snapshot) => {
      if (snapshot.exists()) {
        const content = snapshot.val();
        setAboutUsContent(content);
      } else {
        setAboutUsContent("Privacy Policy not found.");
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      off(aboutUsRef);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.aboutUsText}>{aboutUsContent}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#3498db',
  },
  scrollContainer: {
    flex: 1,
  },
  aboutUsText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default Privacy;
