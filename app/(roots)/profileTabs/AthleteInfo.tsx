import icons from '../../../constants/icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { athletes } from '../../../dummyData';

interface AthleteProps {
  setOnProfile: (value: any) => void; 
}

const AthleteInfo: React.FC<AthleteProps> = ({ setOnProfile }) => {
  const [ModalVis, setModalVis] = useState(false)
  const [ModalTempStorage, setModalTempStorage] = useState('')
  const [modalType, setmodalType] = useState('')
  const chosenAthlete = athletes.find(item => item.id == 'athlete1');
  
  const handleEditSubmit = () => {
    //wait for DB, then submit a post request here.
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'black',padding:'6%' }}> 
      <ScrollView contentContainerStyle={{ 
        alignItems: 'flex-start',width:'100%', marginRight:'auto', marginLeft:'auto'
      }}>
        <View style={{flexDirection:'row', marginTop:'3%'}}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.RightArrowIcon} style={{tintColor: '#FFD700',objectFit: 'contain',transform: [{ scaleX: -1 }], }}/>
          </TouchableOpacity>
          <Text style={{color:'white', fontFamily:'Rubik-Bold', fontSize:26}}>
            Profile
          </Text>
        </View>  
        <View style={{ marginRight:'auto', marginLeft:'auto', marginVertical:'8%', position: 'relative' }}>

          <Image source={icons.PersonBackgroundTemp} style={{objectFit: 'contain',width:150,height:150 }}/>
          <TouchableOpacity>
            <Image 
              source={icons.CircleEditIcon} 
              style={{objectFit: 'contain',width:40, height:40,position: 'absolute', bottom: 0,right: 5, }}/>
          </TouchableOpacity>
        </View>
        {/* Tabs with names*/}
        <View style={{width:'100%'}}>
          <Text style={{color:'white', fontFamily:'Rubik-Bold', fontSize:18, opacity:.9}}>Name</Text>
          <View style={{  flexDirection:'row', width:'100%',backgroundColor:'#333333', borderRadius:5, alignItems:'center', padding:10}}>
            <Image source={icons.ProfileIcon} style={{objectFit: 'contain',width:35,height:35, tintColor:'black' }}/>
            <Text style={{color:'white', fontFamily:'Rubik-SemiBold', fontSize:17, opacity:.9, marginLeft:'4%'}}>{chosenAthlete?.name}</Text>
          </View>
        </View>

         <View style={{width:'100%', marginTop:'2%'}}>
          <Text style={{color:'white', fontFamily:'Rubik-Bold', fontSize:18, opacity:.9}}>Username</Text>
          <View style={{  flexDirection:'row', width:'100%',backgroundColor:'#333333', borderRadius:5, alignItems:'center', padding:10}}>
            <Image source={icons.Id_Card} style={{objectFit: 'contain',width:35,height:35, tintColor:'black' }}/>
            <Text style={{color:'white', fontFamily:'Rubik-SemiBold', fontSize:17, opacity:.9, marginLeft:'4%'}}>{chosenAthlete?.username}</Text>
          </View>
        </View>

         <View style={{width:'100%', marginTop:'2%'}}>
          <Text style={{color:'white', fontFamily:'Rubik-Bold', fontSize:18, opacity:.9}}>Email</Text>
          <View style={{ justifyContent:'space-between', flexDirection:'row', width:'100%',backgroundColor:'#333333', borderRadius:5, alignItems:'center', padding:10}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Image source={icons.MailIcon} style={{objectFit: 'contain',width:35,height:35, tintColor:'black' }}/>
              <Text style={{color:'white', fontFamily:'Rubik-SemiBold', fontSize:17, opacity:.9, marginLeft:'4%'}}>{chosenAthlete?.email}</Text>
            </View>
            <TouchableOpacity onPress={() => (setmodalType('email'), setModalVis(true))}>
              <Image source={icons.BeveledEditIcon} style={{objectFit: 'contain',width:35,height:35,}}/>
            </TouchableOpacity>
          </View>
        </View>

         <View style={{width:'100%', marginTop:'2%'}}>
          <Text style={{color:'white', fontFamily:'Rubik-Bold', fontSize:18, opacity:.9}}>Phone Number</Text>
          <View style={{ justifyContent:'space-between', flexDirection:'row', width:'100%',backgroundColor:'#333333', borderRadius:5, alignItems:'center', padding:10}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Image source={icons.PhoneIcon} style={{objectFit: 'contain',width:35,height:35, tintColor:'black' }}/>
              <Text style={{color:'white', fontFamily:'Rubik-SemiBold', fontSize:17, opacity:.9, marginLeft:'4%'}}>{chosenAthlete?.phone_number}</Text>
            </View>
            <TouchableOpacity onPress={() => (setmodalType('phone'), setModalVis(true))}>
              <Image source={icons.BeveledEditIcon} style={{objectFit: 'contain',width:35,height:35,}}/>
            </TouchableOpacity>
          </View>
        </View>
        {/* Modal */}
       <Modal
        animationType='fade' 
        transparent={true} 
        visible={ModalVis} 
        onRequestClose={() => setModalVis(false)}
      >
        {/* Dark overlay background */}
        <TouchableOpacity 
          style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}
          activeOpacity={1}
          onPress={() => setModalVis(false)}
        >
          {/* Modal content - prevent close when touched */}
          <TouchableOpacity 
            activeOpacity={1}
           
            style={{ width: '80%' }}
          >
            <View style={{ 
              width: '100%', 
              height: 'auto', 
              backgroundColor: '#a8abb0', 
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10, // Android shadow
            }}>
              <View className='w-[100%] bg-[#FFD700]' style={{borderRadius: 5, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                <Text className='pt-5 text-[20px] font-rubik-bold color-black text-center mb-4 w-[80%] mr-auto ml-auto'>
                  {modalType === 'phone' ? 'Change Phone Number' : 'Change Email'}
                </Text>
              </View>
              <View className='w-[100%] pt-1.5' style={{backgroundColor:'#333333'}}> 
                <View style={{ marginTop:15, alignItems:'center', flexWrap: 'wrap', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto'}}>
                  <TextInput
                    className=" pt-[20px] pb-[20px] pl-[15px] pr-[30px] bg-white rounded-xl" style={{width:200}}
                    onChangeText={(text) => { setModalTempStorage(text)}}
                    placeholder="Type Here"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => handleEditSubmit()}
                  style={{backgroundColor: '#FFD700', width: '80%', padding:15, marginBottom:25, justifyContent: 'center',alignItems: 'center',alignSelf: 'center',borderRadius: 5,marginTop: 20,}}
                >
                  <Text style={{ color: 'black', fontSize: 16 }} className='font-rubik-bold'>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};


export default AthleteInfo;