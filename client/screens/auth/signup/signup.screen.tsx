import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { CheckBox } from "react-native-elements";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import { router } from "expo-router";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { Toast } from "react-native-toast-notifications";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { commonStyles } from "@/styles/common/common.styles";
import * as Location from "expo-location";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { firebase } from '../../../utils/config';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    phone: "+91",
    location: "",
  });
  const [initializing, setInitializing] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [required, setRequired] = useState("");
  const [error, setError] = useState({
    password: "",
    phone: "",
  });
  const [isTermsChecked, setTermsChecked] = useState(false);
  const [locationInputValue, setLocationInputValue] = useState("");

  const [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "1035545013004-p0tlf28nbm8847ivn29dr1r6cio30r7n.apps.googleusercontent.com",
    androidClientId:
      "1035545013004-etpoa0p6t8be3uflcolq1g7jjd84fuo4.apps.googleusercontent.com",
    iosClientId:
      "1035545013004-m8vqnen4o8ts8b3tnevke5bhkesclm9l.apps.googleusercontent.com",
  });
  const onAuthStateChanged = (userInfo:any) => {
    if (userInfo) {
      setUserInfo(userInfo);
    }
    if (initializing) 
      setInitializing(false);
  };
  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  // const signInWithFacebook = async () => {
  //   setIsFacebookLoading(true);
  //   try {
  //     await LoginManager.logInWithPermissions(['public_profile', 'email']);
  //     const data = await AccessToken.getCurrentAccessToken();
  //     if (!data) {
  //       return;
  //     }
  //     const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
  //     const auth = getAuth();
  //     const response = await signInWithCredential(auth, facebookCredential);
  //     console.log(response);
  //     await sendFacebookUserDataToServer(response.user);
  //   } catch (error) {
  //     console.log(error);
  //     Toast.show("Error occurred during Facebook sign-in", { type: "danger" });
  //   }
  // };
  const signInWithFacebook = async () => {
    setIsFacebookLoading(true);
    try {
      await LoginManager.logInWithPermissions(['public_profile', 'email']);
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        setIsFacebookLoading(false);
        return;
      }
      const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
      const auth = getAuth();
      const response = await signInWithCredential(auth, facebookCredential);
      console.log(response);
      await sendFacebookUserDataToServer(response.user);
    } catch (error) {
      console.log(error);
      Toast.show("Error occurred during Facebook sign-in", { type: "danger" });
    } finally {
      setIsFacebookLoading(false);
    }
  };
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error);
    }
  };
  // const sendFacebookUserDataToServer = useCallback(async (userData:any) => {
  //   setIsLoading(true);
  //   try {
  //     const dataToSend = {
  //       email: userData.email,
  //       name: userData.displayName,
  //       picture: userData.photoURL,
  //       id: userData.uid,
  //       phone: userData.phoneNumber || '' 
  //     };
  //     console.log("Sending data to server:", dataToSend);
  
  //     const response = await axios.post(`${SERVER_URI}/facebook-signin`, dataToSend, {
  //       timeout: 10000 // 10 seconds
  //     });
  //     console.log("Server response:", response.data);
      
  //     if (response.data.accessToken) {
  //       await AsyncStorage.setItem("access_token", response.data.accessToken);
  //     }
  //     if (response.data.refreshToken) {
  //       await AsyncStorage.setItem("refresh_token", response.data.refreshToken);
  //     }
  //     setIsLoading(false);
  //     Toast.show("Facebook sign-in successful", { type: "success" });

  //     router.push("/(tabs)/courses");
  //   } catch (error) {
  //     console.error("Error sending user data to server:", error);
  //     if (axios.isAxiosError(error)) {
  //       const errorMessage = error.response?.data?.message || error.message;
  //       Toast.show(`Error: ${errorMessage}`, { type: "danger" });
  //     } else {
  //       Toast.show("An unexpected error occurred during Facebook sign-in", { type: "danger" });
  //     }
  //   }
  // }, []);
  const sendFacebookUserDataToServer = useCallback(async (userData:any) => {
    setIsLoading(true);
    try {
      const dataToSend = {
        email: userData.email,
        name: userData.displayName,
        picture: userData.photoURL,
        id: userData.uid,
        phone: userData.phoneNumber || '' 
      };
      console.log("Sending data to server:", dataToSend);
  
      const response = await axios.post(`${SERVER_URI}/facebook-signin`, dataToSend, {
        timeout: 10000 // 10 seconds
      });
      console.log("Server response:", response.data);
      
      if (response.data.accessToken) {
        await AsyncStorage.setItem("access_token", response.data.accessToken);
      }
      if (response.data.refreshToken) {
        await AsyncStorage.setItem("refresh_token", response.data.refreshToken);
      }
      Toast.show("Facebook sign-in successful", { type: "success" });

      router.push("/(tabs)/courses");
    } catch (error) {
      console.error("Error sending user data to server:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        Toast.show(`Error: ${errorMessage}`, { type: "danger" });
      } else {
        Toast.show("An unexpected error occurred during Facebook sign-in", { type: "danger" });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  const handlePasswordValidation = useCallback((value: string) => {
    const password = value;
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;

    if (!passwordSpecialCharacter.test(password)) {
      setError((prev) => ({
        ...prev,
        password: "Write at least one special character",
      }));
      setUserInfo((prev) => ({ ...prev, password: "" }));
    } else if (!passwordOneNumber.test(password)) {
      setError((prev) => ({
        ...prev,
        password: "Write at least one number",
      }));
      setUserInfo((prev) => ({ ...prev, password: "" }));
    } else if (!passwordSixValue.test(password)) {
      setError((prev) => ({
        ...prev,
        password: "Write at least 6 characters",
      }));
      setUserInfo((prev) => ({ ...prev, password: "" }));
    } else {
      setError((prev) => ({
        ...prev,
        password: "",
      }));
      setUserInfo((prev) => ({ ...prev, password: value }));
    }
  }, []);

  const handleSignIn = useCallback(async () => {
    const { name, email, password, phone } = userInfo;
    let valid = true;

    if (!name) {
      setError((prev) => ({ ...prev, name: "Name is required" }));
      valid = false;
    }
    if (!email) {
      setError((prev) => ({ ...prev, email: "Email is required" }));
      valid = false;
    }
    if (!password) {
      setError((prev) => ({
        ...prev,
        password: "Password is required",
      }));
      valid = false;
    }
    if (!phone || phone === "+91") {
      setError((prev) => ({
        ...prev,
        phone: "Phone number is required",
      }));
      valid = false;
    }

    if (!valid) {
      Toast.show("Please fill all the required fields", {
        type: "danger",
      });
      return;
    }

    if (!isTermsChecked) {
      Toast.show("Please agree to the Terms & Conditions to proceed.", {
        type: "danger",
      });
      return;
    }
    setButtonSpinner(true);
    try {
      const res = await axios.post(`${SERVER_URI}/registration`, {
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
        phone: userInfo.phone,
        location: userInfo.location,
      });
      await AsyncStorage.setItem("activation_token", res.data.activationToken);
      await AsyncStorage.setItem("user_email", userInfo.email);
      await AsyncStorage.setItem("user_info", JSON.stringify(userInfo));
      Toast.show(res.data.message, {
        type: "success",
      });
      setUserInfo({
        name: "",
        email: "",
        password: "",
        phone: "+91",
        location: "",
      });
      router.push("/(routes)/verifyAccount");
    } catch (error) {
      setButtonSpinner(false);
      // const errorMessage = error.response?.data?.message || "An error occurred during registration. Please try again.";
      Toast.show("An error occurred during registration. Please try again.", {
        type: "danger",
      });
    } finally {
      setButtonSpinner(false);
    }
  }, [userInfo, isTermsChecked]);

  const handlePhoneNumberChange = useCallback((value: string) => {
    setUserInfo((prev) => ({ ...prev, phone: value }));
  }, []);

  const handlePhoneNumberValidation = useCallback(() => {
    const phoneNumber = userInfo.phone.replace(/^\+?91/, "");
    if (phoneNumber.length !== 10) {
      setError((prev) => ({
        ...prev,
        phone: "Phone number must be 10 digits",
      }));
      setUserInfo((prev) => ({ ...prev, phone: "" }));
    } else {
      setError((prev) => ({
        ...prev,
        phone: "",
      }));
      setUserInfo((prev) => ({ ...prev, phone: `+91${phoneNumber}` }));
    }
  }, [userInfo.phone]);

  const handleAutoCompleteLocation = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Toast.show("Permission to access location was denied", { type: "error" });
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDrIlKE-OzCydDLFrnffUK3Lazd3A3n7vg`
      );

      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        setLocationInputValue(address);
        setUserInfo((prev) => ({ ...prev, location: address }));
      }
    } catch (error) {
      Toast.show("Error fetching location", { type: "error" });
    }
  }, []);

  const getUserInfo = useCallback(async (token: string) => {
    if (!token) return;
    const url = "https://www.googleapis.com/userinfo/v2/me";
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserDetails(user);
      await sendUserDataToServer(user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, []);

  const sendUserDataToServer = useCallback(async (userData: any) => {
    try {
      const response = await axios.post(`${SERVER_URI}/google-signin`, userData);
      console.log("Server response:", response.data);
      
      if (response.data.accessToken) {
        await AsyncStorage.setItem("access_token", response.data.accessToken);
      }
      if (response.data.refreshToken) {
        await AsyncStorage.setItem("refresh_token", response.data.refreshToken);
      }

      Toast.show("Google sign-in successful", { type: "success" });
    } catch (error) {
      console.error("Error sending user data to server:", error);
      Toast.show("Error occurred during Google sign-in", { type: "danger" });
    }
  }, []);

  useEffect(() => {
    const handleSigninGoogle = async () => {
      if (response?.type === "success") {
        const accessToken = response.authentication?.accessToken;
        if (accessToken) {
          await getUserInfo(accessToken);
          router.push("/(tabs)");
          Toast.show("Welcome Home", { type: "success" });
        }
      }
    };

    handleSigninGoogle();
  }, [response, getUserInfo]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // ... rest of your component rendering logic ...

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 20 }}
    >
    <ScrollView>
    <Image
      style={styles.signInImage}
      source={require("@/assets/sign-in/Sign_up.png")}
    />
    <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
      Let's get started!
    </Text>
    <Text style={styles.learningText}>Create an account to Gyanoda</Text>
    <View style={styles.inputContainer}>
      <View>
        <TextInput
          style={[styles.input, { paddingLeft: 40, marginBottom: -12 }]}
          keyboardType="default"
          value={userInfo.name}
          placeholder="Enter your name.."
          onChangeText={(value) =>
            setUserInfo({ ...userInfo, name: value })
          }
        />
        <AntDesign
          style={{ position: "absolute", left: 26, top: 14 }}
          name="user"
          size={20}
          color={"#A1A1A1"}
        />
      </View>
      <View>
        <TextInput
          style={[styles.input, { paddingLeft: 40 }]}
          keyboardType="email-address"
          value={userInfo.email}
          placeholder="example@email.com"
          onChangeText={(value) =>
            setUserInfo({ ...userInfo, email: value })
          }
        />
        <Fontisto
          style={{ position: "absolute", left: 26, top: 17.8 }}
          name="email"
          size={20}
          color={"#A1A1A1"}
        />
        {required && (
          <View style={commonStyles.errorContainer}>
            <Entypo name="cross" size={18} color={"red"} />
          </View>
        )}
        <View style={{ marginTop: 15 }}>
          <TextInput
            style={commonStyles.input}
            keyboardType="default"
            secureTextEntry={!isPasswordVisible}
            defaultValue=""
            placeholder="Enter password..."
            onChangeText={handlePasswordValidation}
          />
          <TouchableOpacity
            style={styles.visibleIcon}
            onPress={() => setPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <Ionicons name="eye-outline" size={23} color={"#747474"} />
            ) : (
              <Ionicons
                name="eye-off-outline"
                size={23}
                color={"#747474"}
              />
            )}
          </TouchableOpacity>
          <SimpleLineIcons
            style={styles.icon2}
            name="lock"
            size={20}
            color={"#A1A1A1"}
          />
        </View>
        {error.password && (
          <View style={[commonStyles.errorContainer, { top: 125 }]}>
            <Entypo name="cross" size={18} color={"red"} />
            <Text style={{ color: "red", fontSize: 11, marginTop: -1 }}>
              {error.password}
            </Text>
          </View>
        )}
        <View style={{ marginTop: 15 }}>
          <TextInput
            style={commonStyles.input}
            keyboardType="phone-pad"
            value={userInfo.phone}
            placeholder="Enter your phone number..."
            onChangeText={handlePhoneNumberChange}
            onBlur={handlePhoneNumberValidation}
          />
          <SimpleLineIcons
            style={styles.icon2}
            name="phone"
            size={20}
            color={"#A1A1A1"}
          />
        </View>
        {error.phone && (
          <View style={[commonStyles.errorContainer, { top: 195 }]}>
            <Entypo name="cross" size={18} color={"red"} />
            <Text style={{ color: "red", fontSize: 11, marginTop: -1 }}>
              {error.phone}
            </Text>
          </View>
        )}
        <View style={{ marginTop: 15 }}>
          <View style={styles.locationInputContainer}>
            <GooglePlacesAutocomplete
              placeholder="Enter your location.."
              onPress={(data, details = null) => {
                setUserInfo({ ...userInfo, location: data.description });
                setLocationInputValue(data.description);
              }}
              query={{
                key: "AIzaSyDrIlKE-OzCydDLFrnffUK3Lazd3A3n7vg",
                language: "en",
              }}
              textInputProps={{
                value: locationInputValue,
                onChangeText: setLocationInputValue,
              }}
              styles={{
                container: {
                  flex: 1,
                },
                textInput: {
                  ...styles.input,
                  paddingLeft: 40,
                  paddingRight: 110,
                },
                listView: {
                  backgroundColor: "white",
                  borderRadius: 8,
                  marginHorizontal: 16,
                  marginTop: 5,
                },
              }}
              fetchDetails={true}
              enablePoweredByContainer={false}
            />
            <TouchableOpacity
              style={styles.autoCompleteButton}
              onPress={handleAutoCompleteLocation}
            >
              <Text style={styles.autoCompleteButtonText}>
                Allow-location
              </Text>
            </TouchableOpacity>
            <SimpleLineIcons
              style={{
                position: "absolute",
                left: 23,
                top: 17.8,
              }}
              name="location-pin"
              size={20}
              color={"#A1A1A1"}
            />
          </View>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            checked={isTermsChecked}
            onPress={() => setTermsChecked(!isTermsChecked)}
          />
          <TouchableOpacity onPress={() => router.push("/(routes)/terms")}>
            <Text style={styles.checkboxText}>
              I agree to the Terms & Conditions
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignIn}
        >
          {buttonSpinner ? (
            <ActivityIndicator size="small" color={"white"} />
          ) : (
            <Text style={styles.signupButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.socialLoginContainer}>
          <TouchableOpacity onPress={() => promptAsync()}>
            <FontAwesome name="google" size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={signInWithFacebook} disabled={isFacebookLoading}>
          {isFacebookLoading ? (
              <ActivityIndicator size="small" color="#4267B2" />
            ) : (
              <FontAwesome name="facebook" size={30} />
            )}
           
          </TouchableOpacity>
        </View>

        <View style={styles.signupRedirect}>
          <Text style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold" }}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/(routes)/login")}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Raleway_600SemiBold",
                color: "#2467EC",
                marginLeft: 5,
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  signInImage: {
    width: "60%",
    height: 250,
    alignSelf: "center",
    marginTop: 4,
  },
  welcomeText: {
    textAlign: "center",
    fontSize: 24,
  },
  learningText: {
    textAlign: "center",
    color: "#575757",
    fontSize: 15,
    marginTop: 5,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginTop: 30,
    rowGap: 30,
  },
  input: {
    height: 55,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingLeft: 35,
    fontSize: 16,
    backgroundColor: "white",
    color: "#1A1A1A",
  },
  visibleIcon: {
    position: "absolute",
    right: 30,
    top: 15,
  },
  icon2: {
    position: "absolute",
    left: 23,
    top: 17.8,
    marginTop: -2,
  },
  forgotSection: {
    marginHorizontal: 16,
    textAlign: "right",
    fontSize: 16,
    marginTop: 10,
  },
  signupRedirect: {
    flexDirection: "row",
    marginHorizontal: 16,
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxText: {
    marginLeft: -8,
    fontSize: 14,
    color: "#2467EC",
  },
  signupButton: {
    padding: 16,
    borderRadius: 50,
    marginHorizontal: 50,
    backgroundColor: "#2467EC",
    marginTop: 15,
  },
  signupButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
  },
  socialLoginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 20,
  },
  termsText: {
    fontSize: 14,
    color: "#2467EC",
    marginLeft: 5,
  },
  locationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  autoCompleteButton: {
    position: "absolute",
    right: 20,
    top: Platform.OS === "android" ? 14 : 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  autoCompleteButtonText: {
    color: "#2467EC",
    fontSize: 12,
    fontWeight: "thin",
  },
});