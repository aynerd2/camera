import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, } from 'react-native-vision-camera';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera'
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload'
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo'
import RNFS from 'react-native-fs';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Home = () => {
  const device = useCameraDevice('back')
  const { hasPermission } = useCameraPermission()
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      // setHasPermission(status === 'authorized');
    })();
  }, []);


  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'quality',
        });
        console.log('Photo path:', photo.path); // Debugging
        const fileExists = await RNFS.exists(photo.path);
        console.log('File exists:', fileExists); // Debugging
        if (fileExists) {
          setTimeout(() => {
            setPhotoUri('file://' + photo.path);
            setLoading(false);
          }, 2000);
        } else {
          setLoading(false);
          Alert.alert('Error', 'The photo file does not exist.');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error taking photo:', error);
      }
    }
  };

  const getClassDescription = (classId) => {
    switch (classId) {
      case 0: return "Fake 1000 naira note";
      case 1: return "Fake 500 naira note";
      case 2: return "Genuine 1000 naira note";
      case 3: return "Genuine 500 naira note";
      default: return "Unknown class";
    }
  };


  const getAlertType = (classId) => {
    return classId === 0 || classId === 1 ? ALERT_TYPE.DANGER : ALERT_TYPE.SUCCESS;
  };

  const uploadImage = async () => {
    if (!photoUri) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await axios.post('http://192.168.130.135:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload result:', response.data);
      const classDescription = getClassDescription(response.data.class);
      const confidence = response.data.confidence; 
      const alertType = getAlertType(response.data.class);
      const previousResults = JSON.parse(await AsyncStorage.getItem('results')) || [];
      await AsyncStorage.setItem('results', JSON.stringify([...previousResults, { classDescription, confidence }]));

      Dialog.show({
        type: alertType,
        title: 'RESULT',
        textBody: `${classDescription}\nConfidence: ${confidence.toFixed(2)}`,
      });
      setUploading(false);

    } catch (error) {
      setUploading(false);
      console.error('Upload error:', error);
      Alert.alert('Upload Error', 'There was an error uploading the image.');
    }
  };

  const retakePhoto = () => {
    setPhotoUri(null);
  };

  if (device == null) return <Text style={{ color: "red", fontSize: 14 }}>No camera device available</Text>;

  return (


    <AlertNotificationRoot>

    <View style={{ flex: 1, position: "relative"}}>
    {hasPermission ? (
      <>
        {!photoUri ? (
          <>
            <Camera
              style={{ flex: 1 }}
              device={device}
              isActive={true}
              ref={cameraRef}
              photo={true}
            />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={takePicture}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faCamera} size={55} color={"#FFFFFF"} />
            </TouchableOpacity>
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            )}
          </>
        ) : (
          <View style={styles.imageContainer}>
            {uploading ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <>
                <Image source={{ uri: photoUri }} style={styles.image} />
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={uploadImage} style={styles.icon}>
                    <FontAwesomeIcon icon={faUpload} size={55} color={"#FFFFFF"} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={retakePhoto} style={styles.icon}>
                    <FontAwesomeIcon icon={faRedo} size={55} color={"#FFFFFF"} />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      </>
    ) : (
      <Text>No access to camera</Text>
    )}
  </View>
  </AlertNotificationRoot>
  );
};

export default Home;

const styles = StyleSheet.create({
  cameraButton: {
    position: "absolute",
    bottom: "10%",
    alignSelf: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 400,
    height: 600,
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  icon: {
    marginHorizontal: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})





























































