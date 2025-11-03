import React from "react";
import { View, Text, Image, ScrollView } from "react-native";

export default function DetailsScreen({ route }) {
  const { place } = route.params;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Image source={{ uri: place.img }} style={{ width: "100%", height: 250 }} />
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>{place.name}</Text>
        <Text style={{ fontSize: 16, color: "#555", marginVertical: 10 }}>{place.short}</Text>
        <Text style={{ fontSize: 18, color: "#16a34a", fontWeight: "600" }}>
          Үнэ: {place.price} ₮
        </Text>
      </View>
    </ScrollView>
  );
}
