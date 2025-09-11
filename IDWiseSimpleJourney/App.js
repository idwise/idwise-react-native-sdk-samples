/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import ApplicantDetailsKeys from 'idwise-react-native-sdk/src/ApplicantDetailsKeys';
import {IDWise} from 'idwise-react-native-sdk/src/IDWise';
import {IDWiseTheme} from 'idwise-react-native-sdk/src/IDWiseConstants';
import React, {useEffect} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
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
  useEffect(() => {
    const theme = IDWiseTheme.SYSTEM_DEFAULT;
    IDWise.initialize('CLIENT-KEY', theme, initializeCallback);
  });
  const journeyCallbacks = {
    onJourneyStarted(journeyStartedInfo) {
      console.log('Event onJourneyStarted received:', journeyStartedInfo);
    },
    onJourneyResumed(journeyResumedInfo) {
      console.log('Event onJourneyResumed received:', journeyResumedInfo);
    },
    onJourneyCompleted(journeyCompletedInfo) {
      console.log('Event onJourneyCompleted received:', journeyCompletedInfo);
    },
    onJourneyCancelled(journeyCancelledInfo) {
      console.log('Event onJourneyCancelled received:', journeyCancelledInfo);
    },
    onJourneyBlocked(journeyBlockedInfo) {
      console.log('Event onJourneyBlocked received:', journeyBlockedInfo);
    },
    onError(idwiseError) {
      console.log(
        'Event onError received:',
        idwiseError.code,
        idwiseError.message,
      );
    },
  };

  const onPress = () => {
    const applicantDetails = {};
    applicantDetails[ApplicantDetailsKeys.FULL_NAME] = 'user full name';
    applicantDetails[ApplicantDetailsKeys.SEX] = 'male';

    console.log(typeof applicantDetails);

    IDWise.startJourney(
      'YOUR-FLOW-ID',
      '<REFERENCE_NO>',
      '<LOCALE>',
      applicantDetails, //optional
      journeyCallbacks,
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.loginButtonSection}>
        <Text style={styles.heading}>IDWise: Trust but Verify</Text>

        <Text style={styles.body}>IDWise sample app for React-Native</Text>

        <Button
          title="Click to start Verification!"
          style={styles.loginButton}
          color="#841584"
          onPress={() => {
            onPress();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: '#000',
    marginBottom: 40,
    fontSize: 30,
    fontWeight: 'bold',
  },
  body: {
    color: '#000',
    marginBottom: 40,
    fontSize: 12,
  },
  loginButtonSection: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
