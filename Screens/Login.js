import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { background, primary } from '../color';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Login({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth()

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            setEmail('')
            setPassword('')
            navigation.navigate('Dashboard')
          })
          .catch((error) => {
            console.log('Error logging in:', error);
            const errMsg = error.message.split(':') [1];
            setError(errMsg)
          });
      };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.top}>
                <Ionicons name='chevron-back-sharp' style={styles.icon} size={26} onPress={()=>{navigation.goBack();}}/>
                <Text style={styles.main_heading}>Login with an account</Text>
                <Text style={styles.second_heading}>Invest and double your income now</Text>
            </View>
            <View style={styles.main}>
                <TextInput placeholder='Email address' placeholderTextColor={'#828282'} style={styles.input} onChangeText={(text)=>{setEmail(text)}} value={email}/>
                <TextInput placeholder='Password'placeholderTextColor={'#828282'}  style={styles.input} secureTextEntry onChangeText={(text)=>{setPassword(text)}} value={password}/>

                {error ? <Text style={{ color: 'red', alignSelf:'center' }}>{error}</Text> : null}

                <TouchableOpacity style={styles.btn} onPress={handleLogin}>
                    <Text style={styles.btn_txt}>
                        Login
                    </Text>
                </TouchableOpacity>
                <Text style={styles.login_txt} onPress={()=>{navigation.navigate('SignUp')}}>
                    Do not have an account?
                </Text>
            </View>

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
        marginVertical: windowHeight*0.015,
        borderWidth:1,
        borderColor:'#828282',
        borderRadius:10,
        padding:15,
    },
    btn:{
        height:windowHeight*0.08,
        width:windowWidth * 0.85,
        alignSelf:'center',
        backgroundColor:primary,
        justifyContent:'center',
        borderRadius:10,
        alignItems:'center',
        marginTop:windowHeight*0.04
    },
    btn_txt:{
        color:'#fff',
        fontSize:18,
        fontWeight:"600"
    },
    login_txt:{
        color:primary,
        fontSize:18,
        marginTop:windowHeight*0.05,
        textAlign:'center',
        fontWeight:"600"
    }
});