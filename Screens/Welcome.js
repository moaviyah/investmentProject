import { SafeAreaView, StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { primary,  background } from '../color'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Welcome = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/Welcome_Image.png')} style={styles.img} />
            <View style={styles.main}>
                <Text style={styles.txt_head}>
                    Stay on top of your {'\n'}Profit with us
                </Text>
                <Text style={styles.txt}>
                    We are your new financial Advisors {'\n'} to make the best investments for {'\n'}you.
                </Text>
                <TouchableOpacity style={styles.create_account_btn} onPress={() => { navigation.navigate('SignUp') }}>
                    <Text style={styles.create_account_txt}>
                        Create Account
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.login_btn} onPress={() => { navigation.navigate('Login') }}>
                    <Text style={styles.login_btn_txt}>
                        Login
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: background,
    },
    img: {
        height: windowHeight * 0.35,
        width: windowWidth * 0.8,
        alignSelf: 'center',
        marginTop: windowHeight * 0.1
    },
    txt_head: {
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '700',
        marginTop: windowHeight * 0.02,
    },
    txt: {
        fontWeight: '600',
        color: '#4F4F4F',
        marginTop: windowHeight * 0.03,
        marginHorizontal: windowWidth * 0.1,
        textAlign: 'center',
        fontSize: 16
    },
    main: {
        justifyContent: 'center',
        alignItems: "center",

    },
    create_account_btn: {
        alignSelf: 'center',
        width: windowWidth * 0.8,
        backgroundColor: primary,
        height: windowHeight * 0.07,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: windowHeight * 0.09
    },
    create_account_txt: {
        color: background,
        fontWeight: '700'
    },
    login_btn: {
        alignSelf: 'center'
    },
    login_btn_txt: {
        color: primary,
        margin: windowHeight * 0.02,
        fontWeight: '600'
    },

})