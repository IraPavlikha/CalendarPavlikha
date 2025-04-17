// App.tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Calendar from './src/components/Calendar';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Calendar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,  // Додаємо відступ зверху
  },
});

export default App;
