import React, { Component } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { LoginScreen } from "../screens/LoginScreen";
import { MenuScreen } from "../screens/MenuScreen";
import { BasketScreen } from "../screens/BasketScreen";
import { OrdersHistoryScreen } from "../screens/OrdersHistoryScreen";
import { FavouriteScreen } from "../screens/FavouriteScreen";
import { ReservationScreen } from "../screens/ReservationScreen";
import { AboutRestaurantScreen } from "../screens/AboutRestaurantScreen";
import { UserSettingsScreen } from "../screens/UserSettingsScreen";
import { Button, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
export default class DrawerNavigator extends Component {

  constructor(props) {
    super(props);
  }


  DrawerContent = (props) => {

    const { state } = props
    const { routes, index } = state; //Not sure about the name of index property. Do check it out by logging the 'state' variable.
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
                containerStyle={{ flex: 2, marginTop: 30 }}
              />
              <Text style={styles.userNameText}>User123</Text>
              <Button
                title="Edytuj profil"
                type="clear"
                titleStyle={styles.editProfileText}
                buttonStyle={styles.editProfileBtn}
                onPress={() => { props.navigation.navigate('UserSettings') }} />
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", textAlign: "center"}}>
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
              focused={focusedRoute.name === "Menu" ? true : false}
              onPress={() => { props.navigation.navigate('Menu') }}
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
              onPress={() => { props.navigation.navigate('Login') }}
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
        <Drawer.Screen name='Login' component={LoginScreen} />
        <Drawer.Screen name='Menu' component={MenuScreen} />
        <Drawer.Screen name='Basket' component={BasketScreen} />
        <Drawer.Screen name='OrdersHistory' component={OrdersHistoryScreen} />
        <Drawer.Screen name='Favourite' component={FavouriteScreen} />
        <Drawer.Screen name='Reservation' component={ReservationScreen} />
        <Drawer.Screen name='AboutRestaurant' component={AboutRestaurantScreen} />
        <Drawer.Screen name='UserSettings' component={UserSettingsScreen} />
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
    paddingLeft: 20,
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
    marginLeft: 44
  }
});
