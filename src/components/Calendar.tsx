import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { addMonths, subMonths, startOfMonth, endOfMonth, getDaysInMonth, getDay, format } from 'date-fns';
import Header from './Header';
import Day from './Day';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(format(currentDate, 'MMMM'));
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    setCurrentMonth(format(currentDate, 'MMMM'));
    setCurrentYear(currentDate.getFullYear());
  }, [currentDate]);

  const generateCalendarDays = (date: Date) => {
    const startOfCurrentMonth = startOfMonth(date);
    const endOfCurrentMonth = endOfMonth(date);
    const startDay = getDay(startOfCurrentMonth);
    const totalDaysInCurrentMonth = getDaysInMonth(date);
    const days: number[] = [];
    const prevMonthDays = getDaysInMonth(subMonths(date, 1));
    for (let i = prevMonthDays - startDay + 1; i <= prevMonthDays; i++) {
      days.push(i);
    }

    for (let i = 1; i <= totalDaysInCurrentMonth; i++) {
      days.push(i);
    }

    const totalDaysInNextMonth = 42 - days.length;
    for (let i = 1; i <= totalDaysInNextMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const days = generateCalendarDays(currentDate);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      <Header
        month={currentMonth}
        year={currentYear}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        currentDate={currentDate}
      />
      <View style={styles.weekdaysContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekday}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day, index) => (
          <Day
            key={index}
            day={day}
            isCurrentMonth={day > 0 && day <= getDaysInMonth(currentDate)}
            isToday={day === new Date().getDate() && currentMonth === format(new Date(), 'MMMM')}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#303030',
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  weekday: {
    width: '13%',
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 16,
    color: '#B3B3B3',
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default Calendar;
