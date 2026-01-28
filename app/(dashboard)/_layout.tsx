import React from "react";
import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, Platform, StyleSheet } from "react-native";

const tabs = [
  { name: "home", title: "Home", icon: "home", isSpecial: false },
  { name: "my-token", title: "My Token", icon: "confirmation-number", isSpecial: false },
  { name: "take-token", title: "", icon: "add-circle", isSpecial: true },
  { name: "history", title: "History", icon: "history", isSpecial: false },
  { name: "profile", title: "Profile", icon: "person", isSpecial: false },
] as const;

export default function DashboardLayout() {
  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 10,
          backgroundColor: '#FFFFFF',
          height: 75,
          paddingBottom: 5,
          paddingTop: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 6,
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      {tabs.map(({ name, title, icon, isSpecial }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarLabel: isSpecial ? () => null : title,
            tabBarIcon: ({ color, focused, size }) => {
              if (isSpecial) {
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      top: -10,
                    }}
                  >
                    {/* Outer glow rings */}
                    <View
                      style={{
                        position: 'absolute',
                        width: 85,
                        height: 85,
                        borderRadius: 42.5,
                        backgroundColor: 'rgba(99, 102, 241, 0.08)',
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        width: 75,
                        height: 75,
                        borderRadius: 37.5,
                        backgroundColor: 'rgba(99, 102, 241, 0.12)',
                      }}
                    />
                    
                    {/* Main gradient button */}
                    <View
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        backgroundColor: '#6366F1',
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#6366F1',
                        shadowOffset: {
                          width: 0,
                          height: 8,
                        },
                        shadowOpacity: 0.45,
                        shadowRadius: 18,
                        elevation: 15,
                        borderWidth: 5,
                        borderColor: '#FFFFFF',
                      }}
                    >
                      {/* Gradient overlay */}
                      <View
                        style={{
                          position: 'absolute',
                          width: 70,
                          height: 70,
                          borderRadius: 35,
                          backgroundColor: 'rgba(139, 92, 246, 0.25)',
                        }}
                      />
                      
                      <MaterialIcons 
                        name={icon} 
                        color="#FFFFFF" 
                        size={40}
                      />
                    </View>
                  </View>
                );
              }

              // Regular tabs
              return (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 55,
                    height: 55,
                    top: 10
                  }}
                >
                  {focused && (
                    <>
                      <View
                        style={{
                          position: 'absolute',
                          width: 55,
                          height: 55,
                          borderRadius: 27.5,
                          backgroundColor: '#EEF2FF',
                        }}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          borderWidth: 2,
                          borderColor: color,
                          opacity: 0.2,
                        }}
                      />
                    </>
                  )}
                  
                  <MaterialIcons 
                    name={icon} 
                    color={focused ? color : '#9CA3AF'} 
                    size={focused ? 28 : 24}
                  />
                  
                  {focused && (
                    <View
                      style={{
                        position: 'absolute',
                        top: -4,
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: color,
                      }}
                    />
                  )}
                </View>
              );
            },
          }}
        />
      ))}
    </Tabs>
  );
}