
// Update the path below to the correct relative path to your icons file
import icons from "../constants/icons";
import React, { useState } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { athletes } from '../dummyData';

const Leaderboard = () => {

  const { width } = Dimensions.get('window');

  const offsetX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }],
      zIndex: 2
    };
  });


  const [currentItem, setCurrentItem] = useState(0)
  const data = [
    { id: '1', label: 'Strength', rank: athletes[0].previousRanks.strength, icon: icons.strength },
    { id: '2', label: 'Power', rank: athletes[0].previousRanks.power, icon: icons.power },
    { id: '3', label: 'Explosiveness', rank: athletes[0].previousRanks.explosive, icon: icons.explosive },
    { id: '4', label: 'Speed', rank: athletes[0].previousRanks.speed, icon: icons.speed },
  ];

  const handleRankChange = (choice: string) => {
    offsetX.value = withTiming(-width, { duration: 250 }, () => {
      // Reset position and update item
      offsetX.value = width;
      offsetX.value = withTiming(0, { duration: 250 });
    });

    if (choice === 'inc') {
      if (currentItem !== 3) {
        setCurrentItem((prev) => prev + 1);
      } else {
        setCurrentItem(0);
      }
    } else if (choice === 'des') {
      if (currentItem !== 0) {
        setCurrentItem((prev) => prev - 1);
      } else {
        setCurrentItem(3);
      }
    }
  };
  
  
  return (
    <View style={{ zIndex: 2,}}>
      <Text className="font-rubik-bold text-[17px] color-white">Team Rankings</Text>
      <View className="w-full mt-2">
        <View className="flex flex-row items-center justify-center mb-[5%]">
          <TouchableOpacity onPress={() => { handleRankChange('des') }} className='mr-[10%]'  style={{ zIndex: 5 }}>
            <Image style={{ transform: [{ scaleX: -1 }], tintColor:'#FFD700' }} source={icons.RightArrowIcon} className="w-[30px] h-[35px]" resizeMode="contain" />
          </TouchableOpacity>
          <Animated.View style={[animatedStyle, { width: '40%', padding: 15,paddingTop:30, paddingBottom:15,height:'100%', backgroundColor:'#333333',borderRadius:5, display:'flex', alignItems:'center'}]}>
            <View style={{flexDirection:'row',  flex:1, alignItems:'center', justifyContent:'center'}} className="bg-[#333333]-500">
              <Text className="color-white text-center font-rubik-bold text-[50px]" style={{padding:0, margin:0, lineHeight: 50}}>{data[currentItem].rank}</Text>
              <Text style={{marginLeft:5, fontSize:22, color:'white', textAlign:'center'}}>th</Text>
            </View>
            <Text style={{ fontSize:13, color:'white', opacity:.5,width:'100%', textAlign:'center', marginTop:'4%'}}>{data[currentItem].label}</Text>
          </Animated.View>
          <TouchableOpacity onPress={() => { handleRankChange('inc') }} className='ml-[10%]'>
            <Image style={{tintColor:'#FFD700' }}  source={icons.RightArrowIcon} className="w-[30px] h-[35px]" resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Leaderboard