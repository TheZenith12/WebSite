import React from "react";
import { View, Text, Image, ScrollView } from "react-native";

export default function PlaceDetail({ route }) {
  const { place } = route.params;

  return (
    <ScrollView style={{ padding: 16 }}>
      <Image
        source={{ uri: place.image }}
        style={{ width: "100%", height: 250, borderRadius: 12 }}
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}>
        {place.name}
      </Text>
      <Text style={{ marginTop: 10, fontSize: 16 }}>{place.description}</Text>
    </ScrollView>
  );
}
