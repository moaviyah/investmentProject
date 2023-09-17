import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Dimensions, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { background } from '../color';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function SignUp({ navigation }) {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth();

    const userData = {
        name: fullName,
        email: email,
        password: password,
        balance: 0,
        plan : 'No current',
        interestRate: 0,
        earned :0,
      };

    const handleSignUp = (email, password, displayName) => {

        if (!fullName || !email || !password){
            Alert.alert('All fields are mandatory')
        }else {

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userId= userCredential.user.uid
        console.log("User created:", user.uid);
        updateProfile(user, { displayName: displayName })
        .then(() => {
            console.log("Display name updated:", displayName);
            const db = getDatabase();

            set(ref(db, `users/${userId}`), userData)
                .then(() => {
                    console.log("User information saved successfully.");
                })
                .catch((error) => {
                    console.error("Error saving user information: ", error);
                });
        })
        .catch((error) => {
          console.log("Error updating display name:", error);
          const errMsg = error.message.split(':') [1];
            setError(errMsg)
          setError(error)
        });
      })
      .catch((error) => {
        console.log("Error creating user:", error);
        const errMsg = error.message.split(':') [1];
        setError(errMsg)
      });
    }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <View style={styles.top}>
                <Ionicons name='chevron-back-sharp' style={styles.icon} size={26} onPress={() => { navigation.goBack(); }} />
                <Text style={styles.main_heading}>Create an account</Text>
                <Text style={styles.second_heading}>Invest and double your income now</Text>
            </View>
            <KeyboardAvoidingView style={styles.main}>
                <TextInput placeholder='Full name*' placeholderTextColor={'#828282'} style={styles.input} onChangeText={(text)=>{setFullName(text)}}/>
                <TextInput placeholder='Email address*' placeholderTextColor={'#828282'} style={styles.input} onChangeText={(text)=>{setEmail(text)}}/>
                <TextInput placeholder='Password*' placeholderTextColor={'#828282'} style={styles.input} secureTextEntry onChangeText={(text)=>{setPassword(text)}}/>
                
                {error ? <Text style={{ color: 'red', alignSelf:'center' }}>{error}</Text> : null}

                <TouchableOpacity style={styles.btn} onPress={()=>{handleSignUp(email, password, fullName)}}>
                    <Text style={styles.btn_txt} >
                        Create account
                    </Text>
                </TouchableOpacity>

                <Text style={styles.login_txt} onPress={() => { navigation.navigate('Login') }}>
                    Already have an account?
                </Text>
            </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: background
    },
    top: {

    },
    icon: {
        margin: windowHeight * 0.02
    },
    main_heading: {
        fontSize: 28,
        textAlign: "center",
        fontWeight: '700'
    },
    second_heading: {
        fontSize: 18,
        textAlign: 'center',
        color: '#4F4F4F',
        fontWeight: '500',
        margin: windowHeight * 0.01
    },
    main: {
        marginTop: windowHeight * 0.05
    },
    input: {
        height: windowHeight * 0.08,
        marginHorizontal: windowHeight * 0.04,
        marginVertical: windowHeight * 0.015,
        borderWidth: 1,
        borderColor: '#828282',
        borderRadius: 10,
        padding: 15,
    },
    btn: {
        height: windowHeight * 0.08,
        width: windowWidth * 0.85,
        alignSelf: 'center',
        backgroundColor: '#31A062',
        justifyContent: 'center',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: windowHeight * 0.04
    },
    btn_txt: {
        color: '#fff',
        fontSize: 18,
        fontWeight: "600"
    },
    login_txt: {
        color: '#31A062',
        fontSize: 18,
        marginTop: windowHeight * 0.05,
        textAlign: 'center',
        fontWeight: "600"
    }
});