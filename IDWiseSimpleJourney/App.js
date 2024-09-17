/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
//Legacy Integration
import {IDWise} from 'idwise-react-native-sdk/src/IDWise';
import {IDWiseSDKTheme} from 'idwise-react-native-sdk/src/IDWiseConstants';
import React from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

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

  const journeyCallback = {
    onJourneyStarted(data) {
      console.log('Event onJourneyStarted received:', data);
    },
    onJourneyResumed(data) {
      console.log('Event onJourneyResumed received:', data);
    },
    onJourneyFinished(data) {
      console.log('Event onJourneyFinished received:', data);
    },
    onJourneyCancelled(data) {
      console.log('Event onJourneyCancelled received:', data);
    },
    onError(data) {
      console.log('Event onError received:', data);
    },
  };

  const onPress = () => {
    const theme = IDWiseSDKTheme.SYSTEM_DEFAULT;
    IDWise.initialize('<YOUR_CLIENT_KEY>', theme, initializeCallback);

    IDWise.startJourney(
      '<JOURNEY_DEFINITION_ID>',
      '<REFERENCE_NO>',
      '<LOCALE>',
      journeyCallback,
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
