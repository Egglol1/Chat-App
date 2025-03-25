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

//the equivalent to a login screen, first one we see
const Start = ({ navigation }) => {
  //state variables which store the user's name and the background color they choose
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  const colorStyles = [
    { color: '#090C08', styleKey: 'black' },
    { color: '#474056', styleKey: 'darkGray' },
    { color: '#8A95A5', styleKey: 'gray' },
    { color: '#B9C6AE', styleKey: 'lightGreen' },
  ];

  return (
    //This is the background image of teh app, its a few people smiling together
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.backgroundMain}
    >
      <View>
        {/*The title of the app, what's there to say?*/}
        <Text style={styles.appTitle}>App Title</Text>
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
            {colorStyles.map((item, index) => (
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="Color"
                accessibilityHint="Lets you choose the background color of the next page."
                accessibilityRole="button"
                key={index}
                style={[
                  styles.bgColorBtn,
                  styles[item.styleKey],
                  color === item.color && styles.selected,
                ]}
                onPress={() => setColor(item.color)}
              />
            ))}
          </View>
        </View>
        {/*If TextInput is the login textbox, this is the button to log in, it'll send you to the chat screen */}
        <Button
          title="Start Chatting"
          onPress={() =>
            navigation.navigate('Chat', { name: name }, { color: color })
          }
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
