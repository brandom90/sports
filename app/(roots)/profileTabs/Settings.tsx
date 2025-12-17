import icons from '../../../constants/icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
interface SettingsProps {
  setOnProfile: (value: any) => void; // Replace 'any' with the appropriate type if known
}

const Settings: React.FC<SettingsProps> = ({ setOnProfile }) => {

  return (
    <View className='w-full' style={{backgroundColor:'black', flex:1,}}>
      <View style={{flexDirection:'row', alignItems:'center',padding:'2%', marginTop:'7%', justifyContent:'space-between', width:'97%', marginLeft:'auto',marginRight:'auto'}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.RightArrowIcon} style={{tintColor: '#FFD700',objectFit: 'contain',transform: [{ scaleX: -1 }], }}/>
          </TouchableOpacity>
          <Text style={{color:'white', fontFamily:'Rubik-Bold', fontSize:26}}>
            Settings
          </Text>
        </View>
        
      </View>  

       {/* First Divider */}
       <View style={{borderRadius: 5, height:5, width: '90%', marginLeft:'auto', marginRight:'auto', backgroundColor: '#3A3939', marginVertical:2}}/>


      <View  style={{width:'90%', marginLeft:'auto', marginRight:'auto'}}>
        <View style={{marginTop:'3%', padding:3,}}>
          <Text className=' text-[16px] font-rubik-bold' style={{color:'white'}}>Personal Info</Text>
          <View className='flex-row items-center p-2  ' style={{backgroundColor:'#333333', borderRadius:5, marginTop:'2%'}}>
            <Image source={icons.MailIcon}  className="mr-2 w-6 h-6 color-white" style={{ tintColor: 'black',resizeMode: 'contain' }} />
            <Text style={{ fontFamily: 'Rubik-Medium', fontSize:15,color:'white'}}>Change Email</Text>
          </View>
          <View className='flex-row items-center p-2' style={{backgroundColor:'#333333', borderRadius:5, marginTop:'3%' }}>
            <Image source={icons.LockedIcon}  className="mr-2 w-6 h-6 color-white" style={{ tintColor: 'black',resizeMode: 'contain' }} />
            <Text style={{ fontFamily: 'Rubik-Medium', fontSize:15,color:'white'}}>Change Password</Text>
          </View>
        </View>
        <View style={{marginTop:'3%', padding:3,}}>
          <Text className='text-[16px] font-rubik-bold' style={{color:'white'}}>Miscellaneous</Text>
          <View className='flex-row items-center p-2  ' style={{backgroundColor:'#333333', borderRadius:5, marginTop:'2%' }}>
            <Image source={icons.BellIcon}  className="mr-2 w-6 h-6 color-white" style={{ tintColor: 'black',resizeMode: 'contain' }} />
            <Text style={{ fontFamily: 'Rubik-Medium', fontSize:15,color:'white'}}>Notification Settings</Text>
          </View>
          <View className='flex-row items-center p-2  ' style={{backgroundColor:'#333333', borderRadius:5, marginTop:'3%' }}>
            <Image source={icons.DayNightIcon}  className="mr-2 w-6 h-6 color-white" style={{ tintColor: 'black',resizeMode: 'contain' }} />
            <Text style={{ fontFamily: 'Rubik-Medium', fontSize:15,color:'white'}}>Dark Mode</Text>
          </View>
        </View>
      
      </View>
    </View>
  )
}

export default Settings