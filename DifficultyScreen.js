import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DifficultyScreen = ({ navigation }) => {
  const startGame = (difficulty) => {
    navigation.navigate('Game', { difficulty });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Оберіть рівень складності</Text>

      <Text style={styles.subtitle}>Від легкого до складного</Text>

      <TouchableOpacity
        style={[styles.button, styles.easyButton]}
        onPress={() => startGame('easy')}
      >
        <Text style={styles.buttonText}>Легкий</Text>
        <Text style={styles.buttonDescription}>Для початківців</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.mediumButton]}
        onPress={() => startGame('medium')}
      >
        <Text style={styles.buttonText}>Середній</Text>
        <Text style={styles.buttonDescription}>Для досвідчених</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.hardButton]}
        onPress={() => startGame('hard')}
      >
        <Text style={styles.buttonText}>Складний</Text>
        <Text style={styles.buttonDescription}>Для експертів</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FC',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2C5BB4',
  },
  subtitle: {
    fontSize: 16,
    color: '#5D8BF4',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#A7C7E7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  easyButton: {
    backgroundColor: '#D4E6FF',
    borderWidth: 2,
    borderColor: '#A7C7E7',
  },
  mediumButton: {
    backgroundColor: '#A7C7E7',
    borderWidth: 2,
    borderColor: '#5D8BF4',
  },
  hardButton: {
    backgroundColor: '#5D8BF4',
    borderWidth: 2,
    borderColor: '#2C5BB4',
  },
  buttonText: {
    color: '#2C5BB4',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonDescription: {
    color: '#4A6FA5',
    fontSize: 14,
    marginTop: 5,
  },
});

export default DifficultyScreen;