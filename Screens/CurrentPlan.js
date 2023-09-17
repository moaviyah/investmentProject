import { SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native'
import React, {useState, useEffect} from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase , ref, onValue, off} from 'firebase/database';
import auth from '../config';

const windowWidth = Dimensions.get('window').height
const windowHeight = Dimensions.get('window').height;

const CurrentPlan = ({navigation}) => {
    const [plan , setPlan] = useState();
    const [profit, setProfit] =useState();
    const [isPlanSelected, setIsplanSelected] =useState(false)
    const weeklyProfit = profit * 7 ;
    const monthlyProfit = profit * 12;
    const yearlyProfit = profit * 365;
    useEffect(() => {
        const db = getDatabase();
        const userId = auth.currentUser?.uid;
        const userRef = ref(db, `users/${userId}`);
 
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          console.log(data.plan);
          if(data.plan>0){
            setPlan(`You have ${data.plan} $ account activated`)
          }else{
            setPlan(`You have No Current Plan`)
          }
          setProfit(data.interestRate)
          console.log(data.interestRate)
        });
      
        return () => {
          // Unsubscribe from the database when the component unmounts
          off(userRef);
        };
      }, []);
  return (
    <SafeAreaView style={styles.modal}>
      <AntDesign name='close' style={{ alignSelf: 'flex-end' }} size={22} onPress={()=>navigation.goBack()} />
      <Text style={styles.planTitle}>
        {plan}
      </Text>
      <View style={styles.middleContainer}>
      <Text style={styles.profits}>
        Daily Profit = $ {profit}
      </Text>
      <Text style={styles.profits}>
        Weekly Profit = $ {weeklyProfit}
      </Text>
      <Text style={styles.profits}>
        Monthly Profit = $ {monthlyProfit}
      </Text>
      <Text style={styles.profits}>
        Yearly Profit = $ {yearlyProfit}
      </Text>
      </View>
    </SafeAreaView>
  )
}

export default CurrentPlan

const styles = StyleSheet.create({
    modal:{
        flex: 1,
        padding: windowHeight * 0.05,
    },
    planTitle:{
        fontSize:22,
        fontWeight:'600',
        alignSelf:'center',
        marginTop:windowHeight*0.1
    },
    middleContainer:{
        alignSelf:'center',
        justifyContent:'center',
        paddingVertical:windowHeight*0.05,
        alignItems:'center'
        
    },
    profits:{
        marginVertical:windowHeight*0.01
    }
})