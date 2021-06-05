import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MenuElement from "../components/MenuElement";

export class OrdersHistoryScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderQuantity: 0,
            orderHistoryList: [],
            userLikedMenuItems: null,
            currentOrderItems: null,
            selectedOrderId: null,
            currentOrder: null
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

    getUserOrderHistory = async () => {
        let userId = await AsyncStorage.getItem('userId');
        let token = await AsyncStorage.getItem('token');
        try {
            let response = await fetch(
                'http://192.168.0.153:8080/restaurant/orders-history/' + userId, {
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'UserId': userId
                }),
            });
            let orders = await response.json();
            let currentOrder = orders[orders.length - 1];
            this.setState({
                orderHistoryList: orders,
                currentOrder: currentOrder
            });
            if (currentOrder != null || currentOrder !== undefined) {
                let lastId = orders[orders.length - 1].orderId;
                this.getUserOrderById(lastId);  // domyślnie pokazywane jest ostatnie zamówienie
            }
        } catch (error) {
            console.error(error);
        }
    }

    getUserLikedMenuItems = async () => {
        let userId = await AsyncStorage.getItem('userId');
        let token = await AsyncStorage.getItem('token');
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

    getUserOrderById = async (orderId) => {
        let token = await AsyncStorage.getItem('token');
        let userId = await AsyncStorage.getItem('userId');
        try {
            let response = await fetch(
                'http://192.168.0.153:8080/restaurant/order/' + orderId, {
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'UserId': userId
                }),
            });
            let order = await response.json();
            this.setState({
                currentOrderItems: order,
                selectedOrderId: orderId
            });
        } catch (error) {
            console.error(error);
        }
    }

    generateOrdersHistory = () => {
        const { orderHistoryList } = this.state;
        let historyLayout = orderHistoryList.map((order, orderIndex) => {
            let date = new Date(order.date);
            let dateFormat = (String(date.getDate()).length === 1 ? "0" + date.getDate() : date.getDate())
                + "." + (String(date.getMonth()).length === 1 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "." + date.getFullYear();
            return <TouchableOpacity style={styles.orderDate} key={orderIndex}
                onPress={
                    () => {
                        this.getUserOrderById(order.orderId);
                        this.setState({
                            currentOrder: order
                        })
                    }
                }>
                <Text style={[styles.orderText, order.orderId === this.state.selectedOrderId && { color: '#ff8c29' }]}>{dateFormat}</Text>
            </TouchableOpacity>
        })

        return historyLayout;
    }

    generateOrderElements = () => {
        const { currentOrderItems, userLikedMenuItems } = this.state;

        for (const orderItem of currentOrderItems) {
            orderItem.isLiked = false;
            for (const likedItem of userLikedMenuItems) {
                if (orderItem.detailsId === likedItem.menuId) {
                    orderItem.isLiked = true;
                }
            }
        }

        let orderLayout = currentOrderItems.map((item, itemIndex) => {
            return <MenuElement forBasket={true} forHistory={true}
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
        this.getUserOrderHistory();
        this.getOrderQuantity();
        this.getUserLikedMenuItems();
        // this.interval = setInterval(() => {
        //     this.getOrderQuantity();
        //     this.getUserOrderItems();
        // }, 1000);
    }

    componentWillUnmount() {
        //clearInterval(this.interval);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation} title="Historia zamówień" orderQuantity={this.state.orderQuantity} />
                <SafeAreaView>
                    <ScrollView horizontal={true} style={styles.historyBox} showsHorizontalScrollIndicator={false} >
                        {this.state.orderHistoryList.length === 0
                            ? <Text style={styles.textNoOrders}>Nie dokonano jeszcze zamówień.</Text>
                            : this.generateOrdersHistory()
                        }
                    </ScrollView>
                </SafeAreaView>
                <View style={styles.contentContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {this.state.currentOrderItems !== null
                            ? this.generateOrderElements()
                            : null}
                    </ScrollView>
                </View>
                <View style={styles.infoBox}>
                    <Text style={[styles.infoText, { marginLeft: 12 }]}>Stan:  <Text style={styles.orderStateText}>
                        {(this.state.currentOrder !== null && this.state.currentOrder !== undefined) ? "zrealizowano" : "--------------"}
                    </Text></Text>
                    <Text style={[styles.infoText, { marginRight: 12 }]}>
                        {"Koszt: " + (this.state.currentOrder !== null && this.state.currentOrder !== undefined
                            ? (/\.[0-9]{1}$/.test(String(this.state.currentOrder.totalPrice)) ?
                                this.state.currentOrder.totalPrice + "0 zł" : this.state.currentOrder.totalPrice + " zł")
                            : "---")}
                    </Text>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    historyBox: {
        backgroundColor: "#cfcfcf",
        height: 40,
        borderColor: "#aaaaaa",
        borderBottomWidth: 1.5,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "#f2f2f4",
        marginLeft: 12,
        marginRight: 12,
        marginTop: 14
    },
    infoBox: {
        marginTop: 14,
        backgroundColor: "#fcdca5",
        height: 50,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row"
    },
    infoText: {
        fontFamily: "Roboto",
        fontSize: 18,
        fontWeight: "bold"
    },
    orderStateText: {
        fontFamily: "Roboto",
        fontSize: 18,
        fontWeight: "bold",
        color: "#ff8c29"
    },
    orderDate: {
        backgroundColor: "#cfcfcf",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: "#454545",
        borderRightWidth: 1,
        borderStyle: "dotted",
        borderRadius: 1
    },
    orderText: {
        fontFamily: "Roboto",
        fontSize: 16,
        color: "black"
    },
    textNoOrders: {
        marginLeft: 80,
        fontFamily: "Roboto",
        fontSize: 16,
        fontWeight: "bold",
        alignSelf: "center",
        justifyContent: "center",
        textAlign: "center"
    }
});
