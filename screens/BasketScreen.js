import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MenuElement from "../components/MenuElement";

export class BasketScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderQuantity: 0,
            currentUserId: 0,
            userLikedMenuItems: null,
            orderItems: null,
            fullPrice: 0.0
        }
    }

    getOrderQuantity = async () => {
        try {
            let orderId = await AsyncStorage.getItem('orderId');
            let response = await fetch(
                'http://192.168.0.152:8080/restaurant/order/quantity/' + orderId
            );
            let responseJson = await response.json();
            this.setState({ orderQuantity: responseJson })
        } catch (error) {
            console.error(error);
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

    getUserOrderItems = async () => {
        let orderId = await AsyncStorage.getItem('orderId');
        try {
            let response = await fetch(
                'http://192.168.0.152:8080/restaurant/order/' + orderId
            );
            let responseJson = await response.json();
            this.setState({
                orderItems: responseJson,
            });
            this.sumAllOrderItemPrice(responseJson);
        } catch (error) {
            console.error(error);
        }
    }

    sumAllOrderItemPrice = (orderItems) => {

        let sumOfPrice = 0.0;
        for (const orderItem of orderItems) {
            sumOfPrice += orderItem.price;
        }
        sumOfPrice = Math.round(sumOfPrice * 100) / 100;

        this.setState({fullPrice: sumOfPrice})
    }

    generateOrderElements = () => {
        const { orderItems, userLikedMenuItems } = this.state;

        for (const orderItem of orderItems) {
            orderItem.isLiked = false;
            for (const likedItem of userLikedMenuItems) {
                if (orderItem.detailsId === likedItem.menuId) {
                    orderItem.isLiked = true;
                }
            }
        }

        let orderLayout = orderItems.map((item, itemIndex) => {
            return <MenuElement forBasket={true}
                navigation={this.props.navigation}
                isLiked={item.isLiked}
                detailsId={item.detailsId}
                menuItemImage={item.menuItemImage}
                menuItemName={item.itemName}
                menuItemIngritients={item.ingredients.join(", ")}
                menuItemPrice={Math.round(item.price / item.quantity * 100) / 100}
                menuItemRate={item.rate}
                orderItemQuantity={item.quantity}
                key={itemIndex} />
        })
        return orderLayout;
    }

    componentDidMount() {
        this.getUserOrderItems();
        this.getOrderQuantity();
        this.getUserId();
        this.interval = setInterval(() => {
            this.getOrderQuantity();
            this.getUserOrderItems();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation} title="Koszyk" orderQuantity={this.state.orderQuantity} />
                <View style={styles.infoBox}>
                    <Text style={[styles.infoText, { marginLeft: 10 }]}>{"Dodanych pozycji: " + this.state.orderQuantity}</Text>
                    <Text style={[styles.infoText, { marginRight: 10 }]}>{"Koszt: " + 
                    (String(this.state.fullPrice).slice(-1) !== "0" ? this.state.fullPrice  + "0" : this.state.fullPrice)
                    + " zł"}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <ScrollView>
                        {this.state.orderItems !== null && this.state.userLikedMenuItems !== null
                            ? this.generateOrderElements()
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
    infoBox: {
        backgroundColor: "#fcdca5",
        height: 40,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row"
    },
    infoText: {
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
