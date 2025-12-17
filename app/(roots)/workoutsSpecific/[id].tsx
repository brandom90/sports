import WorkoutCompletion from "../../../components/WorkoutCompletion";
import icons from "../../../constants/icons";
import { useGlobalContext } from "../../../lib/global-provider";
import Tooltip from "../../../components/Tooltip"
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import { Image, Modal, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Svg, { Line } from 'react-native-svg';
import { WorkoutLog} from '../../../types/index'; 
// for app updating when app is backgrounded, etc
import { AppState, BackHandler } from 'react-native';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const WorkoutToday = () => {
  const  { user,team,workout } = useGlobalContext();

  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [WkCompleitionModalVisible, setWkCompleitionModalVisible] = useState(false);
  const [showWorkoutCompletion, setShowWorkoutCompletion] = useState(false); 
  const [newReps, setNewReps] = useState(0);

  const [logAlreadyMade, setLogAlreadyMade] = useState(false)

  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [newWeights, setNewWeights] = useState(0); // the new weight number the user will input
  const [currentExerciseId, setCurrentExerciseId] = useState<string>('');
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);

  const [workoutLog, setWorkoutLog] = useState<WorkoutLog | null>(null) // this will only exist if the user has worked on this workout before

  // time stuff
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1️⃣ AppState for background/close
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState !== 'active') {
        persistWorkoutLog(); // auto-save
      }
    });

    return () => {
      subscription.remove();
    };
  }, [workoutLog, seconds]);

  // 2️⃣ BackHandler for Android back button
  useEffect(() => {
    const onBackPress = () => {
      persistWorkoutLog(); // auto-save
      return false; // allow default back navigation
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, [workoutLog, seconds]);


  useEffect(() => {
    let isMounted = true;

    const initWorkout = async () => {
      if (!team?._id || !workout?._id || !user?._id) return;

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize to start of day

        // Fetch all logs for this user + template
        const response = await fetch('http://192.168.86.27:4000/api/get_workout_log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teamId: team._id,
            workout_template_id: workout._id,
            athleteId: user._id,
          }),
        });

        const allLogs: WorkoutLog[] = await response.json();

        if (!isMounted) return;

        // Find the log for today
        let todaysLog = allLogs.find(log => {
          if (!log.scheduledDate) return false;
          const logDate = new Date(log.scheduledDate);
          logDate.setHours(0, 0, 0, 0);
          return logDate.getTime() === today.getTime();
        });

        if (todaysLog) {
          console.log( "Resume existing log")
          // Resume existing log
          setWorkoutLog(todaysLog);
          setSeconds(todaysLog.athlete.duration ?? 0);
          setLogAlreadyMade(true);
        } else {
          // Create new log for today
          const newLog: WorkoutLog = {
            _id: workout._id,
            sessionId: uuidv4(),
            teamId: team._id,
            workout_template_id: workout._id,
            scheduledDate: today,
            athlete: {
              athlete_id: user._id,
              completed: false,
              duration: 0,
              exercises: workout.workoutEntries.map(entry => ({
                exercise_id: entry.exercise_id,
                exercise_name: entry.name,
                dropdown_vis: false,
                sets: entry.reps.map(set => ({
                  targetReps: set.targetReps,
                  actualReps: set.actualReps,
                  weight: set.weight ?? 0,
                  rpe: set.rpe ?? 0,
                  completed: typeof set.completed === 'object' ? set.completed.default : set.completed ?? false,
                })),
              })),
            },
          };

          setWorkoutLog(newLog);
          setSeconds(0);
          setLogAlreadyMade(false);
        }
      } catch (error) {
        console.error("Error initializing workout:", error);
      }
    };

    initWorkout();
    return () => { isMounted = false; };
  }, [team?._id, workout?._id, user?._id]);





  // checks and unchecks sets that has been completed
  const handleSetCompletionCheck = (exerciseId:String, index:Number) => {
    setWorkoutLog(prev => {
        if (!prev) return null;
        return {
          ...prev,
          athlete: {
            ...prev.athlete,
            exercises: prev.athlete.exercises.map(ex => 
              ex.exercise_id === exerciseId 
                ? {
                    ...ex,
                    sets: ex.sets.map((set, idx) => 
                      idx === index
                        ? { ...set, completed: !set.completed }
                        : set
                    )
                  }
                : ex
            )
          }
        };
      });
  }
  
  const persistWorkoutLog = async (completed = false) => {
    if (!workoutLog) return;

    const payload = {
      ...workoutLog,
      athlete: {
        ...workoutLog.athlete,
        duration: seconds,
        completed: completed ? true : workoutLog.athlete.completed,
      },
    };

    try {
      // ✅ Only update if logAlreadyMade AND a valid _id exist
      if (logAlreadyMade && workoutLog._id) {
        const response = await fetch(
          `http://192.168.86.27:4000/api/update_workout_log/${workoutLog._id}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) console.error("Failed to update workout log");

      } else {
        // ✅ Otherwise, create a new log
        const response = await fetch(
          'http://192.168.86.27:4000/api/create_workout_log',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          const createdLog = await response.json();
          setWorkoutLog(createdLog);
          setLogAlreadyMade(true);
        } else {
          console.error("Failed to create workout log");
        }
      }
    } catch (error) {
      console.error("Error persisting workout log:", error);
    }
  };





  const [completedModalText, setCompletedModalText] = useState("Confirm");


  const handleCompletionConfirmCheck = () => {
    let allSetsCompleted = true;
    
    if (workoutLog?.athlete?.exercises) {
      for (let i = 0; i < workoutLog.athlete.exercises.length; i++) {
        for (let j = 0; j < workoutLog.athlete.exercises[i].sets.length; j++) {
          if (workoutLog.athlete.exercises[i].sets[j].completed === false) {
            allSetsCompleted = false;
            break; // Exit early once we find an incomplete set
          }
        }
        if (!allSetsCompleted) break; // Exit outer loop too
      }
    }
    
    setCompletedModalText(allSetsCompleted ? "Confirm" : "Not all sets are completed");
    setWkCompleitionModalVisible(true);
  }
 
  //Workout Timer
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

   useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(prev => !prev);
  };

  useEffect(() => {
    if (showWorkoutCompletion) {
      persistWorkoutLog(true).finally(() => setShowWorkoutCompletion(false));
    }
  }, [showWorkoutCompletion]);


  return (
     <>
   {showWorkoutCompletion || workoutLog?.athlete?.completed === true ? (
      <WorkoutCompletion />
    ) : (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <StatusBar barStyle="light-content" />
         <View className='bg-black' >
          <View className='border-b-2 border-black' style={{alignItems:'center',marginTop:'8%'}}>
            <View className=" items-center bg-black p-2 flex-row justify-between w-[90%]">
              <TouchableOpacity onPress={async () => {
                handleStartPause();
                if (workoutLog?._id) await persistWorkoutLog();
                router.back();
              }}>
                <Image source={icons.RightArrowIcon} className="w-10 h-10" style={{transform: [{ scaleX: -1 }],resizeMode: 'contain', tintColor:'#FFD700' }} />
              </TouchableOpacity>
              <Text className="text-center text-white font-rubik-bold text-[28px]">{formatTime(seconds)}</Text>
              <TouchableOpacity onPress={() => { handleCompletionConfirmCheck() }}>
                <Image source={icons.NextArrowIcon} className="w-10 h-10" style={{resizeMode: 'contain',}} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems:'center'}} className='bg-[black]'>
        {/* First Divider */}
        <View style={{borderRadius: 5, height:5, width: '90%', backgroundColor: '#3A3939', marginBottom:'4%'}}/>
        <View style={{width:'90%',marginBottom:'10%'}}>
          {workoutLog?.athlete?.exercises?.map((exercise, index) => (
              <View  key={exercise.exercise_id} >
                <View style={{flexDirection:'row', width:'100%', marginBottom:'5%' }}>
                  <TouchableOpacity onPress={() => {
                    setWorkoutLog(prev => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        athlete: {
                          ...prev.athlete,
                          exercises: prev.athlete.exercises.map(ex => 
                            ex.exercise_id === exercise.exercise_id 
                              ? { ...ex, dropdown_vis: !ex.dropdown_vis }
                              : ex
                          )
                        }
                      };
                    });
                  }}style={{padding:'4%',alignItems:'center',justifyContent:'space-between', flexDirection:'row',backgroundColor:'#333333',width:'100%', borderRadius:5}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                      <Text className=" font-rubik-bold text-[20px] color-white mr-2 mb-1">{exercise.exercise_name}</Text>
                      <Tooltip text={workout?.workoutEntries[index]?.notes}>
                         <Image
                            style={{resizeMode: 'contain', tintColor: '#FFD700' }}
                            source={icons.ToolTipIcon}
                            className=" w-5 h-5 "
                          />
                      </Tooltip>
                    </View>
                    <Image source={icons.RightArrowIcon} className="w-10 h-10" style={{resizeMode: 'contain', tintColor:'#FFD700',transform: [{ rotate: exercise.dropdown_vis  ? '-90deg' : '90deg' }],}} />
                  </TouchableOpacity>
                </View>
              { exercise.dropdown_vis  &&
              <View className="p-3.5 flex-row items-center justify-between">
                <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ marginRight: '6%', width: '15%' }}>
                    <Text style={{ borderBottomWidth: 4, borderColor: '#FFD700', fontFamily: 'Rubik-SemiBold', opacity: 0.7, color: '#FFFFFF', textAlign: 'center' }}>
                      SET
                    </Text>
                  </View>
                  <View style={{ marginRight: '15%', width: '15%' }}>
                    <Text style={{ borderBottomWidth: 4, borderColor: '#FFD700', fontFamily: 'Rubik-SemiBold', opacity: 0.7, color: '#FFFFFF', textAlign: 'center' }}>
                      LBS
                    </Text>
                  </View>
                  <View style={{ width: '18%' }}>
                    <Text style={{ borderBottomWidth: 4, borderColor: '#FFD700', fontFamily: 'Rubik-SemiBold', opacity: 0.7, color: '#FFFFFF', textAlign: 'center' }}>
                      REPS
                    </Text>
                  </View>
                </View>
              </View>
              }
              {Array.from({ length: exercise?.sets?.length || 0 }, (_, i) => {
                  return (
                    exercise.dropdown_vis   &&
                      <View key={uuidv4()} style={{paddingLeft:20, paddingRight:20, paddingTop:0, paddingBottom:10}}className=" flex-row  items-center justify-between">
                        <View style={{ width:'90%', flexDirection:'row', alignItems:'center'}}>
                          <View style={{ marginRight:'7%' ,backgroundColor:'#333333',paddingTop:7,paddingBottom:7, borderRadius:5, width:'11%'}}>
                            <Text className="font-rubik-bold color-white" style={{textAlign:'center', }}>{i+1}</Text>
                          </View>
                          <TouchableOpacity onPress={() => { 
                            setWeightModalVisible(true); 
                            setCurrentExerciseId(exercise.exercise_id);
                            setCurrentSetIndex(i);
                          }} style={{marginRight:'4%' ,backgroundColor:'#333333',paddingTop:7,paddingBottom:7, borderRadius:5, width:'18%', padding:5}} className="flex-column items-center">
                            <Text className="color-white font-rubik-bold text-[15px]">
                               {exercise.sets[i]?.weight ?? 0}
                            </Text>
                          </TouchableOpacity>
                          <Svg height="15" width="15" style={{marginRight:'4%' ,}}>
                            <Line x1="0" y1="0" x2="15" y2="15" stroke="#FDFDFD" strokeWidth="3.5" />
                            <Line x1="0" y1="15" x2="15" y2="0" stroke="#FDFDFD" strokeWidth="3.5" />
                          </Svg>
                          <TouchableOpacity onPress={() => { 
                            setDayModalVisible(true); 
                            setCurrentExerciseId(exercise.exercise_id);
                            setCurrentSetIndex(i);
                          }} style={{backgroundColor:'#333333',paddingTop:7,paddingBottom:7, borderRadius:5, width:'18%', padding:5}}  className="flex-column items-center">
                            <Text className="color-white font-rubik-bold text-[15px]">
                              {exercise.sets[i]?.actualReps ?? exercise.sets[i]?.targetReps}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{width:'16%'}}>
                          <TouchableOpacity className="" onPress={() => {handleSetCompletionCheck(exercise.exercise_id, i) }}>
                            <Image
                              style={{resizeMode: 'contain' }}
                              source={exercise.sets[i].completed ? icons.NewCheckedMark : icons.NewUnCheckedMark}
                              className=" w-10 h-10 "
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    
                  ); 
              })}
              </View>
          ))}
        </View>
           {/* Modal stuff*/}
                <Modal
                  animationType="fade" transparent={true} visible={dayModalVisible} onRequestClose={() => setDayModalVisible(false)}
                >
                   <TouchableOpacity 
                    style={{ 
                      flex: 1, 
                      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                      justifyContent: 'center', 
                      alignItems: 'center' 
                    }}
                    activeOpacity={1}
                    onPress={() => setDayModalVisible(false)}
                  >
                  
                    <View style={{ width: '80%', height: 'auto', backgroundColor: 'black', borderRadius: 10,}}>
                      <View className='w-[100%] bg-[#333333]' style={{borderRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                        <Text className='pt-5  text-[20px] font-rubik-bold color-white text-center mb-4  w-[80%] mr-auto ml-auto'>Change Reps</Text>
                      </View>
                      <View className='w-[100%]  mt-2 '> 
                       
                        <View style={{ marginTop:15, alignItems:'center', flexWrap: 'wrap', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto'}}>
                          <TextInput
                              keyboardType="numeric"
                              className="w-[200px] pt-[20px] pb-[20px] pl-[30px] pr-[30px] bg-white rounded-xl"
                              onChangeText={(text) => {
                                // Filter out non-numeric characters
                                const numericText = text.replace(/[^0-9]/g, '');
                                const numericValue = numericText === '' ? 0 : Number(numericText);
                                setNewReps(numericValue);
                              }}
                              placeholder="Input Desired Reps"
                              
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => { 
                              if (newReps > 0) {
                                setWorkoutLog(prev => {
                                if (!prev) return null;
                                return {
                                  ...prev,
                                  athlete: {
                                    ...prev.athlete,
                                    exercises: prev.athlete.exercises.map(ex => 
                                      ex.exercise_id === currentExerciseId 
                                        ? {
                                            ...ex,
                                            sets: ex.sets.map((set, idx) => 
                                              idx === currentSetIndex
                                                ? { ...set, actualReps: newReps }
                                                : set
                                            )
                                          }
                                        : ex
                                    )
                                  }
                                };
                              });
                                setDayModalVisible(false); 
                                setNewReps(0)
                              }
                          }}
                          style={{backgroundColor: '#FFD700', width: '80%', padding:15, marginBottom:25, justifyContent: 'center',alignItems: 'center',alignSelf: 'center',borderRadius: 10,marginTop: 20,}}
                        >
                          <Text style={{ color: 'black', fontSize: 16, fontFamily:'Rubik-Bold' }}>Confirm</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>

                <Modal
                  animationType="fade" transparent={true} visible={weightModalVisible} onRequestClose={() => setWeightModalVisible(false)}
                >
                  {/* This TouchableOpacity causes modal to close when user clicked out of the box*/}
                  <TouchableOpacity 
                    style={{ 
                      flex: 1, 
                      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                      justifyContent: 'center', 
                      alignItems: 'center' 
                    }}
                    activeOpacity={1}
                    onPress={() => setWeightModalVisible(false)}
                  >
                    <View style={{ width: '80%', height: 'auto', backgroundColor: '#0D0D0D', borderRadius: 10, borderColor:"#FFD700"}}>
                      <View className='w-[100%] bg-[#333333]' style={{borderRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                        <Text className='pt-5  text-[20px] font-rubik-bold color-white text-center mb-4  w-[80%] mr-auto ml-auto'>Change Weights</Text>
                      </View>
                      <View className='w-[100%]  mt-2 '> 
                       
                        <View style={{ marginTop:15, alignItems:'center', flexWrap: 'wrap', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto'}}>
                          <TextInput
                              keyboardType="numeric"
                              className="w-[200px] pt-[20px] pb-[20px] pl-[30px] pr-[30px] bg-white rounded-xl"
                              onChangeText={(text) => {
                                  // Filter out non-numeric characters
                                  const numericText = text.replace(/[^0-9]/g, '');
                                  const numericValue = Number(numericText);
                                  if (numericValue !== newWeights) {
                                      setNewWeights(numericValue);
                                  }
                              }}
                              
                              placeholder="Input Desired Weight"
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => { 
                            if (newWeights > 0) {
                              setWorkoutLog(prev => {
                                if (!prev) return null;
                                return {
                                  ...prev,
                                  athlete: {
                                    ...prev.athlete,
                                    exercises: prev.athlete.exercises.map(ex => 
                                      ex.exercise_id === currentExerciseId 
                                        ? {
                                            ...ex,
                                            sets: ex.sets.map((set, idx) => 
                                              idx === currentSetIndex
                                                ? { ...set, weight: newWeights }
                                                : set
                                            )
                                          }
                                        : ex
                                    )
                                  }
                                };
                              });
                              setWeightModalVisible(false); 
                              setNewWeights(0);
                            }
                          }}
                          style={{backgroundColor: '#FFD700', width: '80%', padding:10, marginBottom:25, justifyContent: 'center',alignItems: 'center',alignSelf: 'center',borderRadius: 10,marginTop: 20,}}
                        >
                          <Text style={{ color: 'black', fontSize: 16, fontFamily:'Rubik-SemiBold' }}>Confirm</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity >
                </Modal>
                {/* Workout Completion Modal*/}
                <Modal
                  animationType='fade' transparent={true} visible={WkCompleitionModalVisible} onRequestClose={() => setWkCompleitionModalVisible(false)}
                >
                  <View style={{ 
                    flex: 1, 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                  
                  }}>
                  <TouchableWithoutFeedback onPress={() => setWkCompleitionModalVisible(false)} style={{  backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '80%', height: 'auto', backgroundColor: '#0D0D0D', borderRadius: 5,}}>
                      <View className='w-[100%] bg-[#333333]' style={{borderRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                        <Text className='pt-5  text-[20px] font-rubik-bold color-white text-center mb-4  w-[80%] mr-auto ml-auto'>Finish Workout?</Text>
                      </View>
                      <View className='w-[100%]  mt-2 '> 
                       <TouchableOpacity
                        onPress={async () => { 
                          if (completedModalText === "Confirm") {
                            // Mark workout complete and persist
                            setWorkoutLog(prev => {
                              if (!prev) return null;
                              return {
                                ...prev,
                                athlete: { ...prev.athlete, completed: true },
                              };
                            });

                            // Save to backend as completed
                            await persistWorkoutLog(true);

                            // Show completion animation/screen
                            setShowWorkoutCompletion(true);
                          } else {
                            setWkCompleitionModalVisible(false);
                          }
                        }}
                        style={{
                          backgroundColor: '#FFD700',
                          width: '80%',
                          padding: 15,
                          marginBottom: 25,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          borderRadius: 10,
                          marginTop: 20,
                        }}
                      >
                        <Text style={{ color: 'black', fontSize: 16 }} className='font-rubik-bold'>
                          {completedModalText}
                        </Text>
                      </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  </TouchableWithoutFeedback>
                  </View>
                </Modal>
        </ScrollView>
    </SafeAreaView>
    )}
    </>
  )
}

export default WorkoutToday