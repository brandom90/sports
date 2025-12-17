import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { achivements } from '../dummyData'
import icons from '../constants/icons'

const AchievementTabs = () => {
  const filteredAchivements = achivements.filter(item => item.athleteId === 'athlete1')
  const [SortedAchivements, setSortedAchivements] = useState<{ [key: string]: { count: number, latestTimestamp: string } }>({})

  useEffect(() => {
    const achievementCounts: { [key: string]: { count: number, latestTimestamp: string } } = {}
    
    for (let i = 0; i < filteredAchivements.length; i++) {
      const achievementName = filteredAchivements[i].name
      const timestamp = filteredAchivements[i].timestamp
      
      if (!(achievementName in achievementCounts)) {
        // First time seeing this achievement
        achievementCounts[achievementName] = {
          count: 1,
          latestTimestamp: timestamp
        }
      } else {
        // Already exists, increment count and update timestamp if newer
        achievementCounts[achievementName].count += 1
        if (new Date(timestamp) > new Date(achievementCounts[achievementName].latestTimestamp)) {
          achievementCounts[achievementName].latestTimestamp = timestamp
        }
      }
    }
    
    setSortedAchivements(achievementCounts)
  }, [])
  
  return (
    <View>
      {Object.entries(SortedAchivements).map(([name, data], index) => (
        <View 
          key={name} 
          className='flex-row items-center p-4 bg-[#333333] rounded mt-5'
        >
          <View className='mr-3'>
            <Image 
              source={icons.ThropyIcon} 
              className="w-10 h-10"
              style={{ resizeMode: 'contain', tintColor:'black' }}
            />
          </View>
          <View className='flex-1'>
            <Text style={{color:'white'}} className='font-rubik-bold text-[20px]'>
              {name}
            </Text>
            <Text style={{color:'white'}}>
              Latest: {data.latestTimestamp.slice(0,10)}
            </Text>
          </View>
          {data.count > 1 &&
          <View style={{backgroundColor:'black', padding:10,paddingRight:15, paddingLeft:15, borderRadius:15}}>
            <Text style={{color:'#FFD700', fontFamily:'Rubik-Bold', fontSize:20}}>
              {data.count > 1 ? `×${data.count}` : ''}
            </Text>
          </View>
          }
        </View>
      ))}
    </View>
  )
}

export default AchievementTabs