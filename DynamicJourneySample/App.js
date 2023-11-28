/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { IDWise } from 'idwise-react-native-sdk/src/IDWise';
import { IDWiseSDKTheme } from 'idwise-react-native-sdk/src/IDWiseConstants';
import uuid from 'react-native-uuid';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AsyncStorageKeys } from './constants';

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

  const resetJourney = () => {
    AsyncStorage.clear();
    setJourneyId(null);
    setStepButtonEnable(false);
    IDWise.unloadSDK();
    startResumeJourney();
  };

  const initializeCallback = {
    onError(data) {
      console.log('Event onInitalizeError:', data);
    },
  };

  const journeySummaryCallback = {
    onJourneySummary(data) {
      console.log('Event onJourneySummary received:', data);
    },
    onError(data) {
      console.log('Event onJourneySummaryError:', data);
    },
  };

  const journeyCallback = {
    onJourneyStarted(data) {
      console.log(`Journey Started with id ${data.journeyId}`);
      setStepButtonEnable(true);
      //Save Reference No using AsyncStorage
      setJourneyId(data.journeyId);
      AsyncStorage.setItem(AsyncStorageKeys.JOURNEY_ID, data.journeyId);

      IDWise.getJourneySummary(data.journeyId, journeySummaryCallback);
    },
    onJourneyResumed(data) {
      setJourneyId(data.journeyId);
      console.log(`Journey Resumed with id ${data.journeyId}`);
      setStepButtonEnable(true);
      IDWise.getJourneySummary(data.journeyId, journeySummaryCallback);
    },
    onJourneyFinished(data) {
      console.log(`Journey Fininshed with id ${data.journeyId}`);
    },
    onJourneyCancelled(data) {
      console.log(`Journey Cancelled with id ${data.journeyId}`);
    },
    onError(data) {
      console.log('Event onJourneyError received:', data);
    },
  };

  const stepCallback = {
    onStepCaptured(stepId, capturedImageB64) {
      console.log('Event onStepCaptured stepId:', stepId);
    },
    onStepResult(stepId,stepResult) {
      console.log('Event onStepResult stepId:', stepId);
      console.log('Event onStepResult stepResult:', stepResult);
    }
  };

  useEffect(() => {
    startResumeJourney();
  }, []);

  const startResumeJourney = () => {
    const clientKey = '<CLIENT_KEY>'; // Provided by IDWise
    const theme = IDWiseSDKTheme.SYSTEM_DEFAULT; // [ LIGHT, DARK, SYSTEM_DEFAULT ]

    const journeyDefinitionId = '<JOURNEY_DEF_ID>'; // as known as FLOW ID, provided by IDWise
    var referenceNo = '<REFERENCE_NO>';
    const locale = 'en';

    IDWise.initialize(clientKey, theme, initializeCallback);

    AsyncStorage.getItem(AsyncStorageKeys.JOURNEY_ID).then(journeyId => {
      if (journeyId == null) {
        referenceNo = 'idwise_test_' + uuid.v4();
        IDWise.startDynamicJourney(
          journeyDefinitionId,
          referenceNo,
          locale,
          journeyCallback,
          stepCallback,
        );
      } else {
        IDWise.resumeDynamicJourney(
          journeyDefinitionId,
          journeyId,
          locale,
          journeyCallback,
          stepCallback,
        );
      }
    });
  };

  const navigateStep = stepId => {
    console.log(stepId, 'STEP_ID');
    IDWise.startStep(stepId);
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
