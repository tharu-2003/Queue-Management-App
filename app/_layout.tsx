import { View, Text } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LoaderProvider } from '@/context/LoaderContext'
import { AuthProvider } from '@/context/AuthContext'

const RootLayout = () => {

  const insets = useSafeAreaInsets()
  console.log(insets)

  return (

    <LoaderProvider>
      <AuthProvider>
        <View className='flex-1' style={{ marginTop: insets.top}}>
          <Slot></Slot>
        </View>
      </AuthProvider>
    </LoaderProvider>

  )
}

export default RootLayout