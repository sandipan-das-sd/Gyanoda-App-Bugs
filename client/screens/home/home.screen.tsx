import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  LayoutAnimation,
  UIManager,
  Platform,
  View,
  Text,
  ListRenderItemInfo,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header/header";
import SearchInput from "@/components/common/search.input";
import HomeBannerSlider from "@/components/home/home.banner.slider";
import AllCourses from "@/components/courses/all.courses";
import * as Font from "expo-font";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MemoizedHeader = React.memo(Header);
const MemoizedSearchInput = React.memo(SearchInput);
const MemoizedHomeBannerSlider = React.memo(HomeBannerSlider);
const MemoizedAllCourses = React.memo(AllCourses);

const FancyFooter = React.memo(() => (
  <View style={styles.footerContainer}>
    <View style={styles.textContainer}>
      <Text style={styles.mainText}>
        <Text style={styles.bigLetter}>C</Text>rack{" "}
        <Text style={styles.bigLetter}>E</Text>xams
      </Text>
    </View>
    <Text style={styles.mainTextSecondLine}>
      <Text style={styles.bigLetter}>W</Text>ith
      <Text style={styles.gyanodaText}>
        <Text style={styles.bigLetter}>G</Text>yanoda
      </Text>
      !
    </Text>
    <Text style={styles.subText}>Crafted with ♥️ in Kolkata, India</Text>
  </View>
));

interface ComponentItem {
  key: string;
  component: React.ReactNode;
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        CASlalomExtended: require("../../assets/fonts/CASlalomExtended-Medium.otf"),
      });
      setFontLoaded(true);
    }
    loadFonts();
  }, []);

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
      {
        key: "fancyFooter",
        component: <FancyFooter />,
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

  if (!fontLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
  footerContainer: {
    marginVertical: 30,
    paddingHorizontal: 20,
    alignItems: "flex-start",
  },
  textContainer: {
    paddingTop: 10,
  },
  mainText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#666",
    letterSpacing: 1,
    lineHeight: 48,
    fontFamily: "CASlalomExtended",
  },
  bigLetter: {
    fontSize: 48,
    fontWeight: "800",
  },
  mainTextSecondLine: {
    fontSize: 36,
    fontWeight: "800",
    color: "#666",
    letterSpacing: 1,
    lineHeight: 48,
    marginTop: 5,
    marginBottom: 10,
    fontFamily: "CASlalomExtended",
  },
  gyanodaText: {
    fontWeight: "900",
  },
  subText: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
});
