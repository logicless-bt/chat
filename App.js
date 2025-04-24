import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from "@react-native-community/netinfo";
import Start from './components/Start';
import Chat from './components/Chat';

const Stack = createNativeStackNavigator();

const App = () => {
  //firebase keys
  const firebaseConfig = {

    apiKey: "AIzaSyBSCQTLPVlWzY9ogdeOc-AGzlL5pCqVyM0",
  
    authDomain: "chatapp-23e22.firebaseapp.com",
  
    projectId: "chatapp-23e22",
  
    storageBucket: "chatapp-23e22.firebasestorage.app",
  
    messagingSenderId: "168009497209",
  
    appId: "1:168009497209:web:fe163477f3e55676f832a8",
  
    measurementId: "G-EB23LFYXQP"
  
  };

  //initializing Firebase and Cloud Firestore
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  //initialize image storage
  const storage = getStorage(app);

  //NetInfo tells whether or not the app is connected, then connects or disconnectss
  const connectionStatus = useNetInfo();
    useEffect(() => {
      if (connectionStatus.isConnected === false) {
        Alert.alert("Connection Lost!");
        disableNetwork(db);
      } else if (connectionStatus.isConnected === true) {
        enableNetwork(db);
      }
  }, [connectionStatus.isConnected]);



  return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName = "Start"
        >
          <Stack.Screen 
            name = "Start"
            component = {Start}
          />
          <Stack.Screen 
            name = "Chat"
          >
          {props => <Chat  
          isConnected={connectionStatus.isConnected}
          db={db} 
          storage = {storage} 
          {...props} />} 
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
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

export default App;