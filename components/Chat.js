import { StyleSheet, View, Text } from 'react-native';
import { useEffect } from 'react';

const Chat = ({ route, navigation }) => {
    const {name, color} = route.params;
    console.log(color);

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);
 return (
   <View style={[styles.container, {backgroundColor: color}]}>
     <Text>Get ready to chat!</Text>
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center'
 }
});

export default Chat;