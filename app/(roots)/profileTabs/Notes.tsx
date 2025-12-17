import icons from '../../../constants/icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { athletes } from '../../../dummyData';



const Notes = () => {
  const [searchText, onChangeNumber] = React.useState('');
  const chosenAthlete = athletes.find(item => item.id === 'athlete1')
  const notesAll = chosenAthlete!.notes
  const [filteredNotes, setFilteredNotes] = useState(chosenAthlete!.notes)

  const handleSearchSubmit = (input: string) => {
    console.log('bink')
    const temp = notesAll.filter(item => item.title.includes(input))
    setFilteredNotes(temp)
  }

  const handleNotePagePress = (id: number) => {
    router.push({
      pathname: '/notesSpecific.tsx/[id]',
      params: { id: String(id) },
    });

  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'black'}}>
      {/* Wrap all content in a single parent View with flex:1 */}
      <View style={{ flex: 1, }}>

        <View style={{flexDirection:'row', alignItems:'center',padding:'2%', marginTop:'7%', justifyContent:'space-between', width:'97%'}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={icons.RightArrowIcon} style={{tintColor: '#FFD700',objectFit: 'contain',transform: [{ scaleX: -1 }], }}/>
            </TouchableOpacity>
            <Text style={{color:'white', fontFamily:'Rubik-Bold', fontSize:30}}>
              Notes
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.PlusIcon} style={{tintColor: '#FFD700',objectFit: 'contain', width:30, height:30 }}/>
          </TouchableOpacity>
        </View>  

       <TextInput
          style={{height:'6%',marginLeft:'4%',marginRight:'4%',color:'gray', borderWidth: 1,padding:10, backgroundColor:'#333333', borderRadius:5 }}
          onChangeText={onChangeNumber}
          value={searchText}
          placeholder="Search for your notes here"
          keyboardType='ascii-capable'
          submitBehavior='blurAndSubmit'
          onSubmitEditing={() => {
            // Handle search here
            handleSearchSubmit(searchText)
          }}
        />

        {/* Notes Area */}
        <View style={{ flex: 1, marginTop: '2%' }}>
          <ScrollView 
            contentContainerStyle={{ 
              flexGrow: 1,
              paddingBottom: 20  
            }}
            style={{ 
              flex: 1,  
              marginTop: '1%' 
            }}
            showsVerticalScrollIndicator={true}
          >
            {/* Top decorative lines */}
            <View style={{ height: 5, width: '85%', backgroundColor: '#FFFFFF', marginVertical: 8, opacity:.7 }} />
            <View style={{ height: 5, width: '65%', backgroundColor: '#FFFFFF', marginVertical: 8, opacity:.7 }} />
            <View style={{ height: 5, width: '45%', backgroundColor: '#FFFFFF', marginVertical: 8, opacity:.7 }} />

            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              justifyContent: 'space-between', 
              paddingHorizontal: 8, marginTop:'8%'
            }}>
              {filteredNotes.map((item, index) => (
                <TouchableOpacity onPress={()=> handleNotePagePress(item.id)} key={index} style={{ width: '32%',marginBottom:50, height:'20%'  }}>
                  <View style={{ 
                    backgroundColor: '#333333', 
                    borderRadius: 5, 
                  }}>
                    <Text style={{ color: 'white', padding: 8 }} numberOfLines={4}>
                      {item.content.substring(0, 50)}...
                    </Text>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 4 }}>
                    <Text style={{ color: '#FFD700', fontFamily: 'Rubik-Bold', textAlign: 'center' }}>
                      {item.title.substring(0, 30)}
                    </Text>
                    <Text style={{ color: 'white', fontSize: 12, opacity:.8 }}>
                      {item.timestamp.substring(0, 10)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bottom decorative lines */}
            <View style={{  alignItems: 'flex-end', marginTop:'5%'  }}>
              <View style={{ height: 5, width: '45%', backgroundColor: '#FFFFFF', opacity:.7, marginVertical: 8, marginLeft: 'auto' }} />
              <View style={{ height: 5, width: '65%', backgroundColor: '#FFFFFF', opacity:.7, marginVertical: 8, marginLeft: 'auto' }} />
              <View style={{ height: 5, width: '85%', backgroundColor: '#FFFFFF', opacity:.7, marginVertical: 8, marginLeft: 'auto' }} />
            </View>         
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Notes