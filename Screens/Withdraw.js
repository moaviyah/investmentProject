import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, Alert, Clipboard, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDatabase, ref, set, push } from "firebase/database";
import auth from '../config';
import { useClipboard } from '@react-native-community/clipboard';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Withdraw = ({ navigation, route }) => {
    const { balance } = route.params
    console.log(balance)
    const [copiedText, setCopiedText] = useState('');
    const [ispasted, setIsPasted] = useState(false);
    const [amount, setAmount] = useState()
    const userId = auth.currentUser?.uid;



    const fetchCopiedText = async () => {
        try {
            const clipboardContent = await Clipboard.getString();
            setCopiedText(clipboardContent);
            setIsPasted(true);
            console.log(copiedText);
            setTimeout(() => {
                setIsPasted(false);
            }, 4000);
        } catch (error) {
            console.error('Clipboard functionality is not available or not properly configured.');
        }
    };


    const post_request = () => {
        if (amount <= balance) {
            if(amount < 50){
                Alert.alert('Minimum amount is $50')
                return
            }
            const db = getDatabase();
            const request = ref(db, "requests");
            const newRequestRef = push(request);
            const reqId = newRequestRef.key;
            set(newRequestRef, {
                amount: amount,
                status: 'Pending',
                id: userId,
                request: 'Withdraw',
                timestamp: Date.now(),
                requestId: reqId,
                username: auth.currentUser.displayName
            });
            console.log('success')
            navigation.goBack()
            Alert.alert('Request Generated Successfully. Please Wait')
        } else {
            Alert.alert('Insufficient Balance')
            console.log('insufficient amount')
        }
    }


    return (
        <View style={styles.modal}>
            <View style={{ flexDirection: 'row', marginTop: 35, marginBottom: 20, justifyContent: 'space-between', alignItems: 'center' }}>
                <AntDesign name='left' size={24} onPress={() => navigation.goBack()} />
                <Image source={require('../assets/TrustNOVALogo.png')} style={{ height: 60, width: 80 }} />
            </View>
            <Text style={styles.modal_txt}>Receive your earnings in your wallet</Text>
            <Text style={styles.subHead}>Amount will be deducted when withdraw request is completed</Text>
            <View style={styles.link_container}>
                <Text style={styles.input_container_txt}>Paste your USDT(bnb) address here:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={copiedText}
                        onChangeText={setCopiedText}
                    />
                    <MaterialCommunityIcons name={ispasted ? 'check' : 'content-paste'} style={styles.paste_icon} size={22} onPress={fetchCopiedText} />
                </View>
            </View>
            <View style={styles.link_container}>
                <Text style={styles.input_container_txt}>Enter amount to withdraw</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => { setAmount(text) }}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.transfer_btn} onPress={post_request}>
                <Text style={styles.btn_txt}>
                    Initialize Withdraw
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Withdraw

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    link_container: {
        height: windowHeight * 0.1,
        backgroundColor: '#EDEDED',
        borderRadius: 10,
        padding: windowHeight * 0.01,
        margin: windowHeight * 0.01
    },
    modal_txt: {
        fontSize: 22,
        fontWeight: '400'
    },
    input: {
        height: windowHeight * 0.06,
        width: windowWidth * 0.8,
    },
    inputContainer: {
        flexDirection: 'row'
    },
    paste_icon: {
        alignSelf: 'center'
    },
    subHead: {
        marginVertical: windowHeight * 0.03,
        fontSize: 16,
        color: 'grey',
    },
    input_container_txt: {
        color: 'grey'
    },
    transfer_btn: {
        alignSelf: 'center',
        width: windowWidth * 0.8,
        backgroundColor: '#31A062',
        height: windowHeight * 0.07,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: windowHeight * 0.09
    },
    btn_txt: {
        color: 'white',
        fontWeight: '700'
    }
})