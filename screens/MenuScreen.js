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
            currentUserId: 0,
            menuItems: null,
            userLikedMenuItems: null
        }
    }

    getUserId = async () => {
        try {
            let id = await AsyncStorage.getItem('userId');
            id = parseInt(id);
            if (id !== 0) {
                this.setState({ currentUserId: id })
            }
            this.getUserLikedMenuItems();
        } catch (error) {
            console.error(error);
        }
    };

    getMenuByCategoryId = async () => {
        const { categoryId } = this.props.route.params;
        try {
            let response = await fetch(
                'http://192.168.0.152:8080/restaurant/menu-category/' + categoryId
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
        const { currentUserId } = this.state;
        try {
            let response = await fetch(
                'http://192.168.0.152:8080/restaurant/menu-like/user/' + currentUserId
            );
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
        this.getUserId();
    }

    generateMenuElements = () => {
        const { searchedMenuItems, userLikedMenuItems } = this.state;

        let completeMenuList = [];

        for (const menuItem of searchedMenuItems) {
            menuItem.isLiked = false;
            for (const likedItem of userLikedMenuItems) {
                if (menuItem.menuId === likedItem.menuId) {
                    menuItem.isLiked = true;
                }
            }
            completeMenuList.push(menuItem);
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
                <Header comeBack={true} navigation={this.props.navigation} title={categoryName} />
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
                    <Text style={styles.infoText}>{this.state.menuItems !== null
                        ? (this.state.menuItems.length > 10 || this.state.menuItems.length === 0
                            ? this.state.menuItems.length + " pozycji"
                            : this.state.menuItems.length + " pozycje")
                        : ""} </Text>
                </View>
                <View style={styles.contentContainer}>
                    <ScrollView>
                        {this.state.menuItems !== null && this.state.userLikedMenuItems !== null
                            ? this.generateMenuElements()
                            : <ActivityIndicator size="large" />}
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
