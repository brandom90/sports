import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Event, athletes} from '../dummyData'

type Event = {
  id: string; // Unique Event ID
  title: string; // 'Lifting', 'Team Meeting', 'Game'
  location: string; // 'Weightroom', 'Field'
  date: string;
  time: string; // '6 am'
  type: 'event' | 'practice' | 'game'; // Type of event
  teamId?: string; // (Optional) The team this event belongs to
  practiceId?: string; // (Optional) If it's a practice, link to a PracticePlan
  notes?: string; // (Optional) Additional notes for the event
};


const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [detailsPopup, setDetailsPopup] = useState<Boolean>(false)
 
  // dont need to worry about athletes being < 1 because how else did they log in
  const currentUser = athletes.find(item => item.id == 'athlete1')
  const [filteredEventsList, setFilteredEventsList] = useState(
    Event.filter(item => item.teamId === currentUser?.teamId)
  )
  

  const headerDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  useEffect(() => {
    const firstDay = startOfMonth(currentDate);
    const lastDay = endOfMonth(currentDate);
    const dateInterval = { start: firstDay, end: lastDay };
    let dayList = eachDayOfInterval(dateInterval);


    // Add days from previous month to fill the first week (corrected version)
    const prevMonthDays = firstDay.getDay(); // Number of days needed from previous month
    const prevMonthStart = new Date(firstDay);
    prevMonthStart.setDate(prevMonthStart.getDate() - prevMonthDays);

    const prevDays = [];
    for (let i = 0; i < prevMonthDays; i++) {
      const prevDay = new Date(prevMonthStart);
      prevDay.setDate(prevDay.getDate() + i);
      prevDays.push(prevDay);
    }
    dayList = [...prevDays, ...dayList];

    // Add days from next month to fill the last week
    const endDay = lastDay.getDay();
    const daysNeeded = 6 - endDay;
    const nextMonthStart = new Date(lastDay);
    nextMonthStart.setDate(nextMonthStart.getDate() + 1);

    const nextDays = [];
    for (let i = 0; i < daysNeeded; i++) {
      const nextDay = new Date(nextMonthStart);
      nextDay.setDate(nextDay.getDate() + i);
      nextDays.push(nextDay);
    }
    dayList = [...dayList, ...nextDays];

    setDays(dayList);
  }, [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // contains my valuable data
  const [chosenDatesEvents, setChosenDatesEvents] = useState<Event[]>([]);
  
  const handleDateSelect = (day: Date) => {
    setDetailsPopup(false)
    if (selectedDate === day) {
      setSelectedDate(null)
    } else {
      const comparingDates = filteredEventsList.filter(item => {
        return item.date === format(day, 'yyyy-MM-dd');
      });
      setChosenDatesEvents(comparingDates);
      setSelectedDate(day);
      if (comparingDates.length > 0) {
        setDetailsPopup(true)
        console.log(comparingDates)
      }

    }
  };

  const isCurrentMonth = (day: Date) => isSameMonth(day, currentDate);
  const isSelected = (day: Date) => selectedDate && isSameDay(day, selectedDate);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 55 }}>
        <View style={styles.calendarContainer}>
          {/* Month Header */}
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={goToPreviousMonth}>
              <Text style={styles.navButton}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{format(currentDate, 'MMMM yyyy')}</Text>
            <TouchableOpacity onPress={goToNextMonth}>
              <Text style={styles.navButton}>›</Text>
            </TouchableOpacity>
          </View>
          
          {/* Day Headers */}
          <View style={styles.dayHeader}>
            {headerDays.map((day, index) => (
              <Text key={index} style={styles.dayHeaderText}>{day}</Text>
            ))}
          </View>
          
          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {days.map((day, index) => {
              const dayNumber = format(day, 'd');
              const isMonth = isCurrentMonth(day);
              const isActive = isSelected(day);
              return (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.dayCell,
                    !isMonth && styles.nonMonthDay,
                    isActive && styles.selectedDay,
 
                  ]}
                  onPress={() => handleDateSelect(day)}
                >
                  <Text style={[
                    styles.dayText,
                    !isMonth && styles.nonMonthDayText,
                    isActive && styles.selectedDayText
                  ]}>
                    {dayNumber}
                  </Text>
                  
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View>
          {
            detailsPopup ? (
              <View style={styles.detailsSection}>
                {chosenDatesEvents.map((event, index) => (
                  <View key={index} style={{ marginBottom: 8 }} className='rounded-xl bg-[#7DC9F3] p-2'>
                    <Text className='font-rubik-bold color-white text-[25px]'>da</Text>
                    <Text className='font-rubik-bold color-black border-b-2'>{event.notes}</Text>
                    <Text className='font-rubik-bold color-black'>{event.location}</Text>
                    <Text className='font-rubik-bold color-black'>{event.time}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noDateSelected}>
                <Text className='color-white text-[20px]'>Select an event for more details</Text>
              </View>
            )
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    margin: 16,
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  navButton: {
    fontSize: 44,
    color: '#FFD700',
    paddingHorizontal: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingBottom: 8,
  },
  dayHeaderText: {
    width: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    height: 180
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',

    borderColor: 'white',
    borderBottomWidth:1
  },
  dayText: {
    fontSize: 16,
    color: 'white',
  },
  nonMonthDay: {
    backgroundColor: '#333',

  },
  nonMonthDayText: {
    color: '#ccc',
  },
  selectedDay: {
    backgroundColor: '#FFD700',
  },
  selectedDayText: {
    color: 'black',
    fontWeight: 'bold',
  },
  eventDay: {
    position: 'relative',
  },
  detailsSection: {
    flex:1, backgroundColor:'#1E90FF', borderTopLeftRadius: 20, borderTopRightRadius:20, padding:15
  },
  noDateSelected: {
    flex:1,justifyContent:'center',alignItems:'center'
  },
 
});

export default Calendar;