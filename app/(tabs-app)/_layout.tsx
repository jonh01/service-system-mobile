import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ tabBarShowLabel: false }}>
      <Tabs.Screen
        name="(stacka)"
        options={{
          title: 'Serviço',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) return <FontAwesome6 name="clipboard-list" color={color} size={size} />;

            return <FontAwesome6 name="clipboard-list" color={color} size={size} />;
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) return <FontAwesome name="search" color={color} size={size} />;

            return <FontAwesome name="search" color={color} size={size} />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) return <FontAwesome name="user" color={color} size={size} />;

            return <FontAwesome name="user" color={color} size={size} />;
          },
        }}
      />
    </Tabs>
  );
}
