import React from "react";
import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const tabs = [
  { name: "home", title: "Home", icon: "home" },
  { name: "my-token", title: "My Token", icon: "confirmation-number" },
  { name: "take-token", title: "Take Token", icon: "add-circle" },
  { name: "history", title: "History", icon: "history" },
  { name: "profile", title: "Profile", icon: "person" },
] as const;

export default function DashboardLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {tabs.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
