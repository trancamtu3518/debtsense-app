import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const PARTICLE_COUNT = 12;

function Particle({ delay, treeLevel, containerSize }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  const startX = useMemo(() => (Math.random() - 0.5) * containerSize * 0.6, [containerSize]);
  const driftX = useMemo(() => (Math.random() - 0.5) * 40, []);
  const size = useMemo(() => 4 + Math.random() * 6, []);
  const duration = useMemo(() => 2500 + Math.random() * 2000, []);
  const color = useMemo(() => {
    const colors = ['#5EEAD4', '#14B8A6', '#99F6E4', '#2DD4BF', '#CCFBF1'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  useEffect(() => {
    const animate = () => {
      opacity.setValue(0);
      translateY.setValue(0);
      translateX.setValue(startX);
      scale.setValue(0);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: duration * 0.3,
            useNativeDriver: true, easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(translateY, {
            toValue: -(60 + Math.random() * 60),
            duration: duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true, easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(translateX, {
            toValue: startX + driftX,
            duration: duration,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true, easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: duration * 0.4,
            useNativeDriver: true, easing: Easing.inOut(Easing.ease),
          }),
          Animated.sequence([
            Animated.delay(duration * 0.6),
            Animated.timing(opacity, {
              toValue: 0,
              duration: duration * 0.4,
              useNativeDriver: true, easing: Easing.inOut(Easing.ease),
            }),
          ]),
        ]),
      ]).start(() => animate());
    };

    if (treeLevel >= 2) {
      animate();
    }
  }, [treeLevel]);

  if (treeLevel < 2) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: '50%',
        left: '50%',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateX }, { translateY }, { scale }],
      }}
    />
  );
}

export default function ZenTreeVisual({ level, xp, nextAt }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Gentle pulse for the tree
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 2000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true, easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true, easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  // Glow effect for level 3+
  useEffect(() => {
    if (level >= 3) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 1500,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true, easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(glowAnim, {
            toValue: 0.2,
            duration: 1500,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true, easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    }
  }, [level]);

  // Entrance bounce
  useEffect(() => {
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 3,
      tension: 80,
      useNativeDriver: true, easing: Easing.inOut(Easing.ease),
    }).start();
  }, []);

  const treeEmoji = level >= 4 ? '🌳' : level >= 3 ? '🌳' : level >= 2 ? '🌿' : '🌱';
  const treeSize = level >= 4 ? 90 : level >= 3 ? 80 : level >= 2 ? 68 : 56;
  const containerSize = 180;

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }]}>
      {/* Glow ring for high levels */}
      {level >= 3 && (
        <Animated.View
          style={[
            styles.glowRing,
            {
              opacity: glowAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}

      {/* Sparkle ring for max level */}
      {level >= 4 && (
        <Animated.View
          style={[
            styles.sparkleRing,
            {
              opacity: glowAnim,
              transform: [{ scale: Animated.multiply(pulseAnim, 1.15) }],
            },
          ]}
        />
      )}

      {/* Floating particles */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle
          key={i}
          delay={i * 350}
          treeLevel={level}
          containerSize={containerSize}
        />
      ))}

      {/* The tree itself */}
      <Animated.View
        style={{
          transform: [
            { scale: Animated.multiply(pulseAnim, bounceAnim) },
          ],
        }}
      >
        <View style={styles.treeEmoji}>
          <Animated.Text style={{ fontSize: treeSize, textAlign: 'center' }}>
            {treeEmoji}
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#5EEAD4',
  },
  sparkleRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#99F6E4',
  },
  treeEmoji: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
