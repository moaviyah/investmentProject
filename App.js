import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from './config';

import Dashboard from './Screens/Dashboard';
import Welcome from './Screens/Welcome';
import SignUp from './Screens/SignUp';
import Login from './Screens/Login';
import AllPlans from './Screens/AllPlans';
import Instructions from './Screens/Instructions';
import Guide from './Screens/Guide';
import PlanSelection from './Screens/PlanSelection';
import Deposit from './Screens/Deposit';
import Withdraw from './Screens/Withdraw';
import CurrentPlan from './Screens/CurrentPlan';
import { primary } from './color';

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true)
  console.log(initialRoute)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setInitialRoute('Dashboard');
        setLoading(false)
      } else {
        setInitialRoute('Welcome');
        setLoading(false)
      }
    });
    unsubscribe
    
  }, []);

  const Stack = createStackNavigator();

  return (
    <View style={{flex:1}}>
      {
        loading ?
          (
            <View style={{height:'100%', alignItems:'center', justifyContent:'center'}}>
              <ActivityIndicator size={50} color={'green'}/>
            </View>
          )
          :
          (
            <NavigationContainer independent={true}>
              <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Dashboard' component={Dashboard} />
                <Stack.Screen name='Welcome' component={Welcome} />
                <Stack.Screen name='SignUp' component={SignUp} />
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='AllPlans' component={AllPlans} />
                <Stack.Screen name='Instructions' component={Instructions} />
                <Stack.Screen name='Guide' component={Guide} />
                <Stack.Screen name='PlanSelection' component={PlanSelection} />
                <Stack.Screen name='Deposit' component={Deposit} />
                <Stack.Screen name='Withdraw' component={Withdraw} />
                <Stack.Screen name='CurrentPlan' component={CurrentPlan} />
              </Stack.Navigator>
            </NavigationContainer>
          )
      }
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
