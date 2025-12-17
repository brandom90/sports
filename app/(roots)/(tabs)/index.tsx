import Events from '../../../components/Events';
import Improvements from '../../../components/Improvements';
import Leaderboard from '../../../components/Leaderboard';
import NoResults from "../../../components/NoResults";
import icons from '../../../constants/icons';
import { useGlobalContext } from "../../../lib/global-provider";
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";
// random nums (maybe not needed? could use workout temp ID for this??)
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { weeklyWorkouts } from '../../../dummyData';
import type { EventProps, AssignedProgram } from '../../../types/index'

import { BackHandler } from 'react-native';


export default function Index() {
  const placeholder = [""];
  const  { user,team,setWorkout,setAssignedProgram } = useGlobalContext();
  //const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const [todaysWorkoutName, setTodaysWorkoutName] = useState('')
  const [event, setEvent] = useState<EventProps[]>([])
  const handleEventPress = (id: string) => router.push(`./specEvent/${id}`);

  function getTodayDateFormatted(): string {
    const today = new Date();
    return today.toLocaleDateString('en-CA').slice(0, 10); // 'en-CA' uses YYYY-MM-DD format
  }

  // Workout Category puller
  const currentPlayerWorkoutSet = weeklyWorkouts.filter(item => item.athleteId == 'athlete1')
  // prevent user from backing into the login page again
  useEffect(() => {
    const onBackPress = () => {
      return true; // prevent default back behavior (no going to login)
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, []);


  useEffect(() => {
    const WorkoutExistCheck = currentPlayerWorkoutSet[0].workouts.filter(item => item.date.slice(0,10) == getTodayDateFormatted())
    if (WorkoutExistCheck.length > 0) {
      setTodaysWorkoutName(WorkoutExistCheck[0].category)
    } else {
      setTodaysWorkoutName('None')
    }
  }, [])
  
  //DB data puller
  useEffect(() => {
    const fetchEventInfo = async () => {
      const response = await fetch('http://192.168.86.27:4000/api/getevents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json()
      if (response.ok) {
        if (Array.isArray(json) && json.length > 0) {
          setEvent(json)  
        } else {
          setEvent([])  
        }
      }
    }
    fetchEventInfo()
 
    const fetchProgramInfo = async () => {
      const response = await fetch('http://192.168.86.27:4000/api/get_assigned_program', {
        method: 'POST',  body: JSON.stringify({ athleteId: user?._id, teamId: team?._id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json()
      if (response.ok && json.length > 0) {
        if (Array.isArray(json) && json.length > 0) {
          // below returns all valid programs (active), then pulls the first workout in the first valid program to display on the dashboard
          let active_programs: AssignedProgram[] = []
          for (const program of json) {
              if (program.status === 'active') {
                active_programs.push(program)
              }
          }
          console.log("ACtivbe progrtmas",active_programs)
          setAssignedProgram(active_programs)
          getFirstWorkout(active_programs)
        }
      } else {
        setTodaysWorkoutName('None')
      }
    }
    fetchProgramInfo()
  }, [])

  // programs = array of active programs (each has program_id + schedule + current_week)
  const getFirstWorkout = (
    programs: any[], 
  ) => {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    for (const program of programs) {
      const validWorkoutDays = program.program_id?.schedule.filter(
        (s: any) => s.week === program.current_week
      );
      if (validWorkoutDays.length > 0) {
        const todayWorkout = validWorkoutDays.find((w: any) => w.day === today);
        if (todayWorkout) {
          if (todayWorkout.workout.template_id) {
            setTodaysWorkoutName(`${todayWorkout.workout.template_id?.name?.slice(0, 20)}...`);
            console.log(todayWorkout.workout.template_id)
            setWorkout(todayWorkout.workout.template_id)
          } else if (todayWorkout.workout.custom_blocks) {
            setTodaysWorkoutName("Custom Workout");
            setWorkout(todayWorkout.workout.custom_blocks)
            
          }
          return;
        } 
      }
    }
    // No match found in any active program
    setTodaysWorkoutName("None");
  };


  // goes to todays workout (if it exist)
  const handleWorkoutPagePress = () => {
    const tempId = uuidv4();
    router.push({
      pathname: "../workoutsSpecific/[id]", // include the dynamic route
      params: {
        id: tempId, // this fills the [id] param
      },
    });
  };


  //All page to be accessed from other ways
  const handleEventsAllPagePress = () => {
    router.push(`/profileTabs/EventsAll`);
  };

  
// Change type to events later, rn i want to chekc all games
  const EventAvailable = event.filter(item => item.type == 'game')
  return (
      <SafeAreaView style={{ }} className="flex justify-center p-7 bg-black">
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <FlatList
          data={placeholder}
          renderItem={({ item }) => <Text>{item}</Text>}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 32 }}
          columnWrapperStyle={{ flexDirection: 'row', gap: 5, paddingHorizontal: 5 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NoResults />}
          ListHeaderComponent={
            <View className='bg-black mb-5 mt-4'>
              <View className='mr-auto '>
                <Text className='text-[13px] font-rubik-bold color-white' style={{opacity:.4}}>Welcome, {user?.name}</Text>
                <Text className='text-[25px] font-rubik-semibold color-white' style={{marginTop:-5}}>Dashboard</Text>
              </View>
              {/* First Divider */}
              <View style={{borderRadius: 5, height:5, width: '100%', backgroundColor: '#3A3939', marginVertical:2}}/>

              <View className=" rounded-xl w-full mt-[2%] mb-[2%]">
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',}}>
                  <Text className="font-rubik-medium text-[17px]  color-[white]">Upcoming Events</Text>
                  <TouchableOpacity onPress={() => { handleEventsAllPagePress(); }}>
                    <Text className="font-rubik-medium text-[14px]  color-[#FFD700]" style={{opacity:.7}}>See All</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex flex-col w-full ">
                  {EventAvailable.length > 0 ? (
                    <View style={{ flexDirection: "column", marginBottom:'2%' }}>
                      {event.slice(0, 3).map((item) => (
                
                        <Events
                          key={item._id} // Ensure a unique key
                          item={item}
                          onPress={() => handleEventPress(item._id?.toString() ?? '')}
                        />
                      ))}
                    </View>
                  ) : (
                    <View className="flex items-center p-2">
                      <Text style={{ fontFamily: 'Rubik-SemiBold', color: '#FFD700', fontSize: 16 }}>
                        No Results
                      </Text>
                      <Text className="text-base text-black-100 mt-2">
                        No events scheduled currently
                      </Text>
                    </View>
                  )}
                </View>
              </View>
               {/* Second Divider */}
              <View style={{borderRadius: 5, height:5, width: '100%', backgroundColor: '#3A3939'}}/>
                
              <View className=" rounded-xl h-auto"  style={{marginBottom:'5%', }}>
                <Text style={{  marginTop:'3%',marginBottom:'3%', fontFamily: 'Rubik-SemiBold', color: 'white', fontSize: 17 }}>
                  Recommended Workout
                </Text>
                
                <View style={{ padding:15,flex: 1, height: 'auto', backgroundColor: "#333333", justifyContent: 'center',  borderRadius: 5 }}>
                  {todaysWorkoutName !== 'None' ? 
                  <>
                  <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:'-2%'}}>
                    <Text style={{ fontFamily: 'Rubik-SemiBold', color: 'white', fontSize: 20,textAlign:'left' }}>
                      {todaysWorkoutName === 'None' ? '' : todaysWorkoutName}
                    </Text>
                    <Image source={icons.dumbell} style={{width:34, height:34, tintColor:'#FFD700' }} />
                  </View>
                  <TouchableOpacity onPress={() => handleWorkoutPagePress()} style={{width:'50%',backgroundColor:'#FFD700', padding:7, borderRadius:5, marginTop:'2%'}}>
                    <Text style={{ color: 'black', textAlign:'center' }} className='font-rubik-semibold text-[15px]'>Go to Workout</Text>
                  </TouchableOpacity>
                  </>
                  : (
                    <View>
                      <Text style={{ fontFamily: 'Rubik-SemiBold', color: 'white', fontSize: 15,textAlign:'left',opacity:.7 }}>
                        No Workouts Scheduled for today
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
               {/* 3rd Divider */}
              <View style={{borderRadius: 5, height:5, width: '100%', backgroundColor: '#3A3939'}}/>

              <View className=" rounded-xl w-full h-auto" style={{marginTop:'3%',}}>
                <Leaderboard />
              </View>

               {/* 4th Divider */}
              <View style={{borderRadius: 5, height:5, width: '100%', backgroundColor: '#3A3939'}}/>

              <View className="b w-full  h-auto mb-20" style={{marginTop:'3%',}}>
                <Improvements player={"athlete2"} variant={'dashboard'}/>
              </View>  
            </View>

          }
        />
       
      </SafeAreaView>
  );
}
