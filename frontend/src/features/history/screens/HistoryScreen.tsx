import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native';

import { useHistory } from '../hooks/useHistory';
import CardItem from '../components/CardItem';

import { auth } from '@/shared/services';

export default function HistoryScreen() {
  const uid = auth.currentUser?.uid ?? '';
  const { data = [], refetch, isFetching } = useHistory(uid);

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item.spinId ?? String(index)}
      renderItem={({ item }) => <CardItem item={item} />}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={<Text style={styles.emptyContainer}>No spins yet</Text>}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    textAlign: 'center',
    marginTop: 24,
  }
})
