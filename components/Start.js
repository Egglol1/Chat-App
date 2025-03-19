import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

//the equivalent to a login screen, first one we see
const Start = ({ navigation }) => {
  //state variables which store the user's name and the background color they choose
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  return (
    <ImageBackground source={require('../assets/background.png')}>
      <View>
        <Text style={styles.appTitle}>App Title</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Type your username here"
            placeholderTextColor="rgba(117, 112, 131, 0.5)"
          />
        </View>
        <View>
          <Text>Choose Background Color:</Text>
          <View style={styles.bgColorContainer}>
            {/*Buttons to select the background color, each button, when selected, will send its color to the next screen*/}
            <TouchableOpacity
              style={{ backgroundColor: '#090C08', flex: 'row' }}
              width={50}
              height={50}
              borderRadius={25}
              onPress={() => setColor('#090C08')}
            />
            <TouchableOpacity
              style={{ backgroundColor: '#474056', flex: 'row' }}
              width={50}
              height={50}
              borderRadius={25}
              onPress={() => setColor('#474056')}
            />
            <TouchableOpacity
              style={{ backgroundColor: '#8A95A5', flex: 'row' }}
              width={50}
              height={50}
              borderRadius={25}
              onPress={() => setColor('#8A95A5')}
            />
            <TouchableOpacity
              style={{ backgroundColor: '#B9C6AE', flex: 'row' }}
              width={50}
              height={50}
              borderRadius={25}
              onPress={() => setColor('#B9C6AE')}
            />
          </View>
        </View>
        <Button
          title="Go to Screen2"
          onPress={() =>
            navigation.navigate('Screen2', { name: name }, { color: color })
          }
          style={styles.startButton}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    height: '44%',
    width: '88%',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 50,
    marginBottom: 50,
  },
  textInput: {
    width: '100%',
    height: 50,
    fontSize: 16,
    fontWeight: '300',
    color: 'black',
    opacity: '50%',
  },
  startButton: {
    fontSize: 16,
    width: '88%',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#757083',
  },
});

export default Start;
