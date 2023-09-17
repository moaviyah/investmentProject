import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home'
import Transactions from './Transactions'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Account from './Account';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { background } from '../color';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

 const  Dashboard = () => {
  const Tab = createBottomTabNavigator();
  
  return (

      <Tab.Navigator>
        <Tab.Screen name='Home' component={Home} options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
        />
        <Tab.Screen name='Transactions' component={Transactions} options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-wallet" size={size} color={color} />
          ),
        }}
        />
        <Tab.Screen name='Account' component={Account} options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
        />
       
      </Tab.Navigator>

  )
}
export default Dashboard