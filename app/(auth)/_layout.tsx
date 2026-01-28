import { Link, Slot, Stack } from "expo-router"
import { View } from "react-native"


const AuthLayout = () => {

    return(
        <Stack 
            screenOptions={{
                headerShown: false,
                animation: "ios_from_right"
            }}
        >
            <Stack.Screen 
                name="welcome" 
                options={{
                    title: "Welcome"
                }}
            />

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