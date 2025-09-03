import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { HistoryCardItem } from '../types';

import { useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';

export default function CardItem({ item }: HistoryCardItem) {
  const t = useTheme();

  if (!item) return null;

  return (
    <View style={[
      {
        backgroundColor: t.colors.surface,
        borderRadius: t.radius.sm,
      },
      styles.container,
      t.border.thin,
    ]}>
      <Text variant="body" weight="semibold">{item.label}</Text>
      <Text variant="caption" muted>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 4,
  },
});
