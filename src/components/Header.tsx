import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface HeaderProps {
  month: string;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  currentDate: Date;
}

const Header: React.FC<HeaderProps> = ({ month, year, onPrevMonth, onNextMonth, onToday, currentDate }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDay, setCurrentDay] = useState<string>('');
  const today = new Date();
  const isToday = currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' });

      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      setCurrentDay(dayOfWeek);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{currentTime}</Text>
        <Text style={styles.day}>{currentDay}</Text>
      </View>

      <View style={styles.mainContent}>
        <TouchableOpacity onPress={onPrevMonth}>
          <Text style={styles.arrow}>{"△"}</Text>
        </TouchableOpacity>

        <Text style={[styles.title, isToday && styles.todayHighlight]}>
          {month} {year}
        </Text>

        <TouchableOpacity onPress={onNextMonth}>
          <Text style={styles.arrow}>{"▽"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onToday} style={styles.todayButton}>
          <Text style={styles.today}>Today</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#303030',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  timeContainer: {
    alignItems: 'right',
    marginBottom: 10,
  },
  time: {
    fontSize: 30,
    color: '#B3B3B3',
  },
  day: {
    fontSize: 12,
    color: '#B3B3B3',
    fontWeight: 'normal',
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: '#B3B3B3',
  },
  todayHighlight: {
    color: '#B3B3B3',
  },
  arrow: {
    fontSize: 25,
    color: '#B3B3B3',
  },
  todayButton: {
    backgroundColor: '#303030',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  today: {
    fontSize: 18,
    color: '#B3B3B3',
  },
});

export default Header;
