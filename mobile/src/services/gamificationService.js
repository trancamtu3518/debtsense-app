import AsyncStorage from '@react-native-async-storage/async-storage';

const XP_KEY = 'zenExp';

export const getZenLevel = (xp) => {
  if (xp < 20) return { level: 1, name: 'Mầm non', emoji: '🌱', nextAt: 20 };
  if (xp < 50) return { level: 2, name: 'Cây non', emoji: '🌿', nextAt: 50 };
  if (xp < 100) return { level: 3, name: 'Cây trưởng thành', emoji: '🌳', nextAt: 100 };
  return { level: 4, name: 'Cây cổ thụ', emoji: '✨🌳✨', nextAt: 999 };
};

export const getZenXP = async () => {
  const xpStr = await AsyncStorage.getItem(XP_KEY);
  return xpStr ? parseInt(xpStr, 10) : 0;
};

export const addZenXP = async (points) => {
  const currentXP = await getZenXP();
  const newXP = currentXP + points;
  await AsyncStorage.setItem(XP_KEY, newXP.toString());
  return newXP;
};

// Hàm tiện ích để biết được % tiến trình lên cấp
export const getLevelProgress = (xp) => {
  const currentLevelInfo = getZenLevel(xp);
  
  // Tính mốc xp bắt đầu của level này
  let levelStartXP = 0;
  if (currentLevelInfo.level === 2) levelStartXP = 20;
  else if (currentLevelInfo.level === 3) levelStartXP = 50;
  else if (currentLevelInfo.level === 4) levelStartXP = 100;
  
  if (currentLevelInfo.level === 4) return 100; // Đạt max

  const totalNeededForNext = currentLevelInfo.nextAt - levelStartXP;
  const xpIntoCurrentLevel = xp - levelStartXP;
  return Math.min(100, Math.round((xpIntoCurrentLevel / totalNeededForNext) * 100));
};
