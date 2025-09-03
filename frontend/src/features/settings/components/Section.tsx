import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { SectionProps } from './types';

import { Text } from '@/shared/ui';

export default function Section({ title, style, children }: SectionProps) {
  return (
    <View style={[styles.container, style]}>
      <Text variant="title" weight="semibold" style={styles.sectionTitle}>{title}</Text>
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  childrenContainer: {
    gap: 12,
  },
});
