import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
//Allows usage of images
import * as ImagePicker from 'expo-image-picker';

//Allows usage of geolocation
import * as Location from 'expo-location';

//Allows usage of firebase storage
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  user,
}) => {
  const actionSheet = useActionSheet();

  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split('/').pop();
    return `${user._id}-${timeStamp}-${imageName}`;
  };

  const uploadAndSendImage = async (imageURI) => {
    try {
      const uniqueRefString = generateReference(imageURI);
      const newUploadRef = ref(storage, uniqueRefString);
      const response = await fetch(imageURI);
      const blob = await response.blob();
      uploadBytes(newUploadRef, blob).then(async (snapshot) => {
        const imageURL = await getDownloadURL(snapshot.ref);
        console.log(imageURL);
        onSend([
          {
            _id: Math.round(Math.random() * 1000000), // Ensure unique ID
            createdAt: new Date(),
            user: {
              _id: user._id,
              name: user.name,
            },
            image: imageURL, // Correct field for GiftedChat image messages
          },
        ]);
      });
    } catch (error) {
      console.error('Image upload failed: ', error);
      Alert.alert('Failed to upload image');
    }
  };

  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        const imageURI = result.assets[0].uri;
        await uploadAndSendImage(imageURI);
      } else {
        Alert.alert("Permissions haven't been granted.");
      }
    }
  };

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  const getLocation = async () => {
    console.log('Starting getLocation function');

    try {
      let permissions = await Location.requestForegroundPermissionsAsync();
      console.log('Location permissions result:', permissions);

      if (!permissions.granted) {
        console.error('Location permission not granted!');
        Alert.alert('Location permission not granted.');
        return;
      }

      console.log('Requesting location...');

      // Set timeout to prevent infinite waiting
      const location = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Location request timed out')),
            5000
          )
        ),
      ]);

      console.log('Location fetched:', location);

      if (!location || !location.coords) {
        console.error('Location data is missing or undefined');
        Alert.alert('Error fetching location data.');
        return;
      }

      const validUser = {
        _id: user?._id || 'Anonymous',
        name: user?.name || 'Anonymous',
      };

      const locationMessage = {
        _id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        user: validUser,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        text: 'Sent a location',
      };

      console.log('Sending location message:', locationMessage);
      onSend([locationMessage]);
    } catch (error) {
      console.error('Error in getLocation:', error);
      Alert.alert('Error fetching location:', error.message);
    }
  };

  const onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('User wants to pick an image');
            pickImage();
            break;
          case 1:
            console.log('User wants to take a photo');
            takePhoto();
            break;
          case 2:
            console.log('User wants to get their location');
            if (onSend) {
              getLocation();
            } else {
              console.error('onSend is not defined!');
            }
            break;
          default:
            console.log('Action canceled');
        }
      }
    );
  };

  return (
    <TouchableOpacity
      accessibilityLabel="More options"
      accessibilityHint="Lets you choose to send an image or your geolocation"
      accessibilityRole="button"
      style={styles.container}
      onPress={onActionPress}
      accessible={true}
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

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
