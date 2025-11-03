import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import AddPlaceScreen from "../screens/AddPlaceScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Нүүр" component={HomeScreen} />
        <Stack.Screen name="Дэлгэрэнгүй" component={DetailsScreen} />
        <Stack.Screen name="Нэмэх" component={AddPlaceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
