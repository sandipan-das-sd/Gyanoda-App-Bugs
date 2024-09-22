// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
// } from "react-native";
// import React, { useState, useEffect, useRef } from "react";
// import { Entypo, Feather } from "@expo/vector-icons";
// import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";

// const { width } = Dimensions.get("window");
// const videoHeight = width * (9 / 16);

// const VIMEO_VIDEO_ID = "972392519";
// const VIDEO_DURATION = 30000;

// export default function CourseLesson({
//   courseDetails,
// }: {
//   courseDetails: CoursesType;
// }) {
//   const [visibleSections, setVisibleSections] = useState<Set<string>>(
//     new Set<string>()
//   );
//   const [videoLinks, setVideoLinks] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState<Record<string, boolean>>({});
//   const videoRefs = useRef<Record<string, Video | null>>({});

//   const videoSections: string[] = [
//     ...new Set<string>(
//       courseDetails.courseData.map((item: CourseDataType) => item.videoSection)
//     ),
//   ];

//   const toggleSection = (section: string) => {
//     const newVisibleSections = new Set(visibleSections);
//     if (newVisibleSections.has(section)) {
//       newVisibleSections.delete(section);
//     } else {
//       newVisibleSections.add(section);
//     }
//     setVisibleSections(newVisibleSections);
//   };

//   const fetchVimeoVideoUrl = async () => {
//     try {
//       const response = await fetch(
//         `https://api.vimeo.com/videos/${VIMEO_VIDEO_ID}?fields=files`,
//         {
//           headers: {
//             Authorization: `bearer 3bf28d224161d1f6aa19abe18b9aa16d`,
//             Accept: "application/vnd.vimeo.*+json; version=3.4",
//           },
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch video data.");
//       }
//       const data = await response.json();
//       return data?.files?.[0]?.link || null;
//     } catch (error) {
//       console.error("Error fetching Vimeo video URL:", error);
//       return null;
//     }
//   };

//   const loadVideo = async (videoId: string) => {
//     setLoading((prev) => ({ ...prev, [videoId]: true }));
//     const videoLink = await fetchVimeoVideoUrl();
//     if (videoLink) {
//       setVideoLinks((prev) => ({ ...prev, [videoId]: videoLink }));
//     }
//     setLoading((prev) => ({ ...prev, [videoId]: false }));
//   };

//   const onPlaybackStatusUpdate = (
//     status: AVPlaybackStatus,
//     videoId: string
//   ) => {
//     if (status.isLoaded && status.positionMillis >= VIDEO_DURATION) {
//       videoRefs.current[videoId]?.setPositionAsync(0);
//     }
//   };

//   return (
//     <View style={{ flex: 1, rowGap: 10, marginBottom: 10 }}>
//       <View style={styles.contentContainer}>
//         <View>
//           {videoSections.map((section: string, sectionIndex: number) => {
//             const isSectionVisible = visibleSections.has(section);

//             // Filter videos by section
//             const sectionVideos: CourseDataType[] =
//               courseDetails?.courseData?.filter(
//                 (i: CourseDataType) => i.videoSection === section
//               );

