import {Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {IDWise,IDWiseError,IDWiseTheme} from 'idwise-react-native-sdk';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import React, {useEffect} from 'react';

export default function App() {
 const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const initializeCallback = {
    onError(idwiseError: IDWiseError) {
      console.log(
        'Event onInitalizeError:',
        idwiseError.code,
        idwiseError.message,
      );
    },
  };

  useEffect(() => {
    const theme = IDWiseTheme.SYSTEM_DEFAULT;
    IDWise.initialize('QmFzaWMgWkRJME1qVm1ZelV0WlRZeU1TMDBZV0kxTFdGak5EVXRObVZqT1RGaU9XSXpZakl6T25OMVRFOWliWEZUU1RscE56VjJkRkpHVjBod1lXcGFWVFJDVFU1S01XVjVTemhRYm10SE5GUT0=', theme, initializeCallback);
  });
  const journeyCallbacks = {
    onJourneyStarted(journeyStartedInfo:JSON) {
      console.log('Event onJourneyStarted received:', journeyStartedInfo);
    },
    onJourneyResumed(journeyResumedInfo:JSON) {
      console.log('Event onJourneyResumed received:', journeyResumedInfo);
    },
    onJourneyCompleted(journeyCompletedInfo:JSON) {
      console.log('Event onJourneyCompleted received:', journeyCompletedInfo);
    },
    onJourneyCancelled(journeyCancelledInfo:JSON) {
      console.log('Event onJourneyCancelled received:', journeyCancelledInfo);
    },
    onJourneyBlocked(journeyBlockedInfo:JSON) {
      console.log('Event onJourneyBlocked received:', journeyBlockedInfo);
    },
    onError(idwiseError:IDWiseError) {
      console.log(
        'Event onError received:',
        idwiseError.code,
        idwiseError.message,
      );
    },
  };

  const onPress = () => {
    IDWise.startJourney(
      'd2425fc5-e621-4ab5-ac45-6ec91b9b3b23',
      'rn-test',
      'en',
      undefined, 
      //optional
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
          color="#841584"
          onPress={() => {
            onPress();
          }}
        />
      </View>
    </SafeAreaView>
  );
}


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
