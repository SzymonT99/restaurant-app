import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity, View, Image, ToastAndroid } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class MenuElement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: 0,
            isLiked: false
        }
    }

    getUserId = async () => {
        try {
            const id = await AsyncStorage.getItem('userId');
            if (id !== '') {
                this.setState({ userId: parseInt(id) })
            }
        } catch (error) {
        }
    };

    formatCurrentName = (text) => {
        if (text.length > 22) {
            return text.substr(0, 22) + "...";
        }
        else return text;
    }

    formatCurrentIngritients = (text) => {
        if (text.length > 70) {
            return text.substr(0, 70) + "...";
        }
        else return text;
    }

    addToFavourite = async (userId, menuItemId) => {
        try {
            const data = { userId: userId, menuItemId: menuItemId };
            await fetch(
                `http://192.168.0.152:8080/restaurant/add-to-favourite?userId=${encodeURIComponent(data.userId)}&menuItemId=${encodeURIComponent(data.menuItemId)}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            this.setState({ isLiked: true });
            ToastAndroid.show("Dodano do ulubionych", ToastAndroid.SHORT);
        }
        catch (error) {
            console.error(error);
        }
    }

    removeFromFavourite = async (userId, menuItemId) => {
        try {
            const data = { userId: userId, menuItemId: menuItemId };
            await fetch(
                `http://192.168.0.152:8080/restaurant/remove-from-favourite?userId=${encodeURIComponent(data.userId)}&menuItemId=${encodeURIComponent(data.menuItemId)}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            this.setState({ isLiked: false });
            ToastAndroid.show("Usunięto z ulubionych", ToastAndroid.SHORT);
        }
        catch (error) {
            console.error(error);
        }
    }

    addItemToBasket = async (menuItemId) => {
        try {
            let orderId = await AsyncStorage.getItem('orderId');
            const data = { menuId: menuItemId, orderId: orderId };
            await fetch(
                `http://192.168.0.152:8080/restaurant/add-order-element?menuId=${encodeURIComponent(data.menuId)}&orderId=${encodeURIComponent(data.orderId)}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            ToastAndroid.show("Dodano do koszyka", ToastAndroid.SHORT);
        }
        catch (error) {
            console.error(error);
        }
    }

    componentDidMount() {
        this.getUserId();
        this.setState({
            isLiked: this.props.isLiked
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
                                    (String(this.props.menuItemPrice).slice(-1) !== "0" ? this.props.menuItemPrice + "0" : this.props.menuItemPrice)
                                    + " zł"}</Text>
                                <View style={styles.rateContainer}>
                                    <Icon name="star" color="#ff8c29" size={20} />
                                    <Text style={styles.rateMenuItemText}>{Math.round(this.props.menuItemRate * 10) / 10}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.basketButtonStyle}
                                onPress={() => this.addItemToBasket(this.props.detailsId)}>
                                <Text style={styles.basketButtonText}>Dodaj do koszyka</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.state.isLiked === true
                        ? <Icon style={styles.heartIconStyle} name="heart" color="#f26566" size={24}
                            onPress={() => this.removeFromFavourite(this.state.userId, this.props.detailsId)} />
                        : <Icon style={styles.heartIconStyle} name="heart-outline" color="#000000" size={24}
                            onPress={() => this.addToFavourite(this.state.userId, this.props.detailsId)} />
                    }
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
        marginLeft: 30,
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
        right: -8
    }
});

