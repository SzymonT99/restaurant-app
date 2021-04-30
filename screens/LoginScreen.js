import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";


export class LoginScreen extends Component {

    constructor(props) {
        super(props);
    
    }

    static navigationOptions = {
        drawerLabel: () => null
   }

    render() {
        return (
            <View style={styles.container}>
                <Text>Logowanie</Text>
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
