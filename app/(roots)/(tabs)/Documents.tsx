import icons from '../../../constants/icons';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { DocumentData } from '../../../dummyData';

export type DocumentProps = {
  id: string,
  title: string
  description: string
  type: 'Video' | 'Document'
  athleteId: string
  coverImageURL?: string
};



const Documents = () => {

  const [searchText, setSearchText] = useState('');
  const [typeCategory, setTypeCategory] = useState('Document')

  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // I would make the hardcoded 'athlete1' into a more dynamic thing once I integrate MongoDb
  const filteredDocs = DocumentData.filter(item => item.athleteId === 'athlete1')
  const [documentList, setdocumentList] = useState<DocumentProps[]>(filteredDocs.filter(item => item.type === typeCategory))


  useEffect(() => {
    const typeFilteredDocs = filteredDocs.filter(item => item.type === typeCategory)
    setdocumentList(typeFilteredDocs)
  }, [typeCategory])
  
  return (
     <TouchableWithoutFeedback onPress={() => setIsMenuOpen(false)}>
      {/* TouchableWithoutFeedback is just TouchableOpacity with, you guessed it, no visual feedback*/}
      <SafeAreaView style={{ flex: 1,}} className="bg-black">
        <StatusBar barStyle="light-content" />
          <ScrollView contentContainerStyle={{ flexGrow: 1}}>
          <View style={{width: '90%',marginTop:45, alignSelf:'center'  }}>
            <View style={{backgroundColor:'#333333', borderRadius:5, width:'100%', flexDirection:'row', alignItems:'center'}}>
              <TouchableOpacity>
                <Image 
                  source={icons.MagnifyingIcon}  
                  style={{
                    resizeMode: 'contain', 
                    tintColor:'#FFD700',
                    width: 25, 
                    height: 25, marginLeft:15
                  }} 
                />
              </TouchableOpacity>
              <TextInput
                style={{height:'auto', marginLeft:5, textAlign:'center', fontFamily: 'Rubik-SemiBold', color: 'white', fontSize: 16, }}
                placeholder="Search Here"
                placeholderTextColor="gray"
                value={searchText}
                onChangeText={setSearchText}
                onFocus={() => {}} 
              />
            </View>
            <View style={{marginTop:10, borderRadius:60, width:'60%', height:40, padding:10, flexDirection:'row',alignItems:'center', justifyContent:'space-between', alignSelf:'center',backgroundColor:'#333333' }}>
              <Text style={{textAlign:'center', fontFamily: 'Rubik-SemiBold', color: 'white',opacity:.7}}>
                {typeCategory}
              </Text>
              <TouchableOpacity onPress={() => toggleMenu()}>
                <Image 
                  source={icons.RightArrowIcon}  
                  style={{
                    transform: [{ rotate: '90deg' }],
                    resizeMode: 'contain', 
                    tintColor:'#FFD700',
                    width: 25, 
                    height: 25, marginLeft:15
                  }} 
                />
              </TouchableOpacity>
            </View>
            {isMenuOpen && (
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={{ 
                  position: 'absolute',
                  top: 80,
                  right: 15, 
                  height: 'auto', 
                  backgroundColor: '#333333', 
                  minWidth: 110, 
                  padding: 10,
                  borderRadius: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                  elevation: 5,
                  zIndex: 29
                }}>
                  <TouchableOpacity onPress={() => (setTypeCategory('Document'), setIsMenuOpen(false))} style={{ width:'100%', height:'auto',padding:10, flexDirection:'row', alignItems:'center'}}>
                    <Image source={icons.dumbell} className="size-7" style={{ tintColor: 'black', marginRight:6, transform: [{ scaleX: -1 }]  }}   />
                    <Text style={{color: typeCategory === 'Document' ? '#FFD700' : 'white', fontFamily:  typeCategory === 'Document' ? 'Rubik-Bold' : 'Rubik-Medium',}} >PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => (setTypeCategory("Video"), setIsMenuOpen(false))} style={{ width:'100%', height:'auto',padding:10, flexDirection:'row', alignItems:'center'}}>
                    <Image source={icons.LineChartIcon} className="size-7" style={{ tintColor: 'black', marginRight:6, transform: [{ scaleX: -1 }]  }}   />
                    <Text style={{color: typeCategory === 'Video' ? '#FFD700' : 'white', fontFamily: typeCategory === 'Video' ? 'Rubik-Bold' : 'Rubik-Medium',}}>Video</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            )}
            <View style={{flexDirection:'row', alignItems:'center', flexWrap:'wrap', marginTop:5, justifyContent:'space-between'}}>
              {
                documentList.map((item) => (
                  <View key={item.id} style={{borderRadius:10, backgroundColor:'#333333', padding:10, width:'48%', position: 'relative', minHeight: 145, height:'37%', marginBottom:'4%'}}>
                    <View>
                      <Text style={{textAlign:'left', fontFamily: 'Rubik-Bold', color: '#FFD700'}}>{item.title}</Text>
                      <Text style={{textAlign:'left', fontFamily: 'Rubik-Bold', color: 'white', opacity:.8}}>{item.description.slice(0,48)}{item.description.length > 50 ? '...' : ''}</Text>
                    </View>
                    <Text style={{position: 'absolute', bottom: 10, right: 10, fontFamily: 'Rubik-SemiBold', color: 'white', opacity:.6}}>{item.type}</Text>
                  </View>
                ))
              }
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>

  )
}

export default Documents