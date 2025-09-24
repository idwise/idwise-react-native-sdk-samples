/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { IDWiseTheme } from 'idwise-react-native-sdk/src/IDWiseConstants';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { IDWiseDynamic } from 'idwise-react-native-sdk/src/IDWiseDynamic';
import uuid from 'react-native-uuid';
import { AsyncStorageKeys } from './constants';

const App = () => {
  const isDarkMode = false;

  const STEP_ID_DOCUMENT = '30';
  const STEP_SELFIE = '20';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: '#FFFFFF',
  };

  const [journeyId, setJourneyId] = useState(null);
  const [stepButtonEnable, setStepButtonEnable] = useState(false);

  const resetJourney = () => {
    AsyncStorage.clear();
    setJourneyId(null);
    setStepButtonEnable(false);
    IDWiseDynamic.unloadSDK();
    startResumeJourney();
  };

  const initializeCallback = {
    onError(idwiseError) {
      console.log(
        'Event onInitalizeError:',
        idwiseError.code,
        idwiseError.message,
      );
    },
  };

  const journeySummaryCallback = {
    onJourneySummary(summary) {
      console.log('Event onJourneySummary received:', summary);
    },
    onError(idwiseError) {
      console.log(
        'Event onJourneySummaryError:',
        idwiseError.code,
        idwiseError.message,
      );
    },
  };

  const journeyCallback = {
    onJourneyStarted(journeyStartedInfo) {
      console.log(`Journey Started with id ${journeyStartedInfo.journeyId}`);
      setStepButtonEnable(true);
      //Save Reference No using AsyncStorage
      setJourneyId(journeyStartedInfo.journeyId);
      AsyncStorage.setItem(
        AsyncStorageKeys.JOURNEY_ID,
        journeyStartedInfo.journeyId,
      );

      IDWiseDynamic.getJourneySummary(journeySummaryCallback);
    },
    onJourneyResumed(journeyResumedInfo) {
      setJourneyId(journeyResumedInfo.journeyId);
      console.log(`Journey Resumed with id ${journeyResumedInfo.journeyId}`);
      setStepButtonEnable(true);
      IDWiseDynamic.getJourneySummary(journeySummaryCallback);
    },
    onJourneyCompleted(journeyCompletedInfo) {
      console.log(
        `Journey Fininshed with id ${journeyCompletedInfo.journeyId}`,
      );
    },
    onJourneyCancelled(journeyCancelledInfo) {
      console.log(
        `Journey Cancelled with id ${journeyCancelledInfo.journeyId}`,
      );
    },
    onJourneyBlocked(journeyBlockedInfo) {
      console.log(`Journey Blocked ${journeyBlockedInfo}`);
    },
    onError(idwiseError) {
      console.log(
        'Event onJourneyError received:',
        idwiseError.code,
        idwiseError.message,
      );
    },
  };

  const stepCallback = {
    onStepCaptured(stepCapturedInfo) {
      console.log('Event onStepCaptured stepId:', stepCapturedInfo.stepId);
    },
    onStepResult(stepResultInfo) {
      console.log('Event onStepResult stepId:', stepResultInfo.stepId);
      console.log('Event onStepResult stepResult:', stepResultInfo.stepResult);
    },
    onStepCancelled(stepCancelledInfo) {
      console.log('Event onStepCancelled stepId:', stepCancelledInfo.stepId);
    },
  };

  useEffect(() => {
    startResumeJourney();
  }, []);

  const finishDynamicJourney = () => {
    IDWiseDynamic.finishJourney();
  };

  const startResumeJourney = () => {
    const clientKey = 'CLIENT-KEY'; // Provided by IDWise
    const theme = IDWiseTheme.SYSTEM_DEFAULT; // [ LIGHT, DARK, SYSTEM_DEFAULT ]

    const flowId = 'FLOW-ID'; // as known as journey definition id, provided by IDWise
    var referenceNo = '<REFERENCE_NO>';
    const locale = 'en';

    IDWiseDynamic.initialize(clientKey, theme, initializeCallback);

    AsyncStorage.getItem(AsyncStorageKeys.JOURNEY_ID).then(journeyId => {
      if (journeyId == null) {
        referenceNo = 'idwise_test_' + uuid.v4();
        IDWiseDynamic.startJourney(
          flowId,
          referenceNo,
          locale,
          null,
          journeyCallback,
          stepCallback,
        );
      } else {
        IDWiseDynamic.resumeJourney(
          flowId,
          journeyId,
          locale,
          null,
          journeyCallback,
          stepCallback,
        );
      }
    });
  };

  const navigateStep = stepId => {
    console.log(stepId, 'STEP_ID');
    IDWiseDynamic.startStep(stepId);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.body}>Welcome to</Text>
        <Text style={styles.heading}>Verification Journey</Text>
        <Text style={styles.body}>
          Please take some time to verify your identity
        </Text>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              mode="contained"
              buttonColor="#2A4CD0"
              style={styles.stepButtonStyle}
              contentStyle={styles.stepContentStyle}
              labelStyle={{
                fontSize: 18,
              }}
              disabled={!stepButtonEnable}
              onPress={() => navigateStep(STEP_ID_DOCUMENT)}
            >
              ID Document
            </Button>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              mode="contained"
              buttonColor="#2A4CD0"
              style={[styles.stepButtonStyle, { marginTop: 10 }]}
              contentStyle={styles.stepContentStyle}
              labelStyle={{
                fontSize: 18,
              }}
              disabled={!stepButtonEnable}
              onPress={() => navigateStep(STEP_SELFIE)}
            >
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
          selectable={true}
        >
          <Text style={{ fontWeight: 'bold' }}>Journey Id: </Text>
          {journeyId}
        </Text>
      )}

      <Button
        buttonColor="#FFFFF"
        style={styles.journeyButtonStyle}
        contentStyle={styles.journeyContentStyle}
        labelStyle={styles.journeyLabelStyle}
        onPress={resetJourney}
      >
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
