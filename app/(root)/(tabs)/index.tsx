
import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import seed from "@/lib/seed";
import { useAppwrite } from "@/lib/useAppwrite";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Button, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const {user} = useGlobalContext();
  const params = useLocalSearchParams<{query?: string; filter?: string;}>();

  const { data: latestProperties, loading: latestPropertiesLoading } =
  useAppwrite({
    fn: getLatestProperties,
  });

const {
  data: properties,
  refetch,
  loading,
} = useAppwrite({
  fn: getProperties,
  params: {
    filter: params.filter!,
    query: params.query!,
    limit: 10,
  },
  skip: true,
});

useEffect(() => {
  refetch({
    filter: params.filter!,
    query: params.query!,
    limit: 10,
  });
}, [params.filter, params.query]);

const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
   <SafeAreaView className="bg-white h-full">
    <FlatList 
      data={properties}
      renderItem={({ item }) => <Card item={item} onPress={()=> {handleCardPress(item.$id)}}/>}
      keyExtractor={(item) => item.$id}
      numColumns={2}
      contentContainerClassName="pb-32"
      columnWrapperClassName="flex gap-5 px-5"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator size="large" className="text-primary-300 mt-5"/>
        ) : <NoResults/>
      }
      ListHeaderComponent={
      <View className="px-5">
        <View className="flex flex-row justify-between items-center mt-5">
          <View className="flex flex-row items-center">
            <Image source={{uri: user?.avatar}} className="size-12 rounded-full"/>
            <View className="flex flex-col items-start">
              <Text className="text-xs font-rubik text-black-100 ml-2">Good Morning!</Text>
              <Text className="text-base font-rubik-medium text-black-300 ml-2">{user?.name}</Text>
            </View>
          </View>
          <Image source={icons.bell} className="size-6"/>
        </View>

        <Search/>
        <View className="my-5">
          <View className="flex flex-row justify-between items-center">
            <Text className="text-xl font-rubik-bold">Featured</Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
            </TouchableOpacity>
          </View>

          {latestPropertiesLoading ? (
                <ActivityIndicator size="large" className="text-primary-300" />
              ) : !latestProperties || latestProperties.length === 0 ? (
                <NoResults />
              ) : (
          <FlatList 
            data={latestProperties}
            renderItem={({ item }) => <FeaturedCard item={item} onPress={()=> {handleCardPress(item.$id)}}/>}
            keyExtractor={(item) => item.$id}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerClassName="flex gap-5 mt-5"
          />
              )}
        </View>

        <View className="flex flex-row justify-between items-center">
            <Text className="text-xl font-rubik-bold">Our Recommendations</Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
            </TouchableOpacity>
          </View>

        <Filters />
    </View>
      }
    />
   </SafeAreaView>
  );
}
