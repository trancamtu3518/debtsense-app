import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius } from '../constants/theme';
import { askCoach } from '../services/aiService';

export default function AICoachScreen() {
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState('avoider');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Xin chào 👋 Mình là DebtSense Coach. Hôm nay bạn đang cảm thấy thế nào?',
    },
  ]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const raw = await AsyncStorage.getItem('stressProfile');
    if (raw) {
      const data = JSON.parse(raw);
      setProfile(data.profileType || 'avoider');
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        text: userMessage,
      },
    ]);

    setMessage('');

    try {
      const result = await askCoach(userMessage, profile);

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: result.reply,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Xin lỗi, hiện tại mình chưa thể kết nối tới Coach. Hãy thử lại sau nhé 🌱',
        },
      ]);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.message,
        item.role === 'user'
          ? styles.userMessage
          : styles.aiMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.role === 'user'
            ? styles.userMessageText
            : styles.aiMessageText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        🤖 AI Financial Coach
      </Text>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Chia sẻ cảm xúc của bạn..."
          style={styles.input}
          placeholderTextColor={Colors.inkLight}
        />

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={sendMessage}
        >
          <Text style={{ color: '#fff', fontFamily: 'BeVietnamPro-SemiBold' }}>
            Gửi
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: Spacing.lg,
    paddingTop: 60,
  },

  header: {
    fontSize: 24,
    fontFamily: 'BeVietnamPro-Bold',
    marginBottom: 20,
    color: Colors.teal900,
  },

  message: {
    padding: 12,
    borderRadius: Radius.md,
    marginBottom: 10,
    maxWidth: '85%',
  },

  userMessage: {
    backgroundColor: Colors.teal700,
    alignSelf: 'flex-end',
  },

  aiMessage: {
    backgroundColor: Colors.surface,
    alignSelf: 'flex-start',
  },

  messageText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    lineHeight: 20,
  },

  userMessageText: {
    color: '#fff',
  },

  aiMessageText: {
    color: Colors.ink,
  },

  inputRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 20,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    height: 48,
    color: Colors.ink,
    fontFamily: 'BeVietnamPro-Regular',
  },

  sendBtn: {
    backgroundColor: Colors.teal700,
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRadius: Radius.md,
    height: 48,
  },
});
