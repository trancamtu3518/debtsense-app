import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { askCoach } from '../services/aiService';

import {
  Colors,
  Spacing,
  Radius,
} from '../constants/theme';

export default function VoiceAssistantScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [profile, setProfile] = useState('avoider');
  const [aiReply, setAiReply] = useState('');

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

  const fakeListen = async () => {
    setLoading(true);
    setAiReply('');
    setTranscript('');

    setTimeout(async () => {
      const userText = 'Tôi đang rất lo về khoản vay sinh viên';
      setTranscript(userText);
      setLoading(false);

      // Pre-fetch the AI response to make the TTS playback faster and dynamic
      try {
        setLoading(true);
        const result = await askCoach(userText, profile);
        setAiReply(result.reply);
      } catch (error) {
        console.warn("FastAPI/Gemini connection failed, using fallback response:", error);
        setAiReply('Mình hiểu cảm giác đó. Bạn không cần giải quyết toàn bộ khoản nợ hôm nay. Chỉ cần hoàn thành bước tiếp theo.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const speakResponse = () => {
    const textToSpeak = aiReply || 'Mình hiểu cảm giác đó. Bạn không cần giải quyết toàn bộ khoản nợ hôm nay. Chỉ cần hoàn thành bước tiếp theo.';
    Speech.speak(textToSpeak, { language: 'vi-VN' });
  };

  return (
    <View style={styles.container}>
      {navigation?.canGoBack() && (
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>
        🎤 Voice Assistant
      </Text>

      <Text style={styles.subtitle}>
        Nói về cảm xúc tài chính của bạn
      </Text>

      <TouchableOpacity
        style={styles.mic}
        onPress={fakeListen}
        disabled={loading}
      >
        <Text style={styles.micIcon}>
          🎙️
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.teal700}
        />
      )}

      {!!transcript && !loading && (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>
              Bạn vừa nói:
            </Text>

            <Text style={styles.content}>
              "{transcript}"
            </Text>
          </View>

          {!!aiReply && (
            <View style={[styles.card, { backgroundColor: Colors.teal50 }]}>
              <Text style={[styles.label, { color: Colors.teal700 }]}>
                DebtSense AI trả lời:
              </Text>
              <Text style={styles.content}>
                {aiReply}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={speakResponse}
          >
            <Text style={styles.buttonText}>
              Nghe phản hồi AI 🔊
            </Text>
          </TouchableOpacity>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },

  backBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
  },

  backText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 15,
    color: Colors.ink,
  },

  title: {
    fontSize: 28,
    fontFamily: 'BeVietnamPro-Bold',
    color: Colors.teal900,
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 32,
    color: Colors.inkMid,
    fontFamily: 'BeVietnamPro-Regular',
  },

  mic: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.teal700,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  micIcon: {
    fontSize: 56,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: Radius.lg,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  label: {
    fontFamily: 'BeVietnamPro-Bold',
    marginBottom: 8,
    color: Colors.ink,
  },

  content: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro-Regular',
    color: Colors.inkMid,
    lineHeight: 22,
  },

  button: {
    backgroundColor: Colors.teal700,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: Radius.pill,
  },

  buttonText: {
    color: '#fff',
    fontFamily: 'BeVietnamPro-Bold',
  }
});