import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  Image,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

//the actual chat component
const Chat = ({ route, navigation, db, isConnected, Storage }) => {
  const [messages, setMessages] = useState([]);
  const { name, color = 'white', userID } = route.params || {};

  useEffect(() => {
    //This sets the title of the page to be the username entered in Start.js
    navigation.setOptions({ title: name, color: color, userID: userID });
  });

  let unsubMessages = useRef(null);
  useEffect(() => {
    if (isConnected) {
      //unregister current listener to avoid registering multiple as useEffect gets re-executed
      if (unsubMessages.current) unsubMessages.current();
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubMessages.current = onSnapshot(q, async (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text || '',
            user: {
              _id: data.user?._id || 'Anonymous',
              name: data.user?.name || 'Anonymous',
            },
            createdAt: data.createdAt?.toMillis
              ? new Date(data.createdAt.toMillis())
              : new Date(),
            location: data.location || null,
            image: data.image || null,
          };
        });
        cacheMessages(newMessages);
        try {
          await AsyncStorage.setItem('messages', JSON.stringify(newMessages));
        } catch (error) {
          console.error('AsyncStorage Save Error:', error);
        }
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    return () => {
      if (unsubMessages.current) unsubMessages.current();
    };
  }, [db, navigation, name, isConnected]);

  const loadCachedMessages = async () => {
    try {
      const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.error('Error loading cached messages', error);
    }
  };

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  //does not render the input bar if there is no internet connection
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  //When you send a message, this function runs and adds your message to the stored array of messages
  const onSend = async (newMessages = []) => {
    newMessages.forEach(async (message) => {
      console.log('Processing message in onSend:', message); // debug log

      try {
        const validUser = {
          _id: message.user?._id || 'Anonymous',
          name: message.user?.name || 'Anonymous',
        };

        const messageToSend = {
          _id: message._id,
          text: message.text || '',
          user: validUser,
          createdAt: new Date(),
        };

        if (message.location) {
          messageToSend.location = message.location;
        }

        if (message.image) {
          messageToSend.image = message.image;
        }

        console.log('Saving to Firestore:', messageToSend);

        await addDoc(collection(db, 'messages'), messageToSend);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });
  };

  //Turns the left speech bubble white and the right bubble black, also catches unusual message types
  const renderBubble = (props) => {
    const { currentMessage } = props;

    if (currentMessage?.image) {
      console.log('Rendering image:', currentMessage.image); // Debugging
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: { backgroundColor: '#000', padding: 10, borderRadius: 15 },
            left: { backgroundColor: '#FFF', padding: 10, borderRadius: 15 },
          }}
        >
          <View style={{ marginTop: 5 }}>
            <Image
              source={{ uri: currentMessage.image }}
              style={{ width: 200, height: 150, borderRadius: 10 }}
              resizeMode="cover"
            />
          </View>
        </Bubble>
      );
    }

    if (currentMessage?.location) {
      console.log('Rendering location:', currentMessage.location); // Debugging
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: { backgroundColor: '#000', padding: 10, borderRadius: 15 },
            left: { backgroundColor: '#FFF', padding: 10, borderRadius: 15 },
          }}
        >
          <MapView
            style={{ width: 200, height: 150, borderRadius: 10 }}
            initialRegion={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          />
        </Bubble>
      );
    }

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: '#000', padding: 10, borderRadius: 15 },
          left: { backgroundColor: '#FFF', padding: 10, borderRadius: 15 },
        }}
        textStyle={{
          right: { color: '#FFF' },
          left: { color: '#000' },
        }}
      />
    );
  };

  const renderCustomActions = (props) => {
    return (
      <CustomActions
        {...props}
        user={{ _id: userID || 'Anonymous', name: name || 'Anonymous' }}
        onSend={onSend}
        storage={Storage}
      />
    );
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (
      currentMessage?.location?.latitude &&
      currentMessage?.location?.longitude
    ) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          initialRegion={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        />
      );
    }
    return null;
  };

  //Renders the chatroom as a view that takes up the whole screen, and a giftedchat component
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      {isConnected !== false ? (
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          onSend={(messages) => onSend(messages)}
          renderActions={renderCustomActions}
          renderCustomView={renderCustomView}
          user={{
            _id: userID || 'Anonymous',
            name: name || 'Anonymous',
          }}
          image
        />
      ) : (
        <>
          <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
            user={{
              _id: userID || 'Anonymous',
              name: name || 'Anonymous',
            }}
          />
          <Text style={styles.offlineText}>
            Offline Mode - Viewing Cached Messages
          </Text>
        </>
      )}
      {/*These compressed if statements make sure the keyboard doesn't block the input element*/}
      {Platform.OS === 'andriod' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  offlineText: { fontSize: 16, textAlign: 'center', margin: 20 },
});

export default Chat;
