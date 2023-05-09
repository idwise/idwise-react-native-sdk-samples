/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {AsyncStorageKeys} from './constants';
import uuid from 'react-native-uuid';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faImage} from '@fortawesome/free-solid-svg-icons';
import AppModal from './AppModal';

const App = () => {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    backgroundColor: '#FFFFFF',
  };

  const [documentImage, setDocumentImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);

  const [modalTitle, setModalTitle] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const {IDWiseModule} = NativeModules;

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(IDWiseModule);

    eventEmitter.addListener('onError', event => {
      console.log(
        `An Error has occured  ${event.errorCode} : ${event.errorMessage}`,
      );
    });

    eventEmitter.addListener('journeyStarted', event => {
      console.log(`Journey Started with id ${event.journeyId}`);

      //Save Reference No using AsyncStorage
      AsyncStorage.setItem(AsyncStorageKeys.JOURNEY_ID, event.journeyId);
    });

    eventEmitter.addListener('journeyCompleted', event => {
      console.log(`Journey Completed with id ${event.journeyId}`);
    });

    eventEmitter.addListener('journeyCancelled', event => {
      console.log(`Journey Cancelled with id ${event.journeyId}`);
    });

    eventEmitter.addListener('stepCaptured', event => {
      console.log(`Step Captured with id ${event.stepId}`);
      console.log(`Step Captured Bitmap Base64 ${event.bitmapBase64}`);
      if (event.stepId === '0') {
        setDocumentImage(`data:image/png;base64,${event.bitmapBase64}`);
      } else if (event.stepId === '2') {
        setSelfieImage(`data:image/png;base64,${event.bitmapBase64}`);
      }
    });

    eventEmitter.addListener('stepResult', event => {
      console.log(`Step Result with id ${event.stepId}`);
      console.log(`Step Result data ${event.stepResult}`);
    });
  });

  const resetJourney = () => {
    AsyncStorage.clear();
    IDWiseModule.unloadSDK();
    startResumeJourney();
  };

  useEffect(() => {
    startResumeJourney();
  }, []);

  const startResumeJourney = () => {
    const clientKey =
      'QmFzaWMgT1dJNU5HRXhPVFV0WWpRek1pMDBPVFl3TFdFd1lqQXRPR0UwWW1Sa1lUQTJOVEkzT21ZMWIxWk1WM0J0Tm1SYWMxVjBWRGxuV1VKcGVVaFhVVVJoYUUxMVQwVkxialZZZVROaU5EZz0=';
    const theme = 'SYSTEM_DEFAULT'; // [ LIGHT, DARK, SYSTEM_DEFAULT ]

    const journeyDefinitionId = '9b94a195-b432-4960-a0b0-8a4bdda06527';
    var referenceNo = null;
    const locale = 'en';

    IDWiseModule.initializeSDK(clientKey, theme);

    AsyncStorage.getItem(AsyncStorageKeys.JOURNEY_ID).then(journeyId => {
      if (journeyId == null) {
        referenceNo = 'idwise_test_' + uuid.v4();
        console.log('Starting Journey');
        console.log(referenceNo, 'REFERENCE_NO');
        IDWiseModule.startDynamicJourney(
          journeyDefinitionId,
          referenceNo,
          locale,
        );
      } else {
        console.log('Resuming Journey');
        referenceNo = journeyId;
        console.log(journeyId, 'REFERENCE_NO');

        IDWiseModule.resumeDynamicJourney(
          journeyDefinitionId,
          referenceNo,
          locale,
        );
      }
    });
  };

  const navigateStep = stepId => {
    console.log(stepId, 'STEP_ID');
    IDWiseModule.startStep(stepId);
  };

  const showImageModal = (title, image) => {
    setModalTitle(title);
    setModalImage(image);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={styles.body}>Welcome to</Text>
        <Text style={styles.heading}>Verification Journey</Text>
        <Text style={styles.body}>
          Please take some time to verify your identity
        </Text>

        <View style={{flex: 1, justifyContent: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Button
              mode="contained"
              buttonColor="#2A4CD0"
              style={styles.stepButtonStyle}
              contentStyle={styles.stepContentStyle}
              labelStyle={{
                fontSize: 18,
              }}
              onPress={() => navigateStep('0')}>
              ID Document
            </Button>
            {documentImage && (
              <Pressable
                style={{
                  position: 'absolute',
                  left: Dimensions.get('window').width * 0.8,
                  marginRight: 40,
                }}
                onPress={() => {
                  showImageModal('ID Document', documentImage);
                }}>
                <FontAwesomeIcon color="#2A4CD0" icon={faImage} size={32} />
              </Pressable>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Button
              mode="contained"
              buttonColor="#2A4CD0"
              style={[styles.stepButtonStyle, {marginTop: 10}]}
              contentStyle={styles.stepContentStyle}
              labelStyle={{
                fontSize: 18,
              }}
              onPress={() => navigateStep('2')}>
              Selfie
            </Button>
            {selfieImage && (
              <Pressable
                style={{
                  position: 'absolute',
                  left: Dimensions.get('window').width * 0.8,
                  marginRight: 40,
                }}
                onPress={() => {
                  showImageModal('Selfie', selfieImage);
                }}>
                <FontAwesomeIcon color="#2A4CD0" icon={faImage} size={32} />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      <Button
        buttonColor="#FFFFF"
        style={styles.journeyButtonStyle}
        contentStyle={styles.journeyContentStyle}
        labelStyle={styles.journeyLabelStyle}
        onPress={resetJourney}>
        Test New Journey
      </Button>

      <AppModal
        modalVisible={modalVisible}
        heading={modalTitle}
        imageSrc={modalImage}
        buttonCallback={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: '#000',
    marginTop: 20,
    fontSize: 30,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  body: {
    color: '#000',
    marginTop: 20,
    fontSize: 14,
    alignSelf: 'center',
  },
  stepButtonStyle: {
    borderRadius: 10,
    alignSelf: 'center',
    width: '50%',
    justifyContent: 'center',
  },
  stepContentStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  stepLabelStyle: {
    fontSize: 18,
  },
  journeyButtonStyle: {
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
    width: '90%',
    borderWidth: 1,
    borderColor: '#2A4CD0',
  },
  journeyContentStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  journeyLabelStyle: {
    fontSize: 18,
    color: '#2A4CD0',
  },
});

export default App;
