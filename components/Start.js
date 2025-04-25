import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';

//the equivalent to a login screen, first one we see
const Start = ({ navigation }) => {
  const auth = getAuth();
  //state variables which store the user's name and the background color they choose
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('white');

  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate('Chat', {
          userID: result.user.uid,
          name: name,
          color: selectedColor,
        });
        Alert.alert('Signed in Successfully!');
      })
      .catch((error) => {
        Alert.alert('Unable to sign in, try again later.');
        console.log(error);
      });
  };

  const colorOptions = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];
  const colorLabels = ['Black', 'Purple', 'Blue', 'Green'];

  return (
    //This is the background image of teh app, its a few people smiling together
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.backgroundMain}
    >
      <View>
        {/*The title of the app, what's there to say?*/}
        <Text style={styles.appTitle}>The Chatler</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          {/*Where the user will enter their username, kind of like a login area */}
          <TextInput
            style={styles.textInput}
            value={name || ''}
            onChangeText={setName}
            placeholder="Type your username here"
            placeholderTextColor="rgba(117, 112, 131, 0.5)"
          />
        </View>
        <View>
          <Text style={{ color: '#757083' }}>Choose Background Color:</Text>
          <View style={styles.bgColorContainer}>
            {/*Buttons to select the background color, each button, when selected, will send its color to the next screen*/}
            {colorOptions.map((color, index) => (
              <TouchableOpacity
                accessibilityLabel={`Color: ${colorLabels[index]}`}
                key={`color-button__${color}`}
                title="Got to Screen 2"
                style={[
                  styles.bgColorBtn,
                  { backgroundColor: color },
                  selectedColor === color && {
                    borderWidth: 2,
                    borderColor: '#757083',
                  },
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>
        {/*If TextInput is the login textbox, this is the button to log in, it'll send you to the chat screen */}
        <Button
          title="Start Chatting"
          onPress={() => {
            if (name === '') {
              Alert.alert('Please type a username!');
            } else {
              signInUser();
            }
          }}
          style={styles.button}
        />
        {/*This makes sure the keyboard doesn't cover up any of the input elements */}
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
        {Platform.OS === 'ios' ? (
          <KeyboardAvoidingView behavior="padding" />
        ) : null}
      </View>
    </ImageBackground>
  );
};

//These styles are all named for which component they link to
const styles = StyleSheet.create({
  backgroundMain: {
    flex: 1,
    resizeMode: 'cover',
    paddingBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    height: '44%',
    width: '88%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingLeft: 10,
  },
  textInput: {
    width: '100%',
    height: 50,
    color: 'black',
    opacity: 0.5,
    fontWeight: '300',
    fontSize: 16,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#757083',
    padding: 10,
    width: '100%',
    height: 50,
  },
  bgColorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
  },
  bgColorBtn: {
    width: 35,
    height: 35,
    borderRadius: 25,
    margin: 10,
    backgroundColor: 'red',
  },
  black: {
    backgroundColor: '#090C08',
  },
  darkGray: {
    backgroundColor: '#474056',
  },
  gray: {
    backgroundColor: '#8A95A5',
  },
  lightGreen: {
    backgroundColor: '#B9C6AE',
  },
});

export default Start;
