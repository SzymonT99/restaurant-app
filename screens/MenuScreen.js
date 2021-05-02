import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";

export class MenuScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation} title="Nazwa kategorii" />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
