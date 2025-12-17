import { useLocalSearchParams } from "expo-router";
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// unused page, will delete once I fix the events in dashboard router

const EventPage = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

// for speciifc events
  return (
    <View>
      <SafeAreaView>
        <Text>{id}</Text>
      </SafeAreaView>
    </View>
  )
}

export default EventPage