import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";

export class ReservationScreen extends Component {

    constructor(props) {
        super(props);
      
    }

    render() {
        return (
            <View style={styles.container}>
                 <Header navigation={this.props.navigation} title="Rezerwacja stolika" />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
