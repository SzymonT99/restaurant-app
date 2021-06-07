import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, Image } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export class NoInternetScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            internetConnected: true,
        }
    }

    checkInternetConnection = () => NetInfo.addEventListener(state => {
        this.setState({ internetConnected: state.isConnected });
    });

    componentDidMount() {
        this.checkInternetConnection();
        this.interval = setInterval(() => {
            if (this.state.internetConnected) this.props.navigation.navigate("Login")
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.interval = false;
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../images/backgraund-image.jpg')} style={styles.image}>
                    <View style={{ backgroundColor: "rgba(25,20,19,0.8)", flex: 1 }}>
                        <View style={styles.infoBox}>
                            <Text style={styles.textInfo}>Brak połączenia z Internetem!</Text>
                        <Image
                            style={styles.noInternetImage}
                            source={require('../images/no_internet.png')}
                        />
                        </View>
                    </View>
                </ImageBackground>
            </View >
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f4"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
    },
    noInternetImage: {
        marginTop: 8,
        alignSelf: "center",
        width: 240,
        height: 225,
        marginLeft: 18
    },
    infoBox: {
        marginTop: 140,
        backgroundColor: "#ff8c29",
        borderRadius: 40,
        width: "80%",
        height: "60%",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    textInfo: {
        fontSize: 32,
        fontFamily: "Roboto",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 24
    }
});
