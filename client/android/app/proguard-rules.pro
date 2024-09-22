# Keep React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep Expo modules
-keep class expo.modules.** { *; }

# Keep Hermes engine
-keep class com.facebook.hermes.unicode.** { *; }

# Keep ReactNative's native methods
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}

# Keep custom components
-keep public class com.study_bloom.gyanoda.** { *; }

# Keep Axios
-keep class com.github.axioscode.** { *; }

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Reanimated (you already have this, but keeping it here for completeness)
-keep class com.swmansion.reanimated.** { *; }

# Keep JavaScript callbacks
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Keep native libraries
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep generic signatures and annotations
-keepattributes Signature
-keepattributes *Annotation*

# Keep enum constants
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelables
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

# Keep the BuildConfig
-keep class com.study_bloom.gyanoda.BuildConfig { *; }

# Keep the support library
-keep class android.support.v4.** { *; }
-keep interface android.support.v4.** { *; }

# Keep retrofit (if you're using it for API calls)
-keep class retrofit2.** { *; }
-keepattributes Exceptions

# Keep okhttp3 (used by many networking libraries)
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**