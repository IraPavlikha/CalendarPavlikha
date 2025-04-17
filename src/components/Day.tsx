import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DayProps {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isNextMonth: boolean;
}

const Day: React.FC<DayProps> = ({ day, isCurrentMonth, isToday, isNextMonth }) => {
  const dayStyle = isToday
    ? styles.today
    : isCurrentMonth
    ? styles.currentMonth
    : isNextMonth
    ? styles.nextMonth
    : styles.otherMonth;

  return (
    <View style={styles.dayContainer}>
      <Text style={[styles.dayText, dayStyle]}>{day}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    width: '13%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayText: {
    fontSize: 18,
    color: '#B3B3B3',
  },
  today: {
    backgroundColor: '#FF6347',
    borderRadius: 25,
    color: '#303030',
    fontWeight: 'bold',
  },
  currentMonth: {
    color: '#B3B3B3',
  },
  nextMonth: {
    color: '#6B6B6B',
  },
  otherMonth: {
    color: '#6B6B6B',
  },
});

export default Day;
