import { StyleSheet, LogBox, Alert } from 'react-native';
import { useEffect } from 'react';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

//Import firebase for real-time database usage
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';

// import the screens we want to navigate
import Start from './components/Start';
import Chat from './components/Chat';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';

const Stack = createNativeStackNavigator();

//the app's main component that renders its UI
const App = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyB66rDFLyOxLDZpI1c0Bw9eNn__Et-Q_OA',
    authDomain: 'shopping-list-demo-c617e.firebaseapp.com',
    projectId: 'shopping-list-demo-c617e',
    storageBucket: 'shopping-list-demo-c617e.firebasestorage.app',
    messagingSenderId: '627379340742',
    appId: '1:627379340742:web:27263e2e67baed28931ec7',
  };

  const netInfo = useNetInfo();

  //Initialize firebase
  const app = initializeApp(firebaseConfig);

  //Initialize cloud firestore and get reference for the service
  const db = getFirestore(app);

  useEffect(() => {
    if (netInfo.isConnected === false) {
      Alert.alert('Connection lost!');
      disableNetwork(db);
    } else if (netInfo.isConnected === true) {
      enableNetwork(db);
    }
  }, [netInfo.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat isConnected={netInfo.isConnected} db={db} {...props} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
