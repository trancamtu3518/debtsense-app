import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, Radius } from '../constants/theme';

import { LinearGradient } from 'expo-linear-gradient';

const AnimatedProgressBar = ({ progress, style, color }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.background}>
        <Animated.View style={[styles.fill, { width }]}>
          <LinearGradient
            colors={['#14B8A6', '#5EEAD4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  background: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.teal700,
    borderRadius: Radius.sm,
  },
});

export default AnimatedProgressBar;
