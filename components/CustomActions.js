import React from 'react';
import { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';


const CustomActions = ({ wrapperStyle, iconTextStyle, storage, onSend, userID }) => {
    //action sheet hook
    const actionSheet = useActionSheet();

    //displays action menu with four options
    const onActionPress = () => {
        const options = [
            'Choose From Library',
            'Take Picture',
            'Send Location',
            'Cancel'
        ];
        const cancelButtonIndex = options.length - 1;

        //creates the action menu
        actionSheet.showActionSheetWithOptions(
            {
            options,
            cancelButtonIndex,
            },
            //handle button press
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                    console.log('user wants to pick an image');
                    return;
                    case 1:
                    console.log('user wants to take a photo');
                    return;
                    case 2:
                    console.log('user wants to get their location');
                    default:
                }
            },
        );
    };

    //allows access to user location
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
          const location = await Location.getCurrentPositionAsync({});
          if (location) {
            onSend({
              location: {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
              },
            });
          } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions haven't been granted.");
    }

    //helper method
    const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
        const blob = await response.blob();
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
          const imageURL = await getDownloadURL(snapshot.ref)
          onSend({ image: imageURL })
        });
      }
    
    //allows user to select image from gallery
    const pickImage = async () => {
        //requests permissions, then launches image library to send image
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
          let result = await ImagePicker.launchImageLibraryAsync();
          //cancels action if user denies permissions
          if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
          else Alert.alert("Permissions haven't been granted.");
        }
    }
    
    //allows user to take photo via the app
    const takePhoto = async () => {
        //requests permissions then launches camera
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
          let result = await ImagePicker.launchCameraAsync();
          //cancels action if user denies permission
          if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
          else Alert.alert("Permissions haven't been granted.");
        }
    }

    //allows uploading multiple images without overwriting previous images
    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
    },
    wrapper: {
      borderRadius: 13,
      borderColor: '#b2b2b2',
      borderWidth: 2,
      flex: 1,
    },
    iconText: {
      color: '#b2b2b2',
      fontWeight: 'bold',
      fontSize: 10,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
});

export default CustomActions;