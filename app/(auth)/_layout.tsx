import { Link, Slot, Stack } from "expo-router"
import { View } from "react-native"


const AuthLayout = () => {

    return(
        <Stack 
            screenOptions={{
                headerShown: true,
                animation: "ios_from_right"
            }}
        >

            <Stack.Screen 
                name="login" 
                options={{
                    title: "Login"
                }}
            />
            <Stack.Screen 
                name="register" 
                options={{
                    title: "Register"
                }}
            />
        </Stack>
    )
}

export default AuthLayout