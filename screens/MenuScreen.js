import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, ScrollView, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import MenuElement from "../components/MenuElement";
import { SearchBar } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export class MenuScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            searchedMenuItems: [],
            menuItems: null,
            userLikedMenuItems: null,
            orderQuantity: 0,
            guest: false,
            internetConnected: true,
        }
    }

    checkInternetConnection = () => NetInfo.addEventListener(state => {
        this.setState({ internetConnected: state.isConnected });
    });

    getOrderQuantity = async () => {
        if (this.state.internetConnected) {
            try {
                let orderId = await AsyncStorage.getItem('orderId');
                let userId = await AsyncStorage.getItem('userId');
                let token = await AsyncStorage.getItem('token');
                let response = await fetch(
                    'http://192.168.0.152:8080/restaurant/order/quantity/' + orderId, {
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                        'UserId': userId
                    }),
                });
                let responseJson = await response.json();
                if (this.interval !== false) {
                    this.setState({ orderQuantity: responseJson })
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            clearInterval(this.interval);
            this.interval = false;
            this.props.navigation.navigate("NoInternet");
        }
    }

    getMenuByCategoryId = async () => {
        if (this.state.internetConnected) {
            const { categoryId } = this.props.route.params;
            let guest = false;
            await AsyncStorage.getItem('guest').then((flag) => {
                if (flag === 'true') {
                    this.setState({ guest: true });
                    guest = true;
                }
            });
            try {
                let response = await fetch(
                    'http://192.168.0.152:8080/restaurant/menu-category/' + categoryId
                );
                let responseJson = await response.json();
                this.setState({
                    menuItems: responseJson,
                    searchedMenuItems: responseJson
                });
                if (guest !== true) {
                    this.getUserLikedMenuItems();
                    this.getOrderQuantity();
                    this.interval = setInterval(() => this.getOrderQuantity(), 1000);
                }
            } catch (error) {
                console.error(error);
            }
        } else {         
            this.props.navigation.navigate("NoInternet");
        }
    }

    getUserLikedMenuItems = async () => {
        if (this.state.internetConnected) {
            let userId = await AsyncStorage.getItem('userId');
            let token = await AsyncStorage.getItem('token');
            userId = parseInt(userId);
            try {
                let response = await fetch(
                    'http://192.168.0.152:8080/restaurant/menu-like/user/' + userId, {
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                        'UserId': userId
                    }),
                });
                let responseJson = await response.json();
                this.setState({
                    userLikedMenuItems: responseJson,
                });
            } catch (error) {
                console.error(error);
            }
        } else this.props.navigation.navigate("NoInternet");
    }

    filtrMenu = (phrase) => {

        const { menuItems } = this.state;

        this.setState({ search: phrase });
        const reg = new RegExp("^" + phrase, "i");

        let menuArray = [];

        for (let item of menuItems) {
            if (reg.test(item.itemName)) {
                menuArray = menuArray.concat(item)
            }
        }
        this.setState({
            searchedMenuItems: menuArray
        })

    }

    componentDidMount() {
        this.checkInternetConnection();
        NetInfo.fetch().then(
            state => {
                if (state.isConnected === true) {
                    this.getMenuByCategoryId();
                } else this.props.navigation.navigate("NoInternet");
            });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.interval = false;
    }

    generateMenuElements = () => {
        const { searchedMenuItems, userLikedMenuItems } = this.state;

        if (userLikedMenuItems !== null) {
            for (const menuItem of searchedMenuItems) {
                menuItem.isLiked = false;
                for (const likedItem of userLikedMenuItems) {
                    if (menuItem.menuId === likedItem.menuId) {
                        menuItem.isLiked = true;
                    }
                }
            }
        }

        let menuLayout = searchedMenuItems.map((item, itemIndex) => {
            return <MenuElement
                navigation={this.props.navigation}
                isLiked={item.isLiked}
                detailsId={item.detailsId}
                menuItemImage={item.menuItemImage}
                menuItemName={item.itemName}
                menuItemIngritients={item.ingredients.join(", ")}
                menuItemPrice={item.price}
                menuItemRate={item.rate}
                key={itemIndex} />
        })
        return menuLayout;
    }

    render() {

        const { categoryName, image } = this.props.route.params;

        return (
            <View style={styles.container}>
                <Header comeBack={true} navigation={this.props.navigation} title={categoryName} orderQuantity={this.state.orderQuantity}
                    noneRight={this.state.guest !== false ? true : false} />
                <ImageBackground source={{ uri: image }} style={styles.imageContainer}>
                    <SearchBar
                        clearIcon={{ color: "#000000" }}
                        searchIcon={{ color: "#000000", size: 26 }}
                        leftIconContainerStyle={{ color: "red" }}
                        containerStyle={styles.searchBarContainerStyle}
                        inputContainerStyle={styles.searchBarInputStyle}
                        inputStyle={{ color: "#000000", marginTop: 3, fontSize: 16 }}
                        placeholder="Wyszukaj"
                        onChangeText={(text) => this.filtrMenu(text)}
                        value={this.state.search}
                    />
                </ImageBackground>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>{"Pozyzje: " + (this.state.menuItems !== null ? this.state.menuItems.length : "0")}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {(this.state.menuItems !== null && this.state.userLikedMenuItems) || (this.state.menuItems !== null && this.state.guest === true)
                            ? this.generateMenuElements()
                            : <ActivityIndicator size={100} color="#ff8c29" style={{ marginTop: 80 }} />}
                    </ScrollView>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "#f2f2f4",
        marginLeft: 12,
        marginRight: 12,
        marginTop: 10
    },
    imageContainer: {
        height: 130,
        width: "100%"
    },
    searchBarInputStyle: {
        height: 40,
        backgroundColor: "#FFFFFF",
        borderColor: "#aaaaaa",
        borderWidth: 1.5,
        borderRadius: 20,
        borderBottomWidth: 1.5,
        alignItems: "center",
    },
    searchBarContainerStyle: {
        backgroundColor: "transparent",
        borderBottomWidth: 0,
        borderTopWidth: 0,
        padding: 0,
        marginTop: 75,
        marginLeft: 12,
        marginRight: 12,
    },
    infoBox: {
        backgroundColor: "#fcdca5",
        height: 35,
        alignItems: "center",
        justifyContent: "center"
    },
    infoText: {
        textAlign: "center",
        fontFamily: "Roboto",
        fontSize: 18,
        fontWeight: "bold"
    }
});
