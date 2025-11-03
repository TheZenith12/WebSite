import React from "react";
import { View, Text, Button, Image, ScrollView } from "react-native";

export default function HomeScreen({ navigation }) {
  const places = [
    {
      id: 1,
      name: "Хөвсгөл нуур",
      image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb",
      description: "Монголын хамгийн үзэсгэлэнтэй байгалийн нуур."
    },
    {
      id: 2,
      name: "Тэрэлж",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
      description: "Улаанбаатараас ойрхон амралтын бүс."
    }
  ];

  return (
    <ScrollView style={{ padding: 16 }}>
      {places.map((place) => (
        <View key={place.id} style={{ marginBottom: 20 }}>
          <Image
            source={{ uri: place.image }}
            style={{ width: "100%", height: 200, borderRadius: 12 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 8 }}>
            {place.name}
          </Text>
          <Button
            title="Дэлгэрэнгүй"
            onPress={() => navigation.navigate("PlaceDetail", { place })}
          />
        </View>
      ))}
    </ScrollView>
  );
}
