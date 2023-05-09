import React from 'react';
import {Image, View} from 'react-native';
import {StyleSheet} from 'react-native';
import {Modal, Text} from 'react-native';
import {Button} from 'react-native-paper';

const AppModal = ({modalVisible, heading, imageSrc, buttonCallback}) => {
  return (
    <Modal transparent={true} visible={modalVisible}>
      <View style={styles.modalView}>
        <View style={styles.modalContainer}>
          {heading && (
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>{heading}</Text>
            </View>
          )}
          <Image style={styles.imageStyle} source={{uri: imageSrc}} />

          <Button
            mode="contained"
            buttonColor="#2A4CD0"
            style={styles.buttonStyle}
            contentStyle={styles.buttonContentStyle}
            labelStyle={styles.buttonLabelStyle}
            onPress={buttonCallback}>
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    borderRadius: 10,
    width: '90%',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    paddingBottom: 15,
  },
  imageStyle: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#2A4CD0',
  },
  buttonStyle: {
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  buttonContentStyle: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    justifyContent: 'center',
  },
  buttonLabelStyle: {
    fontSize: 16,
  },
});
