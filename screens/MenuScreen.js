import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, ScrollView, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import MenuElement from "../components/MenuElement";
import { SearchBar } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";

export class MenuScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            searchedMenuItems: [],
            menuItems: null,
            userLikedMenuItems: null,
            orderQuantity: 0
        }
    }

    getOrderQuantity = async () => {
        try {
            let orderId = await AsyncStorage.getItem('orderId');
            let userId = await AsyncStorage.getItem('userId');
            let token = await AsyncStorage.getItem('token');
            let response = await fetch(
                'http://192.168.0.153:8080/restaurant/order/quantity/' + orderId, {
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'UserId': userId
                }),
            });
            let responseJson = await response.json();
            this.setState({ orderQuantity: responseJson })
        } catch (error) {
            console.error(error);
        }
    }

    getMenuByCategoryId = async () => {
        const { categoryId } = this.props.route.params;
        try {
            let response = await fetch(
                'http://192.168.0.153:8080/restaurant/menu-category/' + categoryId
            );
            let responseJson = await response.json();
            this.setState({
                menuItems: responseJson,
                searchedMenuItems: responseJson
            });
        } catch (error) {
            console.error(error);
        }
    }

    getUserLikedMenuItems = async () => {
        let userId = await AsyncStorage.getItem('userId');
        let token = await AsyncStorage.getItem('token');
        userId = parseInt(userId);
        try {
            let response = await fetch(
                'http://192.168.0.153:8080/restaurant/menu-like/user/' + userId, {
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
        this.getMenuByCategoryId();
        this.getUserLikedMenuItems();
        this.getOrderQuantity();
        this.interval = setInterval(() => this.getOrderQuantity(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    generateMenuElements = () => {
        const { searchedMenuItems, userLikedMenuItems } = this.state;

        for (const menuItem of searchedMenuItems) {
            menuItem.isLiked = false;
            for (const likedItem of userLikedMenuItems) {
                if (menuItem.menuId === likedItem.menuId) {
                    menuItem.isLiked = true;
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
                <Header comeBack={true} navigation={this.props.navigation} title={categoryName} orderQuantity={this.state.orderQuantity} />
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
                    <ScrollView>
                        {this.state.menuItems !== null && this.state.userLikedMenuItems !== null
                            ? this.generateMenuElements()
                            : <ActivityIndicator size={100} color="#ff8c29" style={{marginTop: 80}}/>}
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
