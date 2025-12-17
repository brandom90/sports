import SeasonalStats from '../../../components/SeasonalStats';
import icons from '../../../constants/icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Statistics = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [WIPModal, setWIPModal] = useState(false);

useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    
    if (WIPModal) {
      interval = setInterval(() => {
        setWIPModal(false);
      }, 2000);
    }

    // Cleanup function - runs when component unmounts or dependencies change
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [WIPModal]);
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTabClick = (name: string) => {
    setOnTab(name)
    setIsMenuOpen(false)
  }
  const [onTab, setOnTab] = useState('Season')

  const handleWIPModal = () => {
    setWIPModal(true)
  }

  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'black', }} >
      <ScrollView contentContainerStyle={{ overflow: 'visible',marginTop:20  }} >
        <View style={{marginTop:'3%', flex:1,flexDirection:'row', width:'93%', marginRight:'auto', marginLeft:'auto', justifyContent:'space-between', alignItems:'center'}}>
          <View style={{alignItems:'center', flexDirection:'row'}}>
            <TouchableOpacity  onPress={() => router.back()}>
              <Image source={icons.RightArrowIcon} className="size-9" style={{marginLeft:10, tintColor: '#FFD700',  transform: [{ scaleX: -1 }]  }}   />
            </TouchableOpacity>
            <Text style={{color:'white', fontFamily:'Rubik-Bold', fontSize:26, marginTop:'2%'}}>
              Statistics
            </Text>
          </View>
            <TouchableOpacity  onPress={() => toggleMenu()}>
              <Image source={icons.menu} className="size-7" style={{tintColor: 'white', marginRight:'5%'   }}   />
            </TouchableOpacity>
          </View>
        {isMenuOpen && (
            <View style={{ position: 'absolute',top: 70,right:15, height:'auto', backgroundColor: '#4E4E4E', minWidth:110, padding: 10,borderRadius: 5,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.3,shadowRadius: 3,elevation: 5,zIndex: 101,}}>
              <TouchableOpacity onPress={() => handleWIPModal()} style={{ width:'100%', height:'auto',padding:10, flexDirection:'row', alignItems:'center'}}>
                <Image source={icons.dumbell} className="size-7" style={{ tintColor: 'black', marginRight:6, transform: [{ scaleX: -1 }]  }}   />
                <Text style={{color:'white', }} className='font-rubik-medium'>Workouts</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleTabClick("Season")} style={{ width:'100%', height:'auto',padding:10, flexDirection:'row', alignItems:'center'}}>
                <Image source={icons.LineChartIcon} className="size-7" style={{ tintColor: 'black', marginRight:6, transform: [{ scaleX: -1 }]  }}   />
                <Text style={{color:'#FFD700', }} className='font-rubik-medium'>Season</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleWIPModal()} style={{ width:'100%', height:'auto',padding:10, flexDirection:'row', alignItems:'center'}}>
                <Image source={icons.BarChartIcon} className="size-7" style={{ tintColor: 'black', marginRight:6, transform: [{ scaleX: -1 }]  }}   />
                <Text style={{color:'white', }} className='font-rubik-medium'>Timeline</Text>
              </TouchableOpacity>
            </View>
          )}
        <View style={{marginTop:'1%'}}>
         <SeasonalStats/>
        </View>

        <Modal
          animationType="slide" transparent={true} visible={WIPModal} onRequestClose={() => setWIPModal(false)}
        >
            <View style={{ marginRight:'auto', marginLeft:'auto', marginTop:'5%', width: '90%', height: 50, backgroundColor: '#333333', borderRadius: 10, alignItems:'center', justifyContent:'center' }}>
              <Text className='font-rubik-bold text-[20px] color-[#FFD700]'>Coming Soon!</Text>
            </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Statistics