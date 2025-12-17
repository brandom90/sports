import { View, Text, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, } from 'react-native';
import React, { useState, useEffect, useRef} from 'react';
import Svg, { Circle, Text as SvgText } from 'react-native-svg'; // Import necessary components
import { FontAwesome } from '@expo/vector-icons'; // Import an icon library

// Create an animated version of the Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressBarsProps {
  amount: number;
  color: string;
  size: number;
  percentage: number;
}

const ProgressBars: React.FC<ProgressBarsProps> = ({ amount, color,size,percentage }) => {
  console.log(percentage)
  const [athleticProgress, setAthleticProgress] = useState(0); // State to hold the progress percentage
  const [gameProgress, setGameProgress] = useState(0);
  const [practiceProgress, setPracticeProgress] = useState(0);

  const radius = 50;  // Radius of the circular progress bar
  const strokeWidth = 10;  // Stroke width of the circle
  const circumference = 2 * Math.PI * radius;  // Circumference of the circle

  const spinValue = useRef(new Animated.Value(0)).current;
  const [showThisWeek, setShowThisWeek] = useState(true);
  // Animated value for the strokeDashoffsetAthletics to handle the animation
  const strokeDashoffsetAthletics = useState(new Animated.Value(circumference))[0];
  const strokeDashoffsetGame = useState(new Animated.Value(circumference))[0];
  const strokeDashoffsetPractice = useState(new Animated.Value(circumference))[0];
  // dynamic stroke offset
  const strokeDashoffsetSingle = useRef(new Animated.Value(circumference)).current;
  // dynamic stoke offset calcuator
    useEffect(() => {
    const offset = circumference - (circumference * percentage) / 100;
    Animated.timing(strokeDashoffsetSingle, {
      toValue: offset,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

 
  // Calculate the strokeDashoffsetAthletics based on the progress
  useEffect(() => {

    const offset = circumference - (circumference * athleticProgress) / 100;
    Animated.timing(strokeDashoffsetAthletics, {
      toValue: offset,
      duration: 500,  // Transition duration
      useNativeDriver: false,  // We can't use native driver for strokeDashoffsetAthletics
    }).start();
    const offset2 = circumference - (circumference * gameProgress) / 100;
    Animated.timing(strokeDashoffsetGame, {
      toValue: offset2,
      duration: 500,
      useNativeDriver: false,  
    }).start();
    const offset3 = circumference - (circumference * practiceProgress) / 100;
    Animated.timing(strokeDashoffsetPractice, {
      toValue: offset3,
      duration: 500, 
      useNativeDriver: false,  
    }).start();
  }, [athleticProgress, gameProgress, practiceProgress]);

  useEffect(() => {
    setAthleticProgress(showThisWeek ? thisWeekData.playerImprovement : lastWeekData.playerImprovement);
    setGameProgress(showThisWeek ? thisWeekData.defensiveGoals : lastWeekData.defensiveGoals);
    setPracticeProgress(showThisWeek ? thisWeekData.offensiveGoals : lastWeekData.offensiveGoals);
 
  }, [showThisWeek]);

    // Dummy data for this week and last week
    const thisWeekData = {
      playerImprovement: 60,
      defensiveGoals: 100,
      offensiveGoals: 5,
    };
    const lastWeekData = {
      playerImprovement: 40,
      defensiveGoals: 55,
      offensiveGoals: 20,
    };
  const handleWidthChange = () => {
    setShowThisWeek(prev => !prev);
    //const newWidth = athleticProgress < 100 ? athleticProgress + 10 : 0; // Increment by 10 and reset if > 100
    setAthleticProgress(showThisWeek ? thisWeekData.playerImprovement : lastWeekData.playerImprovement);
    setGameProgress(showThisWeek ? thisWeekData.defensiveGoals : lastWeekData.defensiveGoals);
    setPracticeProgress(showThisWeek ? thisWeekData.offensiveGoals : lastWeekData.offensiveGoals);
      // Start the spin animation
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Reset the spin value after the animation completes
        spinValue.setValue(0);
      });
    };

   // Interpolate the spin value to create a rotation
   const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // This changes progress bar color based on the progress
  const getProgressColor = (progress: (number)) => {
  // Clamp progress between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  // Convert to hue: 0 = red (0°), 0.5 = orange/yellow (60°), 1 = green (120°)
  const hue = clampedProgress * 120;
  
  return `hsl(${hue}, 100%, 50%)`;
};
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // For iOS use 'padding', for Android use 'height'
    style={{ flex: 1 }}
  >
    <View>
      {amount === 3 ? (
        <>
          <View className="flex-row justify-between items-center px-3 ">
            <Text className="font-rubik-bold text-[22px]" style={{ color: color  }}>Progress</Text>
  
            <View className='flex flex-row items-center '>
              <Text className="font-rubik-bold text-[14px] mr-3" style={{ color: color  }}>{showThisWeek ? "This Week" : "Last Week"}</Text>
              <TouchableOpacity onPress={handleWidthChange}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <FontAwesome name="refresh" size={24} style={{ color: color}}/>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex flex-row items-center ml-auto mr-auto">
              <View className="flex flex-column items-center mr-2">
               
                <Svg width={size} height={size} viewBox="0 0 120 120">
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={  '#333333'}
                    strokeWidth={strokeWidth}
                    fill="none" />
                  <AnimatedCircle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={getProgressColor(athleticProgress / 100)}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffsetAthletics}
                    strokeLinecap="round" />
                  <SvgText
                    x="55"
                    y="65"
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="bold"
                    fill={ color  }
                  >
                    {athleticProgress}%
                  </SvgText>
                </Svg>
                <Text style={{ color: color,fontFamily:'Rubik-Bold',  }}>Athletics</Text>
              </View>
  
            <View className="flex flex-column items-center mr-2" >
             
              <Svg width={size} height={size} viewBox="0 0 120 120">
                <Circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={  '#333333'  }
                  strokeWidth={strokeWidth}
                  fill="none" />
                <AnimatedCircle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={getProgressColor(gameProgress / 100) }
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffsetGame}
                  strokeLinecap="round" />
                <SvgText
                  x="55"
                  y="65"
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill={ color  }
                >
                  {gameProgress}%
                </SvgText>
              </Svg>
              <Text style={{ color: color,fontFamily:'Rubik-Bold',  }}>Game</Text>
            </View>

          <View className=" justify-center items-center">
            <Svg width={size} height={size} viewBox="0 0 120 120">
              <Circle
                cx="60"
                cy="60"
                r={radius}
                stroke={ '#333333' }
                strokeWidth={strokeWidth}
                fill="none" />
              <AnimatedCircle
                cx="60"
                cy="60"
                r={radius}
                stroke={ getProgressColor(practiceProgress / 100) }
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffsetPractice}
                strokeLinecap="round" />
              <SvgText
                x="55"
                y="65"
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill={ color  }
              >
                {practiceProgress}%
              </SvgText>
            </Svg>
            <Text style={{ color:color,fontFamily:'Rubik-Bold',  }}>Practice</Text> 
          </View>
        </View>
  
        
        </>
      ) : (
          <Svg width={size} height={size} viewBox="0 0 120 120">
            <Circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#fff"
              strokeWidth={strokeWidth}
              fill="none" />
            <AnimatedCircle
              cx="60"
              cy="60"
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffsetSingle}
              strokeLinecap="round" />
            <SvgText
              x="55"
              y="65"
              textAnchor="middle"
              fontSize="20"
              fontWeight="bold"
              fill="white"
            >
              {percentage}%
            </SvgText>
          </Svg>
      )}
    </View>
  </KeyboardAvoidingView>
  );
};

export default ProgressBars;