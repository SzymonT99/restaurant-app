import React, { Component } from "react";
import { View, Text } from "react-native";


export class OrderScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ justifyContent: "center", alignItems: "center" }}>Zamówienie</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f2f2f4",
        flex: 1,
    }
});
