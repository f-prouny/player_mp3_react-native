/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Player from './components/Player';

const App = () => {
  return (
    <SafeAreaView>
      <StatusBar/>
        <Player style={styles.appStyle}/>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  appStyle:{
      height:'100%',
      backgroundColor:'black',
  }

})


export default App;
