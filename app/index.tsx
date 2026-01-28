import "../global.css";

import React from "react";
import { View, ActivityIndicator } from "react-native";
import {  Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const App = () => {

  const { user, loading} = useAuth()

    if (loading) {
        return (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size={"large"} color={"#4ade80"}/>
          </View>
        )
    }

    if (user) {
        return <Redirect href={"/home"}/>
        
    } else {
        return <Redirect href={"/welcomePage"}/>
    }
};

export default App;
