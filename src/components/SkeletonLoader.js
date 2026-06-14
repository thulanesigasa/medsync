import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function SkeletonLoader({ width, height, borderRadius, style, isDark }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[
      styles.skeleton, 
      { 
        width, 
        height, 
        borderRadius: borderRadius || 8, 
        opacity,
        backgroundColor: isDark ? '#334155' : '#E2E8F0'
      }, 
      style
    ]} />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    // default background
  }
});
