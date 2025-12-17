import icons from '../../../constants/icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { athletes } from '../../../dummyData';



const selectedNote = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [fullTitleVis, setFullTitleVis] = useState(true)
  const rotateAnim = useRef(new Animated.Value(0)).current;
 
  const chosenAthlete = athletes.find(item => item.id === 'athlete1')
  const filteredNote = chosenAthlete?.notes.filter(item => item.id == Number(id))
  console.log(filteredNote)
  const [tempTitleStorage, setTempTitleStorage] = useState(filteredNote && filteredNote[0].title)
  const [tempContentStorage, setTempContentStorage] = useState(filteredNote && filteredNote[0].content)
  //This is to focus on content text input when its parent container gets clicked
  const textInputRef = useRef<TextInput>(null);
  //this useEffect to handle the rotation animation
   useEffect(() => {
   Animated.timing(rotateAnim, {
       toValue: fullTitleVis ? 1 : 0,
       duration: 300,
       useNativeDriver: true,
   }).start();
   }, [fullTitleVis, rotateAnim]);

// Create the rotation interpolation
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '-180deg'], // This smoothly goes from -180 to -90
});
        
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'black'}}>
        <ScrollView contentContainerStyle={{ flexGrow: 1,}}>
            <View style={{flexDirection:'row', alignItems:'center',  justifyContent:'space-between', padding:'2%', marginTop:'8%',  width:'97%'}}>
                { fullTitleVis ?
                < >
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                      <TouchableOpacity onPress={() => router.back()}>
                         <Animated.Image 
                            source={icons.RightArrowIcon} 
                            style={{
                                tintColor: '#FFD700', marginRight:'2%',
                                objectFit: 'contain',
                                transform: [{ rotate: rotateInterpolate }],
                            }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setFullTitleVis((prev) => !prev)}>
                         <Text style={{color:'white', fontFamily:'Rubik-Medium', fontSize:20}}>
                         {filteredNote && filteredNote.length > 0 && (
                             filteredNote[0].title.length < 17
                             ? filteredNote[0].title
                             : filteredNote[0].title.substring(0, 17) + '...'
                         )}
                         </Text>
                      </TouchableOpacity>
                  </View>
                  <View>
                      {/* Need to make it delete it from mongo*/}
                      <TouchableOpacity>
                         <Image source={icons.TrashcanIcon} style={{tintColor: '#FFFFFF', opacity:.5,objectFit: 'contain', width:23, height:23 }}/>
                      </TouchableOpacity>
                  </View>
                </>
                :
                  <View style={{marginLeft:'2%', width:'100%'}} >
                      <TouchableOpacity onPress={() => setFullTitleVis((prev) => !prev)} style={{alignItems:'flex-start',  justifyContent:'space-between'}}>
                          <Animated.Image 
                              source={icons.RightArrowIcon} 
                              style={{
                                  tintColor: '#FFD700',
                                  objectFit: 'contain',
                                  transform: [{ rotate: rotateInterpolate }],
                              }}
                          />
                      </TouchableOpacity>
                      <View style={{marginLeft:'4%',width:"100%" }}>   
                        <TextInput
                            style={{
                                color:'white',
                                fontFamily:'Rubik-Medium', 
                                fontSize:20,
                                width:'80%',
                                padding: 0,           // Removes all internal padding
                                paddingHorizontal: 0, // Specifically removes left/right padding
                                paddingVertical: 0,   // Specifically removes top/bottom padding
                                margin: 0,            // Removes external margin
                                textAlignVertical: 'top', // Aligns text to top (Android)
                            }}
                            onChangeText={setTempTitleStorage}
                            value={tempTitleStorage}
                            multiline
                            numberOfLines={5}
                            maxLength={40}
                        />
                        <Text style={{color:'white', fontFamily:'Rubik-Medium', fontSize:12, opacity:.7}}>
                              {filteredNote && filteredNote[0].timestamp.substring(0,10)}
                        </Text>
                      </View>
                  </View>        
                }
            </View> 

             {/* First Divider */}
            <View style={{ height:1, width: '100%', backgroundColor: '#3A3939', marginVertical:2}}/>

            <TouchableOpacity activeOpacity={1} onPress={() => textInputRef.current?.focus()}  style={{padding:15,flex:1}}>
                
                <TextInput
                    ref={textInputRef}
                    style={{
                        color:'white',
                        fontFamily:'Rubik-Regular', 
                        fontSize:15,
                        width:'80%', opacity:.8,
                        padding: 0,           // Removes all internal padding
                        paddingHorizontal: 0, // Specifically removes left/right padding
                        paddingVertical: 0,   // Specifically removes top/bottom padding
                        margin: 0,            // Removes external margin
                        textAlignVertical: 'top', // Aligns text to top (Android)
                    }}
                    onChangeText={setTempContentStorage}
                    value={tempContentStorage}
                    multiline

                />
            </TouchableOpacity> 
        </ScrollView>
    </SafeAreaView>
  )
}

export default selectedNote