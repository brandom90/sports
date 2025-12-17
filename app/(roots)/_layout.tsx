// speacial layout for properties and tabs
// they have to pass auth to see other pages, and this enforce it

import { useGlobalContext } from "../../lib/global-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
    // For now, use dummy values for demonstration:
    let {loading, isLogged} = useGlobalContext();
    if(loading) {
        return (
            <SafeAreaView className="bg-white h-full flex justify-center items-center">
                {/* Shows loading circle thing untill loaded in */}
                <ActivityIndicator className="text-primary-300" size="large"/>
            </SafeAreaView>
        )
    }

    if(!isLogged) return <Redirect href='/sign-in' />


    // if all above is passed show a screen
    return <Slot />
}