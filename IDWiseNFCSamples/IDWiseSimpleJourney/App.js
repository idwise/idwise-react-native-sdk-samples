/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { IDWise } from 'idwise-nfc-react-native-sdk/src/IDWise';
import { IDWiseTheme } from 'idwise-nfc-react-native-sdk/src/IDWiseConstants';
import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const initializeCallback = {
    onError(data) {
      console.log('Event onInitalizeError:', data);
    },
  };

  const journeyCallbacks = {
    onJourneyStarted(journeyStartedInfo) {
      console.log('onJourneyStarted:', journeyStartedInfo);
    },
    onJourneyResumed(journeyResumedInfo) {
      console.log('onJourneyResumed:', journeyResumedInfo);
    },
    onJourneyCompleted(journeyCompletedInfo) {
      console.log('onJourneyCompleted:', journeyCompletedInfo);
    },
    onJourneyCancelled(journeyCancelledInfo) {
      console.log('onJourneyCancelled:', journeyCancelledInfo);
    },
    onError(error) {
      console.log('onError:', error);
    },
  };

  const onPress = () => {
    const theme = IDWiseTheme.SYSTEM_DEFAULT;
    IDWise.initialize(
      "YOUR_CLIENT_KEY",
      theme,
      initializeCallback,
    );

    var applicantDetails = {
      "full_name": "Waqar Khan",
      "sex": "Male"// etc.
    };

    IDWise.startJourney(
      "FLOW_ID",
      'YOUR_REFERENCE_NO',
      'LOCALE',
      applicantDetails,
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
