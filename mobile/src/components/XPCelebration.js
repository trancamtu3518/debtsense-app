import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, Easing, StyleSheet, Text } from 'react-native';

const CONFETTI_COUNT = 24;

function ConfettiPiece({ delay, containerWidth }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0)).current;

  const startX = useMemo(() => (Math.random() - 0.5) * containerWidth, []);
  const drift = useMemo(() => (Math.random() - 0.5) * 80, []);
  const size = useMemo(() => 6 + Math.random() * 8, []);
  const color = useMemo(() => {
    const colors = ['#14B8A6', '#5EEAD4', '#F59E0B', '#FB923C', '#A78BFA', '#34D399', '#FBBF24'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);
  const shape = useMemo(() => Math.random() > 0.5 ? 'circle' : 'square', []);
  const duration = useMemo(() => 1500 + Math.random() * 1000, []);

  useEffect(() => {
    translateY.setValue(-20);
    translateX.setValue(startX);
    rotate.setValue(0);
    opacity.setValue(1);
    scale.setValue(0);

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 200 + Math.random() * 100,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: startX + drift,
          duration,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 2 + Math.random() * 4,
          duration,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(duration * 0.6),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration * 0.4,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        width: size,
        height: shape === 'circle' ? size : size * 1.5,
        borderRadius: shape === 'circle' ? size / 2 : 2,
        backgroundColor: color,
        opacity,
        transform: [
          { translateX },
          { translateY },
          { rotate: spin },
          { scale },
        ],
      }}
    />
  );
}

export default function XPCelebration({ show, xpGained, containerWidth = 300 }) {
  const textScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (show) {
      textScale.setValue(0);
      textOpacity.setValue(0);

      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.spring(textScale, {
            toValue: 1,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1500),
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [show]);

  if (!show) return null;

  return (
    <View style={[styles.container, { width: containerWidth }]} pointerEvents="none">
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
        <ConfettiPiece key={i} delay={i * 40} containerWidth={containerWidth} />
      ))}
      <Animated.View style={{ transform: [{ scale: textScale }], opacity: textOpacity }}>
        <Text style={styles.xpText}>+{xpGained} XP ✨</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 999,
  },
  xpText: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 28,
    color: '#14B8A6',
    textShadowColor: 'rgba(20, 184, 166, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
});
