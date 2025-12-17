import { athletes } from '../dummyData'
import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import LineGraph from './LineGraph'



const SeasonalStats = () => {

  const currentPlayer = athletes.filter(item => item.id == 'athlete1')
  const boxStats = Object.entries(currentPlayer[0].stats).filter(([key, value]) => value.form === 'box')

  // Get only stats with form: 'graph'
  const graphStats = Object.entries(currentPlayer[0].stats).filter(([key, value]) => value.form === 'graph')
  console.log(graphStats[0])
  console.log(graphStats[0][1])
  const [statsList, setStatsList] = useState<any[]>([])

  useEffect(() => {
    setStatsList(Object.entries(currentPlayer[0].stats))
    console.log(Object.entries(currentPlayer[0].stats))
  }, [])

 
  
  return (
    <SafeAreaView style={{ flex: 1, marginRight:'auto', marginLeft:'auto' }} >
      <ScrollView  >
        <View style={{ }}>
          <LineGraph graphStats={graphStats[0][1]} graphTitle={graphStats[0][0]} />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap',justifyContent:'space-between',  width:'93%',marginRight:'auto', marginLeft:'auto'  }}>
          {boxStats.map((item, id) => {
            const [statName, statData] = item; // Destructure the key-value pair
            const totalAmount = statData.amounts.reduce((sum: number, amount: number) => sum + amount, 0);
            const imageID = statData.img
            const measurementUnit = statData.measurement
            return (
              <View key={id} style={{ width: '48.5%', aspectRatio: 1, backgroundColor:'#333333', borderRadius:5, padding:12, marginTop:10}}>
                <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'left', color:'white',  fontFamily:'Rubik-Medium', }}>
                  {statName.replace('_', ' ')}
                </Text>
                <Image 
                    source={imageID} 
                    className="w-[40px] h-[40px]"
                    style={{ resizeMode: 'contain', tintColor:'black', marginTop:5, marginBottom:5 }}
                />
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style={{fontSize: 17, textAlign: 'left', marginTop: 5, color:'white',  fontFamily:'Rubik-Medium', }}>
                    {totalAmount} 
                  </Text>
                  <Text style={{fontSize: 14, textAlign: 'left', marginLeft:6, opacity:.8, marginTop: 5, color:'white',  fontFamily:'Rubik-Medium', }}>
                    {measurementUnit} 
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SeasonalStats