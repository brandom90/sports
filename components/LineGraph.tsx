import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

interface GraphProps {
  graphStats: graphInterface;
  graphTitle: string
}

interface graphInterface {
  amounts: number[],
  timestamps: string[],
  measurement: string,
  img: string,
  form: string
  
}

const LineGraph: React.FC<GraphProps> = ({ graphStats, graphTitle }) => {
  const [convertedMonths, setConvertedMonths] = useState<string[]>([])

  useEffect(() => {
    const temp = graphStats.timestamps
    const convertedMonths = temp.map((date) => {
      const d = new Date(date);
      return d.toLocaleString('en-US', { month: 'short' });
    });
    setConvertedMonths(convertedMonths)
  }, [])
  
 
  //Data HAS to have a "value" and "label" var or else it wont rec it
  const data = graphStats.amounts.map((amount, index) => ({
    value: amount,
    label: convertedMonths[index] || ''
  }));

  const yAxisWording = graphStats.measurement
  return (
    <View style={{display:'flex', marginTop:5, padding:5, backgroundColor:'#333333', borderRadius:5,width:'93%', marginRight:'auto', marginLeft:'auto', }}>
      <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'left', color:'white',  fontFamily:'Rubik-Medium', marginLeft:10}}>{graphTitle}</Text>
      <View style={{ marginTop:15}}>
        <LineChart
            data={data}
            thickness={3}
            yAxisColor="#FFD700"
            rulesColor={"#786500"}
        
            xAxisColor="#FFD700"
            color="#FFD700"
          
            isAnimated
            xAxisLabelTextStyle={{
              color: '#8c8e91',
              fontSize: 12,
            }}
            yAxisTextStyle={{
              color: '#8c8e91',
              fontSize: 12,
            
            }}
            xAxisThickness={3}     
            yAxisThickness={3}   
            spacing={87}
           dataPointsColor={'#786500'}
             endSpacing={20} 
          />
      </View>
    </View>
  )
}

export default LineGraph



 