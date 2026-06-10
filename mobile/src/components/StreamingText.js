import React, { useState, useEffect, useRef } from 'react';
import { Text, Animated, Easing } from 'react-native';

/**
 * StreamingText: Renders text character by character, like ChatGPT.
 * Props:
 *   - text: The full text to stream
 *   - speed: ms per character (default 25)
 *   - style: text style
 *   - onComplete: callback when streaming finishes
 */
export default function StreamingText({ text, speed = 25, style, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  // Blinking cursor animation
  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.step0,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.step0,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, []);

  // Stream characters
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <Text style={style}>
      {displayedText}
      {!isComplete && (
        <Animated.Text style={{ opacity: cursorOpacity, color: '#14B8A6', fontWeight: 'bold' }}>
          ▊
        </Animated.Text>
      )}
    </Text>
  );
}
