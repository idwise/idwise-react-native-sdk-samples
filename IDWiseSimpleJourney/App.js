/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import type { Node } from 'react';
import { Platform } from 'react-native';
import { NativeEventEmitter, NativeModules, Button, View, Text, Image } from 'react-native';
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';


const App: () => Node = () => {

  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const { IDWiseModule } = NativeModules;

  useEffect(() => {

    const eventEmitter = new NativeEventEmitter(IDWiseModule);

    eventEmitter.addListener('onError', (event) => {
      console.log(`An Error has occured  ${event.errorCode} : ${event.message}`);
    });

    eventEmitter.addListener('onJourneyStarted', (event) => {
      console.log(`Journey Started with id ${event.journeyId}`);
    });

    eventEmitter.addListener('onJourneyResumed', (event) => {
      console.log(`Journey resumed with id ${event.journeyId}`);
    });

    eventEmitter.addListener('onJourneyFinished', (event) => {
      console.log(`Journey Completed with id ${event.journeyId}`);
    });

    eventEmitter.addListener('onJourneyCancelled', (event) => {
      console.log(`Journey Cancelled with id ${event.journeyId}`);
    });


  })


  const onPress = () => {

    //you can pre-load this on componentDidMount() if you want to

    const theme = "SYSTEM_DEFAULT"; // [ LIGHT, DARK, SYSTEM_DEFAULT ]
    IDWiseModule.initialize("<YOUR_CLIENT_KEY>", theme);

    IDWiseModule.startJourney("<JOURNEY_DEFINITION_ID>", "<REFERENCE_NO>", "<LOCALE>");

  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.loginButtonSection}>



        <Text style={styles.heading}>
          IDWise: Trust but Verify
        </Text>

        <Text style={styles.body}>
          IDWise sample app for React-Native
        </Text>

        <Button
          title="Click to start Verification!"
          style={styles.loginButton}
          color="#841584"
          onPress={
            () => {
              onPress()
            }
          }
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
    fontWeight: 'bold'
  },
  body: {
    color: '#000',
    marginBottom: 40,
    fontSize: 12
  },
  loginButtonSection: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
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
