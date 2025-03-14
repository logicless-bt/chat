import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const Start = ({ navigation }) => {
  //initializing states
  const [name, setName] = useState('');
  const [color, setColor] = useState('#090C08');

  //handles onPress for the color change
  const handleColorChange = (item) => {
    setColor(item);
  }

 return (
   <View style={styles.container}>
    <ImageBackground style={styles.imageBg} source = {require('../assets/Background-image.png')}> {/* sets background image */}
      <Text style={styles.title}> {/* title */}
        Chat.io
      </Text>
      <View style = {styles.smallBox}> {/* where information is input*/}
        <TextInput
            style={[styles.lightText, styles.textInput]}
            value={name}
            onChangeText={setName}
            placeholder='Type your username here'
          />
          <Text style={styles.lightText}>
            Choose a background color:
          </Text>
          <View style={{flexDirection: 'row'}}> {/* color selections contained within */}
            <TouchableOpacity style = {[styles.chooseBgColor, styles.black]} onPress={() => handleColorChange('#090C08')} />
            <TouchableOpacity style = {[styles.chooseBgColor, styles.darkGray]} onPress={() => handleColorChange('#474056')} />
            <TouchableOpacity style = {[styles.chooseBgColor, styles.gray]} onPress={() => handleColorChange('#8A95A5')} />
            <TouchableOpacity style = {[styles.chooseBgColor, styles.lightGray]} onPress={() => handleColorChange('#B9C6AE')} />
            <TouchableOpacity style = {[styles.chooseBgColor, styles.white]} onPress={() => handleColorChange('#FFFFFF')} />
          </View>
        <View style = {styles.startChatting}>
          <Button
            title="Enter Chat" 
            onPress={() => navigation.navigate('Chat', {name: name, color: color})}
          />
        </View>
      </View>
    </ImageBackground>
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'space-between'
 },
 imageBg: {
  flex: 1,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
 },
 lightText: {
  fontSize: 16,
  fontWeight: 300,
  color: '#757083',
  opacity: 0.5
 },
 chooseBgColorText: {
  opacity: 1
 },
 chooseBgColor: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginLeft: 5,
  marginRight: 5
 },
 textInput: {
    width: "88%",
    color: 'black',
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15
  },
  title: {
    fontSize: 45,
    fontWeight: 600,
    color: '#FFFFFF',
    marginTop: 45,
    marginBottom: 45
  },
  smallBox: {
    width: '88%',
    height: '44%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'darkGray',
    backgroundColor: '#FFF',
    marginTop: 120
  },
  startChatting: {
    fontWeight: 600,
    color: '#FFFFFF',
    backgroundColor: '#757083',
    margin: 15
  },
  black: {
    backgroundColor: '#090C08'
  },
  darkGray: {
    backgroundColor: '#474056'
  },
  gray: {
    backgroundColor: '#8A95A5',
  },
  lightGray: {
    backgroundColor: '#B9C6AE'
  },
  white: {
    backgroundColor: '#FFFFFF'
  }
});

export default Start;