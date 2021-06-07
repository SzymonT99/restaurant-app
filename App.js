import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./navigation/DrawerNavigator";
import SplashScreen from 'react-native-splash-screen'
import { LogBox, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class App extends Component {

  handleBackPress = () => {
    BackHandler.exitApp();
  }

  componentDidMount() {
    SplashScreen.hide();
    LogBox.ignoreAllLogs();
    console.warn = () => { }
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    AsyncStorage.setItem('guest', 'false');
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  render() {
    return (
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    );
  }

}



