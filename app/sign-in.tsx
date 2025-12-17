import icons from '../constants/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View,TextInput, Animated, Easing } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApiError } from '../types/api'; 
import { useGlobalContext } from "../lib/global-provider";
import { router } from 'expo-router'

const signIn = () => {
  const  { setUser,setTeam } = useGlobalContext();

  const [hidePassword, setHidePassword] = useState(true);
  const [hasAccount, setHasAccount] = useState(false)

  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(true);
  const role = 'athlete'

  // For Error popups
  const [checkTrigger, setCheckTrigger] = useState(false)
  const [userCreated, setUserCreated] = useState(false)
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setalertMessage] = useState('')
  const slideAnim = useRef(new Animated.Value(-60)).current;

  const handleEmailChange = (text:string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(text));
  };

  useEffect(() => {
   
  if (checkTrigger) {
    
    setShowAlert(true);

    Animated.timing(slideAnim, {
      toValue: 50,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -60,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setShowAlert(false);
        setCheckTrigger(false);
        setUserCreated(false);
      });
    }, 2000);
  }

}, [checkTrigger]);

  const validateForm = () => {
    const trimmedPassword = password.trim();
    const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(trimmedPassword);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);

    if ( !trimmedPassword || !email) {
      setalertMessage("Not all fields are filled");
      return false;
    }

    if (!isValidPassword) {
      setalertMessage("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return false;
    }

    if (!isValidEmail) {
      setalertMessage("Email must be a valid email address");
      return false;
    }
    return true;
  };

  const handleNewAthlete = async () => {
    const isValid = validateForm();
    setCheckTrigger(true); // this will display the alert if invalid
    if (!isValid) return;
    
    const workout = {
      password: password.trim(),
      email,
      role,
    };
    try {
      const response = await fetch('http://192.168.86.27:4000/api/createathlete', {
        method: 'POST',
        body: JSON.stringify(workout),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUserCreated(true);
        setalertMessage('Account created! Now its time to log in.');
        setPassword('');
        setEmail('');
      } else {
        const err = await response.json() as ApiError;
        setalertMessage(
          err?.error || 
          err?.message || 
          'Something went wrong. Please try again later.'
        );
        setCheckTrigger(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setalertMessage(error.message);
      } else {
        setalertMessage('An unexpected error occurred.');
      }
      setCheckTrigger(true);
    }
  };

  const handleLogIn = async () => {
    const res = await fetch('http://192.168.86.27:4000/api/loginscheck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setalertMessage(data.error);
    if (res.ok) {
      const user = data.athlete
      setUser(user);
      const response = await fetch('http://192.168.86.27:4000/api/findteam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ athleteId: user._id })
      });
      const json = await response.json()

      if (response.ok) {
        setTeam(json)    
      }
      router.push(`/`);
    } else {
      setCheckTrigger(true);
    }
  };


  // will replace with the use effect, D.R.Y
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Scale down animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      })
    ]).start(() => {
      // Call your original handler after animation completes
      if (hasAccount === false) {
        handleNewAthlete();
      } else {
        handleLogIn();
      }
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} className="bg-black">
        <StatusBar barStyle="light-content" />

        {showAlert && (
          <Animated.View style={{
            position: 'absolute',
            top: slideAnim,
            left: 20,
            right: 20, borderRadius:10,
            zIndex: 1000,
            padding: 12,
            backgroundColor: userCreated ? '#FFD700' : '#ff4d4d',
            alignItems: 'center'
          }}>
            <Text style={{ color: userCreated ? 'black' : 'white', fontWeight: 'bold' }}>{alertMessage}</Text>
          </Animated.View>
        )}

        
        <View style={{ flex: 1, justifyContent: 'space-between', padding: 20 }}>
          {/* Top Content */}
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View>
              <Text style={{ color: 'white', fontFamily: 'Rubik-Bold', fontSize: 40, marginTop: '25%' }}>
                { hasAccount === false ? 'Sign Up' : 'Sign In'}
              </Text>
              <Text style={{ color: 'white', fontFamily: 'Rubik-Bold', fontSize: 14, opacity: 0.5, marginBottom: 30, marginTop:'-2%', }}>
               
                { hasAccount === true ? 'Sign in and pick up where you left off' : 'Sign up and join your team!'}
              </Text>
            {/* Email Input */}
            <View style={{ borderColor: isValidEmail ? '#FFD700' : 'red', borderRadius: 5, borderWidth: 1, padding: '3%', width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: '5%' }}>
              <Image 
                source={icons.MailIcon}  
                style={{ resizeMode: 'contain', tintColor: '#333333', width: 30, height: 30 }} 
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="white"
                style={{
                  color: 'white',
                  fontFamily: 'Rubik-Bold',
                  fontSize: 12,
                  opacity: 0.7,
                  marginLeft: '2.5%',
                  flex: 1,
                  paddingVertical: 5,
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleEmailChange}
                value={email}
              />
            </View>

            {/* Password Input */}
            <View style={{ borderColor: '#FFD700', borderRadius: 5, borderWidth: 1, padding: '3%', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Image 
                  source={icons.keyIcon}  
                  style={{ resizeMode: 'contain', tintColor: '#333333', width: 30, height: 30 }} 
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="white"
                  style={{ color: 'white', fontFamily: 'Rubik-Bold', fontSize: 12, opacity: 0.7, marginLeft: '2.5%', flex: 1,paddingVertical: 5, }}
                  secureTextEntry={hidePassword}
                  autoCapitalize="none"
                  onChangeText={setPassword}
                />
              </View>
              <TouchableOpacity onPress={() => setHidePassword(prev => !prev)}>
                <Image 
                  source={hidePassword ? icons.hideEyeIcon : icons.showEyeIcon}  
                  style={{ resizeMode: 'contain', tintColor: '#333333', width: 30, height: 30 }} 
                />
              </TouchableOpacity>
            </View>


              <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 10 }}>
                <Text style={{ color: '#FFD700', fontFamily: 'Rubik-Bold', fontSize: 12, opacity: 0.5, borderBottomWidth: 2, borderColor: '#333333' }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Bottom Content */}
          <View style={{ alignItems: 'center', marginBottom:'15%' }}>
            <Animated.View style={{ 
              transform: [{ scale: scaleValue }], 
              width: '100%' 
            }}>
              <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#FFD700',
                  borderRadius: 30,
                  paddingVertical: 12,
                  paddingHorizontal: 40,
                  width: '100%',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: 'black', fontFamily: 'Rubik-Bold', fontSize: 20 }}>
                  {hasAccount === false ? 'Sign Up' : 'Log In'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={() => setHasAccount(!hasAccount)}>
              <Text style={{
                color: '#FFD700',
                fontFamily: 'Rubik-Bold',
                fontSize: 12,
                opacity: 0.5,
                borderBottomWidth: 2,
                borderColor: '#333333'
              }}>
                { hasAccount === false ? 'Have an account? Log In!' : "Don't have an account? Sign up!"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default signIn;
