import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notification = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const savedResults = JSON.parse(await AsyncStorage.getItem('results')) || [];
      setResults(savedResults);
    };

    fetchResults();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.classText}>{item.classDescription}</Text>
            <Text style={styles.confidenceText}>Confidence: {item.confidence.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
     backgroundColor: "#000000"
  },
  resultItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  classText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  confidenceText: {
    fontSize: 14,
    color: '#000000',
  },
});

export default Notification
