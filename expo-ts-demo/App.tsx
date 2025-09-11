import {IDWise, IDWiseError,InitializeCallback,IDWiseTheme,ApplicantDetailsKeys} from 'idwise-react-native-sdk';
import React, {useEffect} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  
  const isDarkMode = false;
  
    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
  
    const initializeCallback:InitializeCallback = {
      onError(idwiseError:IDWiseError) {
        console.log(
          'Event onInitalizeError:',
          idwiseError.code,
          idwiseError.message,
        );
      },
    };
    useEffect(() => {
      const theme = IDWiseTheme.SYSTEM_DEFAULT;
      IDWise.initialize('<CLIENT_KEYS>', theme, initializeCallback);
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
  
    const handlePress = () => {
  
     const applicantDetails = {
      [ApplicantDetailsKeys.FULL_NAME]: 'John Doe',
      [ApplicantDetailsKeys.ADDRESS]: 'TEST, Address',
      [ApplicantDetailsKeys.SEX]: 'male',
      };

      IDWise.startJourney(
        '<FLOW_ID>',
        '<REFERENCE NO.>',
        '<LOCALE>', //e.g. en
        applicantDetails, //optional
        journeyCallbacks,
      );
    };
  

  return (
    <View style={styles.container}>
      <Button title="Press Me" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
