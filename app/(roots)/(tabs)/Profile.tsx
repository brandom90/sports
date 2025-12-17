import icons from "../../../constants/icons"
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, ImageSourcePropType, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { athletes } from '../../../dummyData'
import type { Announcement } from '../../../types/index'
import { useGlobalContext } from "lib/global-provider"


interface SettingsItemProps {
  icon: ImageSourcePropType;
  title: string;
  // below means it returns nothing
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}
  
const Profile = () => {

  const [teamAnnouncement, setTeamAnnouncement] = useState<Announcement[]>([])
  const  { user, team } = useGlobalContext();
   useEffect(() => {
    const fetchTeamInfo = async () => {
      const response = await fetch('http://192.168.86.27:4000/api/getannouncements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId: team?._id })
      });
      const json = await response.json()
      if (response.ok) {
        if (Array.isArray(json) && json.length > 0) {
          setTeamAnnouncement(json);
        } else {
          setTeamAnnouncement([]);
        }
      }
    };
    fetchTeamInfo();
  }, [])
  
  const filteredAnnouncements = teamAnnouncement.filter(announcement => !announcement.readBy?.find(recipient => recipient.athleteId === user?._id));
  
  const SettingsItem = ({icon, title, textStyle, showArrow = true
    }: SettingsItemProps) => (
    <TouchableOpacity onPress={() => handleTabClick(title)} style={{backgroundColor:'#333333', borderRadius:5, marginBottom:5, marginTop:5, padding:'3%'}} className="flex flex-row items-center justify-between py-3">
      <View className='flex flex-row items-center gap-3'>
        <Image source={icon} className='size-6' style={{tintColor: 'white' }} />
        <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle} color-white`}>
          {title}
        </Text>
      </View>

      {showArrow && <Image source={icons.RightArrowIcon} className="size-7" style={{tintColor: '#FFD700' }}  />}
    </TouchableOpacity>
  )

  
  const filteredPlayerList = athletes.find(item =>  item.id === ("athlete1"))

  const handleTabClick = (name: string) => {
    if (name == "Events") {
      router.push(`/profileTabs/EventsAll`);
    } else if (name == "Athlete Info") {
      router.push(`/profileTabs/AthleteInfo`);
    } else if (name == "Achievements/Goals") {
      router.push(`/profileTabs/Goals`);
    } else if (name == "Notes") {
      router.push(`/profileTabs/Notes`);
    } else if (name == "Settings") {
      router.push(`/profileTabs/Settings`);
    } else if (name == "Statistics") {
      router.push(`/profileTabs/Statistics`);
    }


    else if (name == "Logout") {
       router.push('/sign-in');
    }
  }
  return (
    <SafeAreaView className='h-full bg-black'>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerClassName=' '
      >
        <View className='flex-row justify-center flex mt-7 ' >
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'86%'}} >
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Image source={icons.ProfileIcon} style={{tintColor: 'white',objectFit: 'contain' }} className='tintColor-black size-16 relative rounded-full'/>
              <View style={{marginLeft:'3%'}}>
                <Text style={{ fontFamily: 'Rubik-Bold', fontSize:18,color:'white'}}>
                  {filteredPlayerList?.name} 
                </Text>
                <Text style={{ fontFamily: 'Rubik-SemiBold', fontSize:14, opacity:.5,color:'white', marginTop:'-2%'}}>
                  Show Profile Info
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleTabClick("Athlete Info")}>
              <Image source={icons.NextArrowIcon} style={{objectFit: 'contain' }} className='tintColor-black size-10 relative rounded-full'/>
            </TouchableOpacity>
          </View>
        </View>
        {/* First Divider */}
        <View style={{marginVertical:'4%' ,borderRadius: 5, height:5, width: '90%', backgroundColor: '#3A3939', marginRight:'auto', marginLeft:'auto'}}/>
        {/* Recent Coach Annoucement*/}
        <View style={{flexDirection:'row', alignItems:'center', backgroundColor:'#333333', borderRadius:20, width:'90%', marginRight:'auto', marginLeft:'auto', justifyContent:'space-between'}}>
          <View style={{padding:'7%', marginRight:'3%'}}>
            <Text style={{color:'#FFD700', fontFamily:'Rubik-Bold', fontSize:16}}>
              {Array.isArray(filteredAnnouncements) && filteredAnnouncements.length > 0 ? filteredAnnouncements[0].title : 'No Annoucements'}
            </Text>
            <Text style={{color:'white', fontFamily:'Rubik-SemiBold', opacity:.5}}>
              {Array.isArray(filteredAnnouncements) && filteredAnnouncements.length > 0 ? filteredAnnouncements[0].createdBy : ''}
            </Text>
          </View>
          <View >
             <Image source={icons.UniversityTempIcon} style={{objectFit: 'contain', width:60,height:60, marginRight:'5%'}} />
          </View>
        </View>

       
        {/* List of Tabs for settings */}
        <View style={{width:'90%', marginRight:'auto', marginLeft:'auto', marginTop:'2%'}}>
          <Text style={{color:'white', fontFamily:'Rubik-Bold', fontSize:26, }}>Tabs</Text>
        </View>
        {/* Second Divider */}
        <View style={{borderRadius: 5, height:5, width: '90%', backgroundColor: '#3A3939', marginRight:'auto', marginLeft:'auto'}}/>
        <View style={{marginTop:'2%'}} className="flex flex-colpt-5  border-white bg-black px-7 ">
            <SettingsItem icon={icons.Achievementicon} title="Achievements/Goals"/>
            <SettingsItem icon={icons.StatsIcon} title="Statistics"/>
            <SettingsItem icon={icons.MegaphoneIcon} title="Events"/>
            <SettingsItem icon={icons.NotesIcon} title="Notes"/>
        </View>

      {/* List of Tabs for Account Settings */}
        <View style={{width:'90%', marginRight:'auto', marginLeft:'auto',marginTop:'2%'}}>
          <Text style={{color:'white', fontFamily:'Rubik-Bold', fontSize:26, }}>Account Settings</Text>
        </View>
        {/* Second Divider */}
        <View style={{borderRadius: 5, height:5, width: '90%', backgroundColor: '#3A3939', marginRight:'auto', marginLeft:'auto'}}/>
        <View style={{marginTop:'2%'}} className="flex flex-colpt-5  border-white bg-black px-7 ">
       
            <SettingsItem icon={icons.SettingIcon} title="Settings"/>
        </View>
        <View className="flex flex-col border-t  border-primary-200 px-7 pb-32">
          <SettingsItem
            icon={icons.LogoutIcon}
            title="Logout"
            textStyle="text-danger"
          />
        </View>
      
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile