import { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

//the actual chat component
const Chat = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const { name, color } = route.params;

  useEffect(() => {
    //This sets the title of the page to be the username entered in Start.js
    navigation.setOptions({ title: name, color: color });
  });

  useEffect(() => {
    //This sets the messages variable to a test message, for dev eyes only
    setMessages([
      {
        _id: 1,
        text: 'Developer Message: WAZZAAAA',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'System Message: WAZZAAAA',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  //When you send a message, this function runs and adds your message to the stored array of messages
  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
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
          _id: 1,
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
