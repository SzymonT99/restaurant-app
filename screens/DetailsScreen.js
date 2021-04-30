import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";


export class DetailsScreen extends Component {

    constructor(props) {
        super(props);
       
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Szczegóły</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f2f2f4",
        flex: 1,
        justifyContent: "center", 
        alignItems: "center"
    }
});
