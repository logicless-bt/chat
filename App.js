import { StatusBar } from 'expo-status-bar';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
            component = {Chat}
          >
          {props => <Chat  db={db} {...props} />} 
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