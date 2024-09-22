import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Raleway_700Bold } from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";
import useUser from "@/hooks/auth/useUser";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Skeleton } from "@rneui/themed";
import io from "socket.io-client";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { useRef } from "react";
export default function Header({
  refreshKey,
  onImageUpdate,
}: {
  refreshKey: number;
  onImageUpdate: () => void;
}) {
  const [cartItems, setCartItems] = useState([]);
  const [notificationCount, setNotificationCount] = useState({
    totalCount: 0,
    unreadCount: 0,
  });
  const [imageLoading, setImageLoading] = useState(true);
  const { user, refetch } = useUser();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const imageUrl = user?.avatar?.url || null;
  useEffect(() => {
    console.log("User object:", user);
    console.log("Image URL:", imageUrl);
  }, [user, imageUrl]);
  const fetchNotificationCount = useCallback(async () => {
    if (!user?._id) return;
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      const response = await axios.get(
        `${SERVER_URI}/notification-count/${user._id}`,
        {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        }
      );
      setNotificationCount(response.data);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchNotificationCount();

    // Set up continuous fetching
    intervalRef.current = setInterval(() => {
      fetchNotificationCount();
    }, 5000); // Fetch every 5 seconds

    const socket = io(SERVER_URI);

    const handleAuthentication = async () => {
      const accessToken = await AsyncStorage.getItem("access_token");
      socket.emit("authenticate", { token: accessToken });
    };

    socket.on("connect", handleAuthentication);

    socket.on("authenticated", () => {
      console.log("Socket authenticated");
      if (user?._id) {
        socket.emit("join", user._id);
      }
    });

    socket.on("adminNotification", async () => {
      await fetchNotificationCount();
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      socket.disconnect();
    };
  }, [user?._id, fetchNotificationCount]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const cart = await AsyncStorage.getItem("cart");
      setCartItems(JSON.parse(cart ?? "") || []);
    };
    fetchCartItems();
  }, [refreshKey]);
  useEffect(() => {
    refetch(); // Refetch user data when the component mounts or refreshKey changes
  }, [refreshKey, refetch]);

  useEffect(() => {
    onImageUpdate();
  }, [onImageUpdate]);

  let [fontsLoaded] = useFonts({
    Raleway_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // const imageUrl = user?.avatar?.url
  //   ? `${user.avatar.url}?t=${new Date().getTime()}`
  //   : require("@/assets/icons/User.png");

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
    setImageLoading(false);
  };

  const handleImageError = () => {
    console.error("Failed to load image. Image URL:", imageUrl);
    setImageLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <View style={styles.imageContainer}>
            {imageLoading && (
              <Skeleton
                width={45}
                height={45}
                animation="wave"
                style={styles.skeleton}
              />
            )}
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={[styles.image, imageLoading && styles.imageHidden]}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <Image
                source={require("@/assets/icons/User.png")}
                style={styles.image}
                onLoad={() => {
                  console.log("Default image loaded");
                  setImageLoading(false);
                }}
              />
            )}
          </View>
        </TouchableOpacity>
        <View>
          <Text style={[styles.helloText, { fontFamily: "Raleway_700Bold" }]}>
            Hello👋
          </Text>
          <Text style={[styles.text, { fontFamily: "Raleway_700Bold" }]}>
            {user?.name || "Guest"}
          </Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/(routes)/notification")}
        >
          <Feather name="bell" size={26} color="black" />
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>
              {notificationCount.unreadCount}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/(routes)/cart")}
        >
          <Feather name="shopping-bag" size={26} color="black" />
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{cartItems?.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: "100%",
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    width: 45,
    height: 45,
    marginRight: 8,
    borderRadius: 100,
    overflow: "hidden",
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  imageHidden: {
    opacity: 0,
  },
  skeleton: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 45,
    height: 45,
    borderRadius: 100,
    backgroundColor: "#FDD6D7",
  },
  text: {
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    borderWidth: 1,
    borderColor: "#E1E2E5",
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 8,
  },
  badgeContainer: {
    width: 20,
    height: 20,
    backgroundColor: "#2467EC",
    position: "absolute",
    borderRadius: 50,
    right: -5,
    top: -5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
  },
  helloText: {
    color: "#7C7C80",
    fontSize: 14,
  },
});
