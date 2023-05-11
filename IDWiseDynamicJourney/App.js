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
  Dimensions,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {AsyncStorageKeys} from './constants';
import uuid from 'react-native-uuid';

const App = () => {
  const isDarkMode = false;

  const STEP_ID_DOCUMENT = '0';
  const STEP_SELFIE = '2';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    backgroundColor: '#FFFFFF',
  };

  const [journeyId, setJourneyId] = useState(null);
  const [stepButtonEnable, setStepButtonEnable] = useState(false);

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
      setStepButtonEnable(true);
      //Save Reference No using AsyncStorage
      setJourneyId(event.journeyId);
      AsyncStorage.setItem(AsyncStorageKeys.JOURNEY_ID, event.journeyId);

      IDWiseModule.getJourneySummary(event.journeyId);
    });

    eventEmitter.addListener('journeyResumed', event => {
      setJourneyId(event.journeyId);
      console.log(`Journey Resumed with id ${event.journeyId}`);
      setStepButtonEnable(true);
      IDWiseModule.getJourneySummary(event.journeyId);
    });

    eventEmitter.addListener('journeyCompleted', event => {
      console.log(`Journey Completed with id ${event.journeyId}`);
    });

    eventEmitter.addListener('journeyCancelled', event => {
      console.log(`Journey Cancelled with id ${event.journeyId}`);
    });

    eventEmitter.addListener('journeySummary', event => {
      console.log(`Journey Summary for id ${event.journeyId}`);
      console.log(`Journey Step Summaries ${event.journeyStepSummaries}`);
      console.log(`Journey Definition ${event.journeyDefinition}`);
      console.log(`Journey Result ${event.journeyResult}`);
      console.log(`Journey Is Complete ${event.journeyIsComplete}`);
    });

    eventEmitter.addListener('stepCaptured', event => {
      console.log(`Step Captured with id ${event.stepId}`);
    });

    eventEmitter.addListener('stepResult', event => {
      console.log(`Step Result with id ${event.stepId} : ${event.stepResult}`);
    });    
  });

  const resetJourney = () => {
    AsyncStorage.clear();
    setJourneyId(null);
    setStepButtonEnable(false);
    IDWiseModule.unloadSDK();
    startResumeJourney();
  };

  useEffect(() => {
    startResumeJourney();
  }, []);

  const startResumeJourney = () => {
    const clientKey = '<YOUR_CLIENT_KEY>';
    const theme = 'SYSTEM_DEFAULT'; // [ LIGHT, DARK, SYSTEM_DEFAULT ]

    const journeyDefinitionId = '<JOURNEY_DEFINITION_ID>';
    var referenceNo = null; //<REFERENCE_NO>
    const locale = '<LOCALE>';

    IDWiseModule.initializeSDK(clientKey, theme);

    AsyncStorage.getItem(AsyncStorageKeys.JOURNEY_ID).then(journeyId => {
      if (journeyId == null) {
        referenceNo = 'idwise_test_' + uuid.v4();
        IDWiseModule.startDynamicJourney(
          journeyDefinitionId,
          referenceNo,
          locale,
        );
      } else {
        IDWiseModule.resumeDynamicJourney(
          journeyDefinitionId,
          journeyId,
          locale,
        );
      }
    });
  };

  const navigateStep = stepId => {
    console.log(stepId, 'STEP_ID');
    IDWiseModule.startStep(stepId);
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
              disabled={!stepButtonEnable}
              onPress={() => navigateStep(STEP_ID_DOCUMENT)}>
              ID Document
            </Button>
           
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
              disabled={!stepButtonEnable}
              onPress={() => navigateStep(STEP_SELFIE)}>
              Selfie
            </Button>
            
          </View>
        </View>
      </View>

      {journeyId && (
        <Text
          style={{
            color: 'black',
            alignSelf: 'center',
            marginBottom: 25,
            fontSize: 18,
            position: 'absolute',
            top: Dimensions.get('window').height * 0.85,
          }}
          selectable={true}>
          <Text style={{fontWeight: 'bold'}}>Journey Id: </Text>
          {journeyId}
        </Text>
      )}

      <Button
        buttonColor="#FFFFF"
        style={styles.journeyButtonStyle}
        contentStyle={styles.journeyContentStyle}
        labelStyle={styles.journeyLabelStyle}
        onPress={resetJourney}>
        Test New Journey
      </Button>
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
