import { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

//the actual chat component
const Chat = ({ route, navigation, db }) => {
  const [messages, setMessages] = useState([]);
  const { name, color, userID } = route.params;

  useEffect(() => {
    //This sets the title of the page to be the username entered in Start.js
    navigation.setOptions({ title: name, color: color, userID: userID });
  });

  useEffect(() => {
    navigation.setOptions({ title: name });
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      setMessages(newMessages);
    });
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

  //When you send a message, this function runs and adds your message to the stored array of messages
  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0]);
  };

  //Turns the left speech bubble white and the right bubble black
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
          left: {
            backgroundColor: '#FFF',
          },
        }}
      />
    );
  };

  //Renders the chatroom as a view that takes up the whole screen, and a giftedchat component
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
      />
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
  },
});

export default Chat;
