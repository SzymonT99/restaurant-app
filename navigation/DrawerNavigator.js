import React, { Component } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { LoginScreen } from "../screens/LoginScreen";
import { MenuStackNavigator } from "./MenuStackNavigator";
import { BasketScreen } from "../screens/BasketScreen";
import { OrdersHistoryScreen } from "../screens/OrdersHistoryScreen";
import { FavouriteScreen } from "../screens/FavouriteScreen";
import { ReservationScreen } from "../screens/ReservationScreen";
import { AboutRestaurantScreen } from "../screens/AboutRestaurantScreen";
import { UserSettingsScreen } from "../screens/UserSettingsScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { Button, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";

export default class DrawerNavigator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentLogin: ''
    }
  }

  async saveUserName() {
    let value = await AsyncStorage.getItem('login')
    this.setState({ currentLogin: value });   // TODO: budowa wydajniejszego zapisu
  }

  componentDidMount() {
    this.interval = setInterval(() => this.saveUserName(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  logOut = async (navigation) => {

    try {
      let userId = await AsyncStorage.getItem('userId');
      let token = await AsyncStorage.getItem('token');
      await fetch(
        'http://192.168.0.153:8080/restaurant/user/logout' + userId, {
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'UserId': userId
        }),
      });
    } catch (error) {
      console.error(error);
    }

    AsyncStorage.getItem('rememberUserData').then((value) => {
      if (value === 'false') {
        AsyncStorage.setItem('login', '');
        AsyncStorage.setItem('password', '');
      }
      AsyncStorage.setItem('userId', '');
      AsyncStorage.setItem('orderId', '');
      navigation.navigate("Login")
    });
  }

  reduceUserName = (login) => {
    if (login !== null) {
      if (login.lenght > 10) {
        return login.substring(0, 10) + "...";
      }
      else {
        return login;
      }
    }
  }

  DrawerContent = (props) => {

    const { state } = props
    const { routes, index } = state;
    const focusedRoute = routes[index];

    return (
      <View style={styles.container}>
        <DrawerContentScrollView {...props}>
          <View style={styles.userInfoSection}>
            <View>
              <Avatar
                size="large"
                rounded
                overlayContainerStyle={{ backgroundColor: '#FFFFFF' }}
                icon={{ name: 'user', color: '#000000', type: 'font-awesome' }}
                activeOpacity={0.7}
                containerStyle={{ marginTop: 30 }}
              />
              <Text style={styles.userNameText}>{this.reduceUserName(this.state.currentLogin)}</Text>
              <TouchableOpacity style={styles.editProfileBtn}
                onPress={() => { props.navigation.navigate("UserSettings") }}>
                <Text style={styles.editProfileText}>Edytuj profil</Text>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: "center", paddingRight: 15 }}>
              <Image
                style={styles.logoStyle}
                source={require('../images/logo-white.png')}
              />
            </View>
          </View>
          <View style={styles.boldLine} />
          <View>
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialIcon
                  name="restaurant-menu"
                  color={color}
                  size={size}
                />
              )}
              label="Menu restauracji"
              inactiveTintColor="#FFFFFF"
              activeTintColor="#ff8c29"
              focused={focusedRoute.name === "MenuStack" ? true : false}
              onPress={() => { props.navigation.navigate('MenuStack') }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="cart"
                  color={color}
                  size={22}
                />
              )}
              label="Koszyk"
              inactiveTintColor="#FFFFFF"
              activeTintColor="#ff8c29"
              focused={focusedRoute.name === "Basket" ? true : false}
              onPress={() => { props.navigation.navigate('Basket') }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="clock-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Historia zamówień"
              inactiveTintColor="#FFFFFF"
              activeTintColor="#ff8c29"
              focused={focusedRoute.name === "OrdersHistory" ? true : false}
              onPress={() => { props.navigation.navigate('OrdersHistory') }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="star-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Ulubione"
              inactiveTintColor="#FFFFFF"
              activeTintColor="#ff8c29"
              focused={focusedRoute.name === "Favourite" ? true : false}
              onPress={() => { props.navigation.navigate('Favourite') }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="calendar-month"
                  color={color}
                  size={size}
                />
              )}
              label="Rezerwacja stolika"
              inactiveTintColor="#FFFFFF"
              activeTintColor="#ff8c29"
              focused={focusedRoute.name === "Reservation" ? true : false}
              onPress={() => { props.navigation.navigate('Reservation') }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="information"
                  color={color}
                  size={size}
                />
              )}
              label="O restauracji"
              inactiveTintColor="#FFFFFF"
              activeTintColor="#ff8c29"
              focused={focusedRoute.name === "AboutRestaurant" ? true : false}
              onPress={() => { props.navigation.navigate('AboutRestaurant') }}
            />
          </View>
          <View style={styles.logoutSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="logout"
                  color={color}
                  size={size}
                />
              )}
              label="Wyloguj"
              inactiveTintColor="#FFFFFF"
              activeTintColor="#ff8c29"
              onPress={() => this.logOut(props.navigation)}
            />
          </View>
        </DrawerContentScrollView>
      </View>
    );
  }

  render() {
    const Drawer = createDrawerNavigator();
    return (
      <Drawer.Navigator
        initialRouteName="Login"
        drawerContent={(props) => this.DrawerContent(props)}
      >
        <Drawer.Screen name='Login' component={LoginScreen}
          unmountOnBlur={true} options={{ unmountOnBlur: true, gestureEnabled: false }} />
        <Drawer.Screen name='MenuStack' component={MenuStackNavigator} />
        <Drawer.Screen name='Basket' component={BasketScreen}
          unmountOnBlur={true} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name='OrdersHistory' component={OrdersHistoryScreen}
          unmountOnBlur={true} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name='Favourite' component={FavouriteScreen}
          unmountOnBlur={true} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name='Reservation' component={ReservationScreen}
          unmountOnBlur={true} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name='AboutRestaurant' component={AboutRestaurantScreen}
          unmountOnBlur={true} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name='UserSettings' component={UserSettingsScreen}
          unmountOnBlur={true} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name='Register' component={RegisterScreen}
          unmountOnBlur={true} options={{ unmountOnBlur: true, gestureEnabled: false }} />
      </Drawer.Navigator>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333"
  },
  userInfoSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  userNameText: {
    fontSize: 22,
    color: "#ff8c29",
    fontWeight: "bold",
    marginTop: 5
  },
  boldLine: {
    height: 3,
    backgroundColor: "#aaaaaa",
    marginTop: 15,
    marginBottom: 15,
  },
  editProfileText: {
    paddingLeft: 3,
    fontSize: 12,
    textAlign: "left",
    color: "#FFFFFF"
  },
  editProfileBtn: {
    width: 80,
    padding: 0,
    justifyContent: "flex-start",
  },
  logoutSection: {
    marginTop: 100,
  },
  logoStyle: {
    width: 120,
    height: 120,
  }
});
