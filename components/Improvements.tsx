import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { performanceData, athletes, achivements } from '../dummyData';
import icons from "../constants/icons";
import { router } from 'expo-router';


 interface PerformanceMetrics {
    strength: Record<string, number>;
    power: Record<string, number>;
    speed: Record<string, number>;
    explosive: Record<string, number>;
}

interface PerformanceEntry {
    athleteId: string;
    performance: PerformanceMetrics;
    // Add other relevant fields if they exist
}

interface Improvement {
    exercise: string;
    value: number;
    category: keyof PerformanceMetrics;
}

const Improvements = ({player, variant}: { player: string, variant:string }) => {
  // <{ metric: { [key: string]: number } }[]>, 
  // metric is type for dictionary. Keys are type string, values are type number
  const [improvementStats, setImprovementStats] = useState<Record<string, any>[]>([]);

  // assuming practice is each week....pulls the most recent workout
  const getMostRecentPerformance = (athleteId: string) => {
    const athleteData = performanceData
      .filter(entry => entry.athleteId === athleteId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    //console.log(athleteData[0])
    return athleteData[0]; // Most recent performance data
  };
  //const handleCardPress = (id: string) => router.push(`./WorkoutList`)
  


  useEffect(() => {
     const RecentWeek = getMostRecentPerformance('athlete1');
    const FilteredPerformanceData = performanceData.filter(entry => entry.athleteId === 'athlete1');
    const ImprovedItems: Improvement[] = [];
    
    // Type-safe category configuration
    const categories: {
        name: keyof PerformanceMetrics;
        data: Record<string, number>;
        isImprovement: (oldVal: number, newVal: number) => boolean;
    }[] = [
        {
            name: 'strength',
            data: RecentWeek.performance.strength,
            isImprovement: (oldVal, newVal) => newVal > oldVal
        },
        {
            name: 'power',
            data: RecentWeek.performance.power,
            isImprovement: (oldVal, newVal) => newVal > oldVal
        },
        {
            name: 'speed',
            data: RecentWeek.performance.speed,
            isImprovement: (oldVal, newVal) => newVal < oldVal // Lower times are better
        },
        {
            name: 'explosive',
            data: RecentWeek.performance.explosive,
            isImprovement: (oldVal, newVal) => newVal > oldVal
        }
    ];

    // Process each category
    categories.forEach(({name, data, isImprovement}) => {
        FilteredPerformanceData.forEach(entry => {
            const performanceMetrics = entry.performance[name];
            
            Object.entries(performanceMetrics).forEach(([exercise, value]) => {
                if (exercise in data && isImprovement(value, data[exercise])) {
                    ImprovedItems.push({
                        exercise,
                        
                        value: data[exercise],
                        category: name
                    });
                }
            });
        });
    });

    //console.log(ImprovedItems);
    setImprovementStats(ImprovedItems)
  }, [])

  
  return (
    variant === "dashboard" ? (
      <View>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',}}>
          <Text className='font-rubik-bold text-[17px] color-white'>Improvements</Text>
          <TouchableOpacity onPress={() => { router.push(`/profileTabs/Goals`); }}>
            <Text className="font-rubik-medium text-[14px]  color-[#FFD700]" style={{opacity:.7}}>See All</Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center'}}>
            {improvementStats.length > 0 ? 
                improvementStats.slice(0, 3).map((exercise, key) => (
                  <View key={key} style={{height:'80%', display:'flex', alignItems:'center',justifyContent:'center', marginTop:'5%',padding: 10, alignSelf: 'center', backgroundColor: '#333333', borderRadius: 10, width: '32%' }}>
                      {exercise.category != "achivement" ?
                      <Image source={icons.Dumbbells} style={{width:44, height:44, tintColor:'white',  alignSelf: 'center'}} />
                      :
                      <Image source={icons.Achievementicon} style={{width:44, height:34, tintColor:'white',  alignSelf: 'center'}} />
                      }
                      <Text style={{ fontFamily: 'Rubik-Regular', color: 'white', textAlign: 'center', width:'100%', fontSize:13}}>
                          {exercise.exercise}
                      </Text>
                      <View style={{flexDirection:'row', display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Text style={{ fontFamily: 'Rubik-Regular', color: '#FFD700', textAlign: 'center' }}>
                            {exercise.value}
                        </Text>
                        <Image source={icons.LongArrow} style={{ transform: [{ rotate: '-90deg' }], width:20, height:14, tintColor:'#FFD700',  }} />
                      </View>
                    </View>
                ))
                :
                <View className="flex items-center p-2">
                  <Text style={{ fontFamily: 'Rubik-SemiBold', color: '#FFD700', fontSize: 16 }}>
                    No Results
                  </Text>
                  <Text className="text-base text-black-100 mt-2">
                    No Recent Improvements
                  </Text>
                </View>
            }
          </View>
          </View>
      </View>
    ) : (
      <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        {improvementStats.length > 0 ? 
          improvementStats.slice(0, 3).map((exercise, key) => (
            <View key={key} style={{flexDirection:'row', display:'flex', alignItems:'center',justifyContent:'space-between', marginTop:'5%',padding: 15, alignSelf: 'center', backgroundColor: '#333333', borderRadius: 10, width: '70%' }}>
               
                <Text style={{ fontFamily: 'Rubik-SemiBold', color: 'white', textAlign: 'left', width:'100%', fontSize:13}}>
                    {exercise.exercise}
                </Text>
                <View style={{flexDirection:'row', display:'flex', alignItems:'center', justifyContent:'center'}}>
                  <Text style={{ fontFamily: 'Rubik-SemiBold', color: '#FFD700', textAlign: 'center' }}>
                      {exercise.value}
                  </Text>
                  <Image source={icons.LongArrow} style={{ transform: [{ rotate: '-90deg' }], width:20, height:14, tintColor:'#FFD700' }} />
                </View>
              </View>
          ))
          :
          <View className="flex items-center p-2"/>
        }
      </View>
    )
  )
}

export default Improvements