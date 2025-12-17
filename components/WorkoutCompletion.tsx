import { View, Text, SafeAreaView, StatusBar, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import icons from '../constants/icons'
import Improvements from './Improvements'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';

const WorkoutCompletion = () => {
   const router = useRouter();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} className="bg-black">
        <StatusBar barStyle="light-content" />
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 40
          }}
        >
          <View style={{
            width: '100%',
            alignItems: 'center',
            paddingBottom: 40
          }}>
            <Image 
              source={icons.Confetti}  
              style={{
                transform: [{ scaleX: -1 }],
                resizeMode: 'contain', 
                tintColor:'#FFD700',
                width: '60%', 
                height: 200, 
              }} 
            />
            <Text style={{color:'white', fontFamily: 'Rubik-Bold', fontSize:30, marginTop: 20}}>
              Workout Complete!
            </Text>
            <Text style={{color:'white', fontFamily: 'Rubik-Bold', fontSize:14, opacity:.5, marginBottom: 30}}>
              Keep up the good work
            </Text>
            {/*NOT INCLUDED IN MVP <Improvements player={'athlete1'} variant={'row'}/> */}
            <TouchableOpacity onPress={() => {router.navigate("/(roots)/(tabs)")}}
              style={{
                backgroundColor:'#FFD700', 
                borderRadius:10, 
                paddingVertical: 12,
                paddingHorizontal: 40,
                marginTop: 40,
                width: '80%',
                alignItems: 'center'
              }}
            >
              <Text style={{color:'black', fontFamily: 'Rubik-Bold', fontSize:24}}>
                Return
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default WorkoutCompletion