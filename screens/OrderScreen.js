import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";

export class OrderScreen extends Component {

    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <View style={styles.container}>
                 <Header navigation={this.props.navigation} title="Zamówienie" />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
