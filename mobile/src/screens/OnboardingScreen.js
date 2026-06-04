import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OnboardingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DebtSense</Text>
      <Text style={styles.subtitle}>Giải quyết lo lắng tài chính, một bước một</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('AnxietyScan')}
      >
        <Text style={styles.buttonText}>Bắt Đầu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1A6B5A',
    marginBottom: 20
  },
  subtitle: {
    fontSize: 18,
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 60
  },
  button: {
    backgroundColor: '#1A6B5A',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  }
});
