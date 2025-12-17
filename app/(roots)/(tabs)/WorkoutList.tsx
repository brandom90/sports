import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import ProgressBars from '../../../components/ProgressBars';
import icons from '../../../constants/icons';
import { router } from 'expo-router';
import { useGlobalContext,  } from "../../../lib/global-provider";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import type { WorkoutTemplate } from '../../../types/index'

const WorkoutList = () => {

  const  { team,user,setWorkout, assignedPrograms } = useGlobalContext();
  // Calcuates weeks left in season
  const seasonEndDate = team?.seasonEnd ? new Date(team.seasonEnd) : null;
  const now = new Date();
  const weeksLeft = seasonEndDate && !isNaN(seasonEndDate.getTime())
    ? Math.max(Math.ceil((seasonEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7)), 0)
    : 0;

  const [CompletedWCount, setCompletedCount] = useState<number>(0)
  const [weeklyCompletion, setWeeklyCompletion] = useState<number>(0);


  const handleDetailsPress =  async (templateId: string) => {
    const workoutTemplatesRes = await fetch('http://192.168.86.27:4000/api/get_all_workout_templates');
    const workoutTempData = await workoutTemplatesRes.json();
    
    
    // Find the full workout template from your data
    const fullWorkout = workoutTempData.templates.find(
      (template: WorkoutTemplate) => template._id === templateId
    );
    if (fullWorkout) {
      setWorkout(fullWorkout);
    }
    
    const tempId = uuidv4();
    router.push({
      pathname: "../workoutsSpecific/[id]",
      params: {
        id: tempId,
      },
    });
  };
  
  function getUSDateWithYear() {
    return new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  // Update this type definition near the top of your component
  type GroupedWorkout = { 
    programName: string; 
    workouts: { 
      day: string; 
      template_id: string;
      workoutName: string;  // Add this line
    }[] 
  };
  const [groupedWorkouts, setGroupedWorkouts] = useState<GroupedWorkout[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const programRes = await fetch('http://192.168.86.27:4000/api/get_assigned_program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ athleteId: user?._id, teamId: team?._id }),
      });

      const programJson = await programRes.json();
      if (!programRes.ok || !Array.isArray(programJson)) return;

      const activePrograms = programJson.filter(p => p.status === 'active');
      if (activePrograms.length === 0) return;

      const programIds = activePrograms.map(p => 
        typeof p.program_id === 'object' ? p.program_id._id : p.program_id
      );

      try {
        const grouped = activePrograms.map(program => {
          const assignedProgram = programJson.find(ap => {
            const programId = typeof ap.program_id === 'object' ? ap.program_id._id : ap.program_id;
            const currentProgramId = typeof program.program_id === 'object' ? program.program_id._id : program.program_id;
            return programId === currentProgramId;
          });

          const currentWeek = assignedProgram?.current_week ?? 1;

          return {
            programName: program.program_id.name,
            workouts: program.program_id.schedule
              .filter((item: { week: number; day: string; workout: { template_id: any } }) =>
                item.week === currentWeek
              )
              .map((item: { day: string; workout: { template_id: any } }) => {
                const workoutTemplate = item.workout.template_id;
                return {
                  day: item.day,
                  template_id: workoutTemplate?._id ?? 'unknown',
                  workoutName: workoutTemplate?.name ?? 'Custom Workout',
                };
              }),
          };
        });

        setGroupedWorkouts(grouped);
      } catch (error) {
        console.error("Error creating groupedWorkouts:", error);
      }

      const logRes = await fetch('http://192.168.86.27:4000/api/get_all_workout_logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team?._id,
          program_ids: programIds,
          userId: user?._id,
        }),
      });

      const logJson = await logRes.json();
      if (!logRes.ok || !Array.isArray(logJson)) return;

      // Count total completed workouts
      const completedLogs = logJson.filter(l => l?.athlete?.completed === true);
      setCompletedCount(completedLogs.length);

      // ---- Weekly completion % calculation ----
      // Flatten all workouts across programs for the current week
      const allWeeklyWorkouts = activePrograms.flatMap(p => {
        const assignedProgram = programJson.find(ap => {
          const programId = typeof ap.program_id === 'object' ? ap.program_id._id : ap.program_id;
          const currentProgramId = typeof p.program_id === 'object' ? p.program_id._id : p.program_id;
          return programId === currentProgramId;
        });
        const currentWeek = assignedProgram?.current_week ?? 1;
        return p.program_id.schedule
          .filter((s: { week: number }) => s.week === currentWeek)
          .map((s: { workout: { template_id: any } }) => s.workout.template_id?._id);
      });

      const completedWeekly = completedLogs.filter(log =>
        allWeeklyWorkouts.includes(log.workout_template_id)
      ).length;

      const percent = allWeeklyWorkouts.length > 0
        ? Math.round((completedWeekly / allWeeklyWorkouts.length) * 100)
        : 0;

      setWeeklyCompletion(percent);
      // -----------------------------------------
    };

    fetchData();
  }, [user?._id, team?._id]);



  return (
    <SafeAreaView style={{ flex: 1, }} className="bg-black">
      <StatusBar barStyle="light-content" />
      <View className='bg-black flex-1 ' style={{margin:20, marginTop:35 }}>
        <View className=" items-center flex-row justify-between">
          <Text className="text-center text-black font-rubik-bold text-[21px] color-white" style={{fontFamily: 'Rubik-Bold'}}>Your Workouts</Text>
          <Text style={{opacity:.5}} className="text-center text-black font-rubik-bold text-[13px] color-white">{getUSDateWithYear()}</Text>
        </View>
         {/* First Divider */}
        <View style={{borderRadius: 5, height:5, width: '100%', backgroundColor: '#3A3939', }}/>
      <ScrollView contentContainerStyle={{ paddingBottom: "20%"}} >
        <View style={{
          flexDirection:'row', 
          display:'flex', 
          alignItems:'stretch', 
          justifyContent:'space-between', 
          marginTop:'2%',
          marginBottom:'2%'
        }}>
          <View style={{
            display:'flex', 
            paddingVertical: 15,
            paddingHorizontal: 8,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#333333', 
            borderRadius:5, 
            width:'32%'
          }}>
            <Text style={{textAlign:'center', fontFamily: 'Rubik-SemiBold', color: 'white', fontSize: 16, marginBottom: 8 }}>
              Weekly Progress
            </Text>
            <ProgressBars amount={1} color={'#12922E'} size={90} percentage={weeklyCompletion}/>
          </View>
          
          <View style={{
            alignItems:'center',
            display:'flex', 
            justifyContent:'center',
            backgroundColor:'#333333', 
            borderRadius:5, 
            paddingVertical: 15,
            width:'32%'
            // Removed: height:'90%'
          }}>
            <Text style={{textAlign:'center', fontFamily: 'Rubik-SemiBold', color: 'white', fontSize: 16 }}>
              Season Weeks Left
            </Text>
            <Text style={{textAlign:'center',fontFamily: 'Rubik-SemiBold',fontSize:36, color:'#FFD700' }}>
              {weeksLeft}
            </Text>
            <Text style={{textAlign:'center',opacity:.6,fontFamily: 'Rubik-SemiBold',fontSize:12, color:'white' }}>
              weeks
            </Text>
          </View>
          
          <View style={{
            alignItems:'center',
            display:'flex', 
            justifyContent:'center',
            backgroundColor:'#333333', 
            borderRadius:5, 
            paddingVertical: 15,
            width:'32%'
          }}>
            <Text style={{textAlign:'center', fontFamily: 'Rubik-SemiBold', color: 'white', fontSize: 16 }}>
              Workouts
            </Text>
            <Text style={{textAlign:'center',fontFamily: 'Rubik-SemiBold',fontSize:36, color:'#FFD700', marginTop: 8 }}>
              {CompletedWCount}
            </Text>
            <Text style={{textAlign:'center',opacity:.6,fontFamily: 'Rubik-SemiBold',fontSize:12, color:'white' }}>
              completed
            </Text>
          </View>
        </View>
         {/* Second Divider */}
        <View style={{borderRadius: 5, height:5, width: '100%', backgroundColor: '#3A3939', }}/>


        <View className=' pt-2 '  style={{ paddingBottom: 20 }}>
          <Text style={{color:'white',fontFamily: 'Rubik-SemiBold', fontSize:20, marginBottom:'2%'}}>This week's workouts</Text>
            {groupedWorkouts.map((item, programIndex) => (
            <View key={programIndex}>
              <Text className="text-left text-white font-rubik-medium" style={{ fontSize: 17, opacity:.7, marginBottom: 10 }}>
                {item.programName}
              </Text>
              {item.workouts.map((workout, index) => (
                <View key={index}>
                  <TouchableOpacity 
                    style={{display:"flex", marginBottom:'3%'}} 
                    onPress={() => handleDetailsPress(item.workouts[index].template_id)}
                  >
                    <View className="bg-[#333333]" style={{paddingLeft:10, paddingRight:5,paddingTop:7,paddingBottom:7, borderTopLeftRadius:5,borderTopRightRadius:5,flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <View>
                        <Text className="text-left text-white font-rubik-bold" style={{ fontSize: 17, opacity:.7 }}>
                          {workout.day}
                        </Text>
                        <Text className="text-left text-[#FFD700] font-rubik-medium" style={{ fontSize: 18 }}>
                          {workout.workoutName.length > 25 
                            ? `${workout.workoutName.slice(0, 25)}...` 
                            : workout.workoutName
                          }
                        </Text>
                      </View>
                      <View>
                        <Image source={icons.RightArrowIcon} style={{width:34, height:34, tintColor:'#FFD700' }} />
                      </View>
                    </View>
                    <View style={{borderBottomLeftRadius: 5,borderBottomEndRadius:5, height:5, width: '100%', backgroundColor: '#FFD700', }}/>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
         
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default WorkoutList;