import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

//Import firebase for real-time database usage
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// import the screens we want to navigate
import Start from './components/Start';
import Chat from './components/Chat';

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
  //Initialize firebase
  const app = initializeApp(firebaseConfig);

  //Initialize cloud firestore and get reference for the service
  const db = getFirestore(app);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
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
