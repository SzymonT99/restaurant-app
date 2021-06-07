import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity, View, Image, ToastAndroid } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export default class MenuElement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLiked: false,
            guest: false,
            internetConnected: true,
        }
    }

    checkInternetConnection = () => NetInfo.addEventListener(state => {
        this.setState({ internetConnected: state.isConnected });
      });

    formatCurrentName = (text) => {
        if (text.length > 20) {
            return text.substr(0, 20) + "...";
        }
        else return text;
    }

    formatCurrentIngritients = (text) => {
        if (text.length > 70) {
            return text.substr(0, 70) + "...";
        }
        else return text;
    }

    addToFavourite = async (menuItemId) => {
        if (this.state.internetConnected) {
            try {
                let userId = await AsyncStorage.getItem('userId');
                const data = { userId: userId, menuItemId: menuItemId };
                let token = await AsyncStorage.getItem('token');
                await fetch(
                    `http://192.168.0.152:8080/restaurant/add-to-favourite?userId=${encodeURIComponent(data.userId)}&menuItemId=${encodeURIComponent(data.menuItemId)}`, {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                        'UserId': userId
                    })
                });
                this.setState({ isLiked: true });
                ToastAndroid.show("Dodano do ulubionych", ToastAndroid.SHORT);
            }
            catch (error) {
                console.error(error);
            }
        } else this.props.navigation.navigate("NoInternet");
    }


    removeFromFavourite = async (menuItemId) => {
        if (this.state.internetConnected) {
            try {
                let userId = await AsyncStorage.getItem('userId');
                const data = { userId: userId, menuItemId: menuItemId };
                let token = await AsyncStorage.getItem('token');
                await fetch(
                    `http://192.168.0.152:8080/restaurant/remove-from-favourite?userId=${encodeURIComponent(data.userId)}&menuItemId=${encodeURIComponent(data.menuItemId)}`, {
                    method: 'DELETE',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                        'UserId': userId
                    })
                });
                this.setState({ isLiked: false });
                ToastAndroid.show("Usunięto z ulubionych", ToastAndroid.SHORT);
            }
            catch (error) {
                console.error(error);
            }
        } else this.props.navigation.navigate("NoInternet");
    }

    addItemToBasket = async (menuItemId) => {
        if (this.state.internetConnected) {
            try {
                let orderId = await AsyncStorage.getItem('orderId');
                const data = { menuId: menuItemId, orderId: orderId };
                let token = await AsyncStorage.getItem('token');
                let userId = await AsyncStorage.getItem('userId');
                await fetch(
                    `http://192.168.0.152:8080/restaurant/add-order-element?menuId=${encodeURIComponent(data.menuId)}&orderId=${encodeURIComponent(data.orderId)}`, {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                        'UserId': userId
                    })
                });
                ToastAndroid.show("Dodano do koszyka", ToastAndroid.SHORT);
            }
            catch (error) {
                console.error(error);
            }
        } else this.props.navigation.navigate("NoInternet");
    }

    removeItemFromBasket = async (menuItemId) => {
        if (this.state.internetConnected) {
            try {
                let orderId = await AsyncStorage.getItem('orderId');
                const data = { menuId: menuItemId, orderId: orderId };
                let token = await AsyncStorage.getItem('token');
                let userId = await AsyncStorage.getItem('userId');
                await fetch(
                    `http://192.168.0.152:8080/restaurant/delete-order-element?menuId=${encodeURIComponent(data.menuId)}&orderId=${encodeURIComponent(data.orderId)}`, {
                    method: 'DELETE',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                        'UserId': userId
                    })
                });
                ToastAndroid.show("Usunięto z koszyka", ToastAndroid.SHORT);
            }
            catch (error) {
                console.error(error);
            }
        } else this.props.navigation.navigate("NoInternet");
    }

    async componentDidMount() {
        this.checkInternetConnection();
        this.setState({
            isLiked: this.props.isLiked
        })
        await AsyncStorage.getItem('guest').then((flag) => {
            if (flag === 'true') {
                this.setState({ guest: true })
                guest = true;
            }
        })
    }

    render() {
        return (
            <TouchableOpacity style={styles.container}
                onPress={() => this.props.navigation.navigate("Details", { detailsId: this.props.detailsId })}>
                <View style={{ flexDirection: "row" }}>
                    <Image
                        style={styles.imageStyle}
                        source={{ uri: this.props.menuItemImage }}
                    />
                    <View style={styles.menuItemContainer}>
                        <Text style={styles.menuItemNameStyle}>{this.formatCurrentName(this.props.menuItemName)}</Text>
                        <Text style={styles.menuItemIngritientsStyle}>{this.formatCurrentIngritients(this.props.menuItemIngritients)}</Text>
                        <View style={{ flexDirection: "row" }}>
                            <View>
                                <Text style={styles.menuItemPriceText}>{"Cena: " +
                                    (/\.[0-9]{1}$/.test(String(this.props.menuItemPrice)) ? this.props.menuItemPrice + "0" : this.props.menuItemPrice)
                                    + " zł"}</Text>
                                <View style={styles.rateContainer}>
                                    <Icon name="star" color="#ff8c29" size={20} />
                                    <Text style={styles.rateMenuItemText}>{Math.round(this.props.menuItemRate * 10) / 10}</Text>
                                </View>
                            </View>
                            {this.props.forBasket !== true
                                ?
                                (this.state.guest !== true ?
                                    <TouchableOpacity style={styles.basketButtonStyle}
                                        onPress={() => this.addItemToBasket(this.props.detailsId)}>
                                        <Text style={styles.basketButtonText}>Dodaj do koszyka</Text>
                                    </TouchableOpacity> : <View />)
                                :
                                <View style={styles.orderBox}>
                                    {this.props.forHistory !== true
                                        ?
                                        <View style={{ flexDirection: "row" }}>
                                            <TouchableOpacity
                                                onPress={() => this.addItemToBasket(this.props.detailsId)}>
                                                <MaterialIcon name="add-circle-outline" color="#ff8c29" size={28} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => this.removeItemFromBasket(this.props.detailsId)}>
                                                <MaterialIcon name="remove-circle-outline" color="#ff8c29" size={28} />
                                            </TouchableOpacity>
                                        </View>
                                        : <View />
                                    }
                                    <View style={styles.orderQuantityContainer}>
                                        <Text style={styles.basketButtonText}>{"Sztuk: " + this.props.orderItemQuantity} </Text>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                    {this.state.guest !== true ?
                        <View>
                            {this.state.isLiked === true
                                ? <Icon style={styles.heartIconStyle} name="heart" color="#f26566" size={24}
                                    onPress={() => this.removeFromFavourite(this.props.detailsId)} />
                                : <Icon style={styles.heartIconStyle} name="heart-outline" color="#000000" size={24}
                                    onPress={() => this.addToFavourite(this.props.detailsId)} />
                            }
                        </View>
                        : <View />}
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 10,
        paddingLeft: 12,
        paddingRight: 12,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.12,
        shadowRadius: 66.11,
        elevation: 4,
    },
    imageStyle: {
        height: 86,
        width: 86,
        alignSelf: "center"
    },
    menuItemContainer: {
        marginLeft: 15,
    },
    menuItemNameStyle: {
        fontSize: 17,
        fontFamily: "Roboto",
        fontWeight: "bold"
    },
    menuItemIngritientsStyle: {
        height: 30,
        width: 230,
        fontSize: 11,
        fontFamily: "Roboto",
    },
    menuItemPriceText: {
        fontSize: 14,
        fontFamily: "Roboto",
    },
    basketButtonStyle: {
        position: 'absolute',
        bottom: 6,
        right: -2,
        width: 114,
        height: 24,
        backgroundColor: "#ff8c29",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    basketButtonText: {
        fontSize: 11,
        fontWeight: "bold",
        fontFamily: "Roboto",
        textAlign: "center",
        color: "#FFFFFF"
    },
    rateContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rateMenuItemText: {
        marginLeft: 4,
        fontFamily: "Roboto",
        fontSize: 13,
    },
    heartIconStyle: {
        position: 'absolute',
        top: -1,
        right: -20
    },
    orderBox: {
        flexDirection: "row",
        position: 'absolute',
        bottom: 6,
        right: -2,
    },
    orderQuantityContainer: {
        width: 64,
        height: 28,
        backgroundColor: "#ff8c29",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 4
    }
});

