import { View, Text, TouchableOpacity,Image } from 'react-native'
import React, { useEffect } from 'react'
import { personalGoals } from '../dummyData'
import icons from '../constants/icons'


const GoalTabs = () => {
  const filteredPersonalGoals = personalGoals.filter(item => item.athleteId === 'athlete1')

  return (
    <View>
       <View className=' pt-2 flex-1'>
          <>
          {filteredPersonalGoals.map((item) => (
              <TouchableOpacity key={item.id} className='bg-[#C9A227] mb-4' style={{borderRadius: 5}}>
                <View className='bg-[#525252]'style={{borderRadius: 5}}>
                    <View className=' flex-row p-2 justify-between' style={{alignItems:'center', marginRight:5, marginLeft:5}} >
                        <Text style={{color:'white', fontFamily:'Rubik-Bold', fontSize:15}} className='color-white mr-2'>{item.title}</Text>
                        <Text style={{color:'black', fontFamily:'Rubik-Bold', fontSize:14, padding:5, borderRadius:10}} className='bg-[#FFD700] color-white p-1'>{item.category}</Text>
                    </View>
                    <View className='bg-[#333333] flex-row justify-center items-center p-2' style={{borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                        <Text className=' color-white rounded-xl p-3 mr-5' style={{ fontFamily:'Rubik-SemiBold', fontSize:14, opacity:.7}} >{item.currentValue} / {item.targetValue} {item.unit?.toUpperCase()}</Text> 
                    </View>
                </View>
              </TouchableOpacity>
          ))}
        </>
      </View>
    </View>
  )
}

export default GoalTabs