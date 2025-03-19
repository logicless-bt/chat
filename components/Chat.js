import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, renderActions } from "react-native-gifted-chat";
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const Chat = ({ route, navigation, db }) => {
    const {name, color, userID} = route.params;
    const [messages, setMessages] = useState([]);
    const onSend = (newMessages) => {
      addDoc(collection(db, "messages"), newMessages[0]);
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

    useEffect(() => {
      //sets title to name
      navigation.setOptions({ title: name });

      //requesting messages
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      //real-time listening
      const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach(doc => {
          newMessages.push({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
          })
        })

        //set messages state
        setMessages(newMessages);
      });

      //clean up 
      return () => {
        if (unsubMessages) unsubMessages();
      }
    }, []);

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
     user={{
       _id: userID,
       name: name,
     }}
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