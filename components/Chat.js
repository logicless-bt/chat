import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, renderActions } from "react-native-gifted-chat";
import { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { collection, getDocs, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import CustomActions from './CustomActions';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
    const {name, color, userID} = route.params;
    const [messages, setMessages] = useState([]);

    //allows sending messages
    const onSend = (newMessages) => {
      addDoc(collection(db, "messages"), newMessages[0]);
    }

    //will prevent input if user is offline
    const renderInputToolbar = (props) => {
      if (isConnected) return <InputToolbar {...props} />;
      else return null;
    }

    const renderBubble = (props) => {
      return <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000"
          },
          left: {
            backgroundColor: "#FFF"
          }
        }}
      />
    }

    //import CustomActions component for GiftedChat
    const renderCustomActions = (props) => {
      return <CustomActions storage={storage} {...props} />;
    };

    const renderCustomView = (props) => {
      const { currentMessage} = props;
      if (currentMessage.location) {
        return (
            <MapView
              style={{width: 150,
                height: 100,
                borderRadius: 13,
                margin: 3}}
              region={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
        );
      }
      return null;
    }

    //declare listener outside useEffect to prevent memory leak
    let unsubMessages;
    useEffect(() => {
      //sets title to name
      navigation.setOptions({ title: name });

      if(isConnected === true){
        //requesting messages
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

        //unregister listener
        if (unsubMessages) unsubMessages();
        unsubMessages = null;

        //real-time listening
        unsubMessages = onSnapshot(q, (docs) => {
          let newMessages = [];
          docs.forEach(doc => {
            newMessages.push({ 
              id: doc.id, 
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis())
            })
          })
          //cache messages
          cacheMessages(newMessages);
          //set messages state
          setMessages(newMessages);
        });
      } else loadCachedMessages();
      //clean up 
      return () => {
        if (unsubMessages) unsubMessages();
      }
    }, [isConnected]);

    //caches messages to be accessed offline
    const cacheMessages = async (messagesToCache) => {
      // Cache the messages using AsyncStorage
      try { 
        await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
      } catch (error) {
        console.log(error.message);
      }
    }

    // Load cached messages
    const loadCachedMessages = async () => {
      // Load the cached messages from AsyncStorage
      const cachedMessages = await AsyncStorage.getItem("messages") || [];
      // Set the messages state
      setMessages(JSON.parse(cachedMessages));
    }

    /*useEffect(() => {
      setMessages([
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
          
          location: {
            latitude: 48.864601,
            longitude: 2.398704,
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ]);
    }, []);*/

 return (
   <View style={[styles.container, {backgroundColor: color}]}>
    {/* the chat itself */}
     <GiftedChat
     messages={messages}
     onSend={messages => onSend(messages)}
     renderBubble={renderBubble}
     renderInputToolbar={renderInputToolbar}
     user={{
       _id: userID,
       name: name,
     }}
     renderActions={renderCustomActions}
     renderCustomView={renderCustomView}
   />
   { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
 }
});

export default Chat;