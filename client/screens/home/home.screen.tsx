// import React, { useState, useCallback, useMemo } from "react";
// import {
//   StyleSheet,
//   FlatList,
//   RefreshControl,
//   LayoutAnimation,
//   UIManager,
//   Platform,
//   View,
//   ListRenderItemInfo,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import Header from "@/components/header/header";
// import SearchInput from "@/components/common/search.input";
// import HomeBannerSlider from "@/components/home/home.banner.slider";
// import AllCourses from "@/components/courses/all.courses";

// if (
//   Platform.OS === "android" &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// // Memoize child components
// const MemoizedHeader = React.memo(Header);
// const MemoizedSearchInput = React.memo(SearchInput);
// const MemoizedHomeBannerSlider = React.memo(HomeBannerSlider);
// const MemoizedAllCourses = React.memo(AllCourses);

// interface ComponentItem {
//   key: string;
//   component: React.ReactNode;
// }

// export default function HomeScreen() {
//   const [refreshing, setRefreshing] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const onRefresh = useCallback(() => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setRefreshing(true);
//     setRefreshKey((prevKey) => prevKey + 1);
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 2000);
//   }, []);

//   const handleImageUpdate = useCallback(() => {
//     setRefreshKey((prevKey) => prevKey + 1);
//   }, []);

//   const components = useMemo(
//     () => [
//       {
//         key: "header",
//         component: (
//           <MemoizedHeader
//             refreshKey={refreshKey}
//             onImageUpdate={handleImageUpdate}
//           />
//         ),
//       },
//       {
//         key: "searchInput",
//         component: <MemoizedSearchInput homeScreen={true} />,
//       },
//       { key: "homeBannerSlider", component: <MemoizedHomeBannerSlider /> },
//       {
//         key: "allCourses",
//         component: <MemoizedAllCourses refresh={refreshKey} />,
//       },
//     ],
//     [refreshKey, handleImageUpdate]
//   );

//   const renderItem = useCallback(
//     ({ item }: ListRenderItemInfo<ComponentItem>) => (
//       <View style={styles.componentContainer}>{item.component}</View>
//     ),
//     []
//   );

//   const keyExtractor = useCallback((item: ComponentItem) => item.key, []);

//   return (
//     <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
//       <FlatList
//         data={components}
//         renderItem={renderItem}
//         keyExtractor={keyExtractor}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         initialNumToRender={2}
//         maxToRenderPerBatch={1}
//         windowSize={3}
//         removeClippedSubviews={Platform.OS === "android"}
//         contentContainerStyle={styles.listContentContainer}
//       />
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 50,
//   },
//   listContentContainer: {
//     paddingBottom: 20,
//   },
//   componentContainer: {
//     marginBottom: 10,
//   },
// });
import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  LayoutAnimation,
  UIManager,
  Platform,
  View,
  ListRenderItemInfo,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header/header";
import SearchInput from "@/components/common/search.input";
import HomeBannerSlider from "@/components/home/home.banner.slider";
import AllCourses from "@/components/courses/all.courses";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Memoize child components
const MemoizedHeader = React.memo(Header);
const MemoizedSearchInput = React.memo(SearchInput);
const MemoizedHomeBannerSlider = React.memo(HomeBannerSlider);
const MemoizedAllCourses = React.memo(AllCourses);

interface ComponentItem {
  key: string;
  component: React.ReactNode;
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onRefresh = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRefreshing(true);
    setRefreshKey((prevKey) => prevKey + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleImageUpdate = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  const components = useMemo(
    () => [
      {
        key: "header",
        component: (
          <MemoizedHeader
            refreshKey={refreshKey}
            onImageUpdate={handleImageUpdate}
          />
        ),
      },
      {
        key: "searchInput",
        component: <MemoizedSearchInput homeScreen={true} />,
      },
      { key: "homeBannerSlider", component: <MemoizedHomeBannerSlider /> },
      {
        key: "allCourses",
        component: <MemoizedAllCourses refresh={refreshKey} />,
      },
    ],
    [refreshKey, handleImageUpdate]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ComponentItem>) => (
      <View style={styles.componentContainer}>{item.component}</View>
    ),
    []
  );

  const keyExtractor = useCallback((item: ComponentItem) => item.key, []);

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      <FlatList
        data={components}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        initialNumToRender={2}
        maxToRenderPerBatch={1}
        windowSize={3}
        removeClippedSubviews={Platform.OS === "android"}
        contentContainerStyle={styles.listContentContainer}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  componentContainer: {
    marginBottom: 10,
  },
});
