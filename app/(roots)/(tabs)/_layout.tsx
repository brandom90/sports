import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

import icons from "../../../constants/icons";
// shows everything from tabs folder

const TabIcon = ({ focused, icon, title}: {focused: boolean; icon: any; title: string}) => (
  <View className="flex-1 mt-3 flex flex-col items-center">
    <Image
      source={icon}
      tintColor={focused ? "#C9A227" : "white"}
      resizeMode="contain"
      className="size-6"
    />
    <Text
      className={`${
        focused
          ? "text-[#C9A227] font-rubik-medium"
          : "text-white font-rubik"
      } text-xs w-full text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'black',
          position: 'absolute',
          borderTopColor: "#fff",
          minHeight: 70,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerShown: false,
           tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused} icon={icons.home} title="Dashboard" />
          ),
        }}
      />
      <Tabs.Screen
        name="WorkoutList"
        options={{
          title: "Workouts",
          headerShown: false,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused} icon={icons.dumbell} title="Workout" />
          ),
        }}
      />
       <Tabs.Screen
        name="Documents"
        options={{
          title: "Docs",
          headerShown: false,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused} icon={icons.BookIcon} title="Docs" />
          ),
        }}
      />
       <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          headerShown: false,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused} icon={icons.ProfileIcon} title="Profile" />
          ),
        }}
      />
   
    </Tabs>
  );
};

export default TabsLayout;
