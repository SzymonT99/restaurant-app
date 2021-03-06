import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, ScrollView, RefreshControl } from "react-native";
import Header from "../components/Header";
import MenuElement from "../components/MenuElement";
import { SearchBar } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export class FavouriteScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            searchedMenuItems: [],
            likedMenuItems: [],
            orderQuantity: 0,
            refreshing: false,
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
                this.setState({ orderQuantity: responseJson })
            } catch (error) {
                console.error(error);
            }
        } else this.props.navigation.navigate("NoInternet");
    }

    getLikedMenuItems = async () => {
        if (this.state.internetConnected) {
            let userId = await AsyncStorage.getItem('userId');
            let token = await AsyncStorage.getItem('token');
            try {
                let response = await fetch(
                    'http://192.168.0.152:8080/restaurant/favourite-menu/user/' + userId, {
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                        'UserId': userId
                    })
                });
                let responseJson = await response.json();
                this.setState({
                    likedMenuItems: responseJson,
                    searchedMenuItems: responseJson
                });
            } catch (error) {
                console.error(error);
            }
        } else this.props.navigation.navigate("NoInternet");
    }

    filtrLikedMenu = (phrase) => {

        const { likedMenuItems } = this.state;

        this.setState({ search: phrase });
        const reg = new RegExp("^" + phrase, "i");

        let menuArray = [];

        for (let item of likedMenuItems) {
            if (reg.test(item.itemName)) {
                menuArray = menuArray.concat(item)
            }
        }
        this.setState({
            searchedMenuItems: menuArray
        })

    }

    generateMenuLiked = () => {
        const { searchedMenuItems } = this.state;

        let menuLayout = searchedMenuItems.map((item, itemIndex) => {
            return <MenuElement
                navigation={this.props.navigation}
                isLiked={true}
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

    wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.wait(1000).then(() => {
            this.setState({ refreshing: false });
            this.getLikedMenuItems();
        });
    }

    componentDidMount() {
        this.checkInternetConnection();
        NetInfo.fetch().then(
            state => {
                if (state.isConnected === true) {
                    this.getOrderQuantity();
            this.getLikedMenuItems();
            this.interval = setInterval(() => this.getOrderQuantity(), 1000);
                } else this.props.navigation.navigate("NoInternet");
            });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation} title="Ulubione" orderQuantity={this.state.orderQuantity} />
                <ImageBackground source={require('../images/table-with-dishes.jpg')} style={styles.imageContainer}>
                    <SearchBar
                        clearIcon={{ color: "#000000" }}
                        searchIcon={{ color: "#000000", size: 26 }}
                        leftIconContainerStyle={{ color: "red" }}
                        containerStyle={styles.searchBarContainerStyle}
                        inputContainerStyle={styles.searchBarInputStyle}
                        inputStyle={{ color: "#000000", marginTop: 3, fontSize: 16 }}
                        placeholder="Wyszukaj"
                        onChangeText={(text) => this.filtrLikedMenu(text)}
                        value={this.state.search}
                    />
                </ImageBackground>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>{"Pozyzje: " + (this.state.likedMenuItems ? this.state.likedMenuItems.length : "0")}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                        showsVerticalScrollIndicator={false}>
                        {this.state.likedMenuItems !== null
                            ? this.generateMenuLiked()
                            : <ActivityIndicator size={100} color="#ff8c29" style={{ marginTop: 100 }} />}
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
    imageContainer: {
        height: 200,
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
        marginTop: 80,
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
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "#f2f2f4",
        marginLeft: 12,
        marginRight: 12,
        marginTop: 10
    },
});
