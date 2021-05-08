import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class OrderScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderQuantity: 0
        } 
    }

    getOrderQuantity = async () => {
        try {
            let orderId = await AsyncStorage.getItem('orderId');
            let response = await fetch(
                'http://192.168.0.152:8080/restaurant/order/quantity/' + orderId
            );
            let responseJson = await response.json();
            this.setState({orderQuantity: responseJson})
        } catch (error) {
            console.error(error);
        }
    }

    componentDidMount() {
		this.getOrderQuantity();
	}

    render() {
        return (
            <View style={styles.container}>
                 <Header navigation={this.props.navigation} title="Zamówienie" orderQuantity={this.state.orderQuantity}/>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
