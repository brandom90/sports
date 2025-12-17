import AchievementTabs from '../../../components/AchievementTabs';
import GoalTabs from '../../../components/GoalTabs';
import ProgressBars from '../../../components/ProgressBars';
import icons from '../../../constants/icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface GoalsProps {
  setOnProfile: (value: any) => void; 
}

const Goals: React.FC<GoalsProps> = ({setOnProfile}) => {
  const [isGrid, setIsGrid] = useState(true);
  //Selects if it shows or achievements
  const [CategorySelect, setCategorySelect] = useState('Goals')
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'black', padding:'6%',  }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop:'4%' }} >
      <View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.RightArrowIcon} style={{tintColor: '#FFD700',objectFit: 'contain',transform: [{ scaleX: -1 }], }}/>
          </TouchableOpacity>
          <Text style={{color:'white', fontFamily:'Rubik-Bold', fontSize:26}}>
            Accomplishments
          </Text>
        </View>  
        {/* First Divider */}
        <View style={{borderRadius: 5, height:5, width: '100%', backgroundColor: '#3A3939', marginVertical:5}}/>

        <View style={{marginTop:"1%"}}>
          <ProgressBars amount={3} color={'white'} size={100}/>
        </View>

        {/* First Divider */}
        <View style={{borderRadius: 5, height:5, width: '100%', backgroundColor: '#3A3939', marginVertical:5}}/>

        <View className='flex items-center ' style={{flexDirection:'row', justifyContent:'center', marginTop:5}}>
          <TouchableOpacity onPress={() => setCategorySelect('Goals')}>
            <Text style={{borderBottomColor:'#FFD700', borderBottomWidth: CategorySelect === 'Goals' ? 5 : 0 }} className='font-rubik-semibold text-[22px] color-white mr-10'>Goals</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategorySelect('Achievements')}>
            <Text style={{borderBottomColor:'#FFD700', borderBottomWidth: CategorySelect === 'Achievements' ? 5 : 0 }} className='font-rubik-semibold text-[22px] color-white'>Achievements</Text>
          </TouchableOpacity>
        </View>
        <View>
          { CategorySelect === 'Goals' ?  <GoalTabs /> : <AchievementTabs />}
        </View>
       
      </View>
      </ScrollView >
    </SafeAreaView>
  )
}

export default Goals