//             return (
//               <View key={sectionIndex}>
//                 <TouchableOpacity onPress={() => toggleSection(section)}>
//                   <View style={styles.sectionHeader}>
//                     <Text style={styles.sectionTitle}>{section}</Text>
//                     <Entypo
//                       name={isSectionVisible ? "chevron-up" : "chevron-down"}
//                       size={23}
//                       color="#6707FE"
//                     />
//                   </View>
//                 </TouchableOpacity>
//                 {isSectionVisible && (
//                   <>
//                     {sectionVideos.map(
//                       (video: CourseDataType, videoIndex: number) => (
//                         <View key={videoIndex} style={styles.videoItem}>
//                           <View style={styles.itemContainer}>
//                             <View style={styles.itemContainerWrapper}>
//                               <View style={styles.itemTitleWrapper}>
//                                 <Feather
//                                   name="video"
//                                   size={20}
//                                   color="#8a8a8a"
//                                 />
//                                 <Text style={styles.itemTitleText}>Demos</Text>
//                               </View>
//                               <View style={styles.itemDataContainer}>
//                                 <Text style={styles.videoLength}></Text>
//                               </View>
//                             </View>
//                           </View>
//                           <View style={styles.videoContainer}>
//                             {loading[video.videoUrl] ? (
//                               <View style={styles.loadingContainer}>
//                                 <ActivityIndicator
//                                   size="large"
//                                   color="#0000ff"
//                                 />
//                               </View>
//                             ) : videoLinks[video.videoUrl] ? (
//                               <Video
//                                 ref={(ref) =>
//                                   (videoRefs.current[video.videoUrl] = ref)
//                                 }
//                                 source={{ uri: videoLinks[video.videoUrl] }}
//                                 rate={1.0}
//                                 volume={1.0}
//                                 isMuted={false}
//                                 resizeMode={ResizeMode.CONTAIN}
//                                 shouldPlay={false}
//                                 isLooping={false}
//                                 style={styles.video}
//                                 useNativeControls
//                                 onPlaybackStatusUpdate={(status) =>
//                                   onPlaybackStatusUpdate(status, video.videoUrl)
//                                 }
//                               />
//                             ) : (
//                               <TouchableOpacity
//                                 style={styles.loadVideoButton}
//                                 onPress={() => loadVideo(video.videoUrl)}
//                               >
//                                 <Text style={styles.loadVideoButtonText}>
//                                   Click To See
//                                 </Text>
//                               </TouchableOpacity>
//                             )}
//                           </View>
//                         </View>
//                       )
//                     )}
//                   </>
//                 )}
//               </View>
//             );
//           })}
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   videoContainer: {
//     width: "100%",
//     height: videoHeight,
//     marginVertical: 10,
//   },
//   video: {
//     width: "100%",
//     height: "100%",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorText: {
//     textAlign: "center",
//     color: "red",
//     fontSize: 16,
//   },
//   contentContainer: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#E1E2E5",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 8,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 10,
//     borderBottomColor: "#DCDCDC",
//     borderBottomWidth: 1,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontFamily: "Raleway_600SemiBold",
//   },
//   videoItem: {
//     borderWidth: 1,
//     borderColor: "#E1E2E5",
//     borderRadius: 8,
//     marginTop: 10,
//     overflow: "hidden",
//   },
//   itemContainer: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#E1E2E5",
//     marginHorizontal: 10,
//     paddingVertical: 12,
//   },
//   itemContainerWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   itemTitleWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   itemTitleText: {
//     marginLeft: 8,
//     color: "#525258",
//     fontSize: 16,
//     fontFamily: "Nunito_500Medium",
//   },
//   itemDataContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   videoLength: {
//     marginRight: 6,
//     color: "#818181",
//     fontFamily: "Nunito_400Regular",
//   },
//   loadVideoButton: {
//     backgroundColor: "#007bff",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100%",
//   },
//   loadVideoButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";

const { width } = Dimensions.get("window");
const videoHeight = width * (9 / 16);

// JSON structure for videos
const videoData = [
  // Physics Videos
  {
    id: "972392519",
    title: "WBJEE Physics 2014 Solutions",
    subtitle: "Detailed explanations of Physics questions from WBJEE 2014",
    thumbnailUrl: "https://example.com/wbjee-physics-2014.jpg",
    section: "Physics",
  },
  {
    id: "972392520",
    title: "WBJEE Physics 2015 Problem Solving",
    subtitle: "Step-by-step solutions for WBJEE 2015 Physics problems",
    thumbnailUrl: "https://example.com/wbjee-physics-2015.jpg",
    section: "Physics",
  },
  {
    id: "972392521",
    title: "WBJEE Physics 2022 Analysis",
    subtitle: "In-depth analysis of WBJEE 2022 Physics paper",
    thumbnailUrl: "https://example.com/wbjee-physics-2022.jpg",
    section: "Physics",
  },
  {
    id: "972392522",
    title: "WBJEE Physics 2024 Preparation",
    subtitle: "Key topics and strategies for WBJEE 2024 Physics",
    thumbnailUrl: "https://example.com/wbjee-physics-2024.jpg",
    section: "Physics",
  },

  // Mathematics Videos
  {
    id: "972392523",
    title: "WBJEE Mathematics 2015 Solutions",
    subtitle: "Comprehensive solutions for WBJEE 2015 Mathematics questions",
    thumbnailUrl: "https://example.com/wbjee-math-2015.jpg",
    section: "Mathematics",
  },
  {
    id: "972392524",
    title: "WBJEE Mathematics 2020 Problem Solving",
    subtitle: "Effective techniques for solving WBJEE 2020 Math problems",
    thumbnailUrl: "https://example.com/wbjee-math-2020.jpg",
    section: "Mathematics",
  },
  {
    id: "972392525",
    title: "WBJEE Mathematics 2024 Preparation Guide",
    subtitle: "Essential topics and practice for WBJEE 2024 Mathematics",
    thumbnailUrl: "https://example.com/wbjee-math-2024.jpg",
    section: "Mathematics",
  },

  // Chemistry Videos
  {
    id: "972392526",
    title: "WBJEE Chemistry 2014 Solutions",
    subtitle: "Detailed explanations of Chemistry questions from WBJEE 2014",
    thumbnailUrl: "https://example.com/wbjee-chemistry-2014.jpg",
    section: "Chemistry",
  },
  {
    id: "972392527",
    title: "WBJEE Chemistry 2020 Analysis",
    subtitle: "Comprehensive analysis of WBJEE 2020 Chemistry paper",
    thumbnailUrl: "https://example.com/wbjee-chemistry-2020.jpg",
    section: "Chemistry",
  },
  {
    id: "972392528",
    title: "WBJEE Chemistry 2022 Problem Solving",
    subtitle: "Effective strategies for WBJEE 2022 Chemistry questions",
    thumbnailUrl: "https://example.com/wbjee-chemistry-2022.jpg",
    section: "Chemistry",
  },
];

export default function CourseLesson() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set<string>());
  const [videoLinks, setVideoLinks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, Video | null>>({});

  const videoSections: string[] = [...new Set(videoData.map(video => video.section))];

  const toggleSection = (section: string) => {
    const newVisibleSections = new Set(visibleSections);
    if (newVisibleSections.has(section)) {
      newVisibleSections.delete(section);
    } else {
      newVisibleSections.add(section);
    }
    setVisibleSections(newVisibleSections);
  };

  const fetchVimeoVideoUrl = async (videoId: string) => {
    try {
      const response = await fetch(
        `https://api.vimeo.com/videos/${videoId}?fields=files`,
        {
          headers: {
            Authorization: `bearer 3bf28d224161d1f6aa19abe18b9aa16d`,
            Accept: "application/vnd.vimeo.*+json; version=3.4",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch video data.");
      }
      const data = await response.json();
      return data?.files?.[0]?.link || null;
    } catch (error) {
      console.error("Error fetching Vimeo video URL:", error);
      return null;
    }
  };

  const loadVideo = async (videoId: string) => {
    setLoading(prev => ({ ...prev, [videoId]: true }));
    const videoLink = await fetchVimeoVideoUrl(videoId);
    if (videoLink) {
      setVideoLinks(prev => ({ ...prev, [videoId]: videoLink }));
    }
    setLoading(prev => ({ ...prev, [videoId]: false }));
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus, videoId: string) => {
    if (status.isLoaded) {
      setIsPlaying(prev => ({ ...prev, [videoId]: status.isPlaying }));
    }
  };

  const togglePlayPause = (videoId: string) => {
    const videoRef = videoRefs.current[videoId];
    if (videoRef) {
      if (isPlaying[videoId]) {
        videoRef.pauseAsync();
      } else {
        videoRef.playAsync();
      }
    }
  };

  return (
    <View style={styles.container}>
      {videoSections.map((section: string, sectionIndex: number) => {
        const isSectionVisible = visibleSections.has(section);
        const sectionVideos = videoData.filter(video => video.section === section);

        return (
          <View key={sectionIndex}>
            <TouchableOpacity onPress={() => toggleSection(section)}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section}</Text>
                <Entypo
                  name={isSectionVisible ? "chevron-up" : "chevron-down"}
                  size={23}
                  color="#6707FE"
                />
              </View>
            </TouchableOpacity>
            {isSectionVisible && (
              <>
                {sectionVideos.map((video, videoIndex) => (
                  <View key={videoIndex} style={styles.videoItem}>
                    <View style={styles.itemContainer}>
                      <View style={styles.itemContainerWrapper}>
                        <View style={styles.itemTitleWrapper}>
                          <Feather name="video" size={20} color="#8a8a8a" />
                          <Text style={styles.itemTitleText}>{video.title}</Text>
                        </View>
                      </View>
                      <Text style={styles.subtitleText}>{video.subtitle}</Text>
                    </View>
                    <View style={styles.videoContainer}>
                      {loading[video.id] ? (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                      ) : videoLinks[video.id] ? (
                        <>
                          <Video
                            ref={(ref) => (videoRefs.current[video.id] = ref)}
                            source={{ uri: videoLinks[video.id] }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode={ResizeMode.CONTAIN}
                            shouldPlay={false}
                            isLooping={false}
                            style={styles.video}
                            useNativeControls
                            onPlaybackStatusUpdate={(status) =>
                              onPlaybackStatusUpdate(status, video.id)
                            }
                          />
                          <TouchableOpacity
                            style={styles.playPauseButton}
                            onPress={() => togglePlayPause(video.id)}
                          >
                            <Feather
                              name={isPlaying[video.id] ? "pause" : "play"}
                              size={30}
                              color="#FFFFFF"
                            />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          style={styles.loadVideoButton}
                          onPress={() => loadVideo(video.id)}
                        >
                          <Image
                            source={{ uri: video.thumbnailUrl }}
                            style={styles.thumbnail}
                          />
                          <Text style={styles.loadVideoButtonText}>
                            Click to Load Video
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  videoContainer: {
    width: "100%",
    height: videoHeight,
    marginVertical: 10,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomColor: "#DCDCDC",
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  videoItem: {
    borderWidth: 1,
    borderColor: "#E1E2E5",
    borderRadius: 8,
    marginTop: 10,
    overflow: "hidden",
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E1E2E5",
    padding: 10,
  },
  itemContainerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemTitleText: {
    marginLeft: 8,
    color: "#525258",
    fontSize: 16,
    fontWeight: "500",
  },
  subtitleText: {
    color: "#818181",
    fontSize: 14,
    marginTop: 5,
  },
  loadVideoButton: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  loadVideoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  thumbnail: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
  },
  playPauseButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});