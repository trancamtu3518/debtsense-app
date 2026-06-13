import { Platform } from 'react-native';

// Default Android emulator endpoint. Adjust to your machine's local IP (e.g., 'http://192.168.1.X:8000') if testing on a real device.
const API_URL = Platform.select({
  web: 'http://localhost:8000',
  android: 'http://192.168.1.161:8000',
  default: 'http://192.168.1.161:8000',
});
 

export async function askCoach(message, profile = 'avoider') {
  const response = await fetch(`${API_URL}/coach`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      profile,
    }),
  });

  if (!response.ok) {
    throw new Error('AI Coach service error');
  }

  return response.json();
}
