import React from "react";
import { Text, StyleSheet, TouchableOpacity, Image, View } from "react-native";

const SpecialOfferElement = (props) => {

    return (
        <TouchableOpacity style={styles.offerContainer}
            onPress={() => props.navigation.navigate("Details")}>
            <Image
                style={styles.imageStyle}
                source={{uri: props.image}}
            />
            <View style={styles.descriptionContainer}>
                <Text style={styles.menuOfferName}>{props.name}</Text>
                <Text style={styles.priceText}>{props.price + " zł"}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    offerContainer: {
        backgroundColor: "#FFFFFF",
        height: 180,
        width: 130,
        borderRadius: 12,
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.12,
        shadowRadius: 66.11,
        elevation: 4,
    },
    imageStyle: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        width: "100%",
        height: "73%",
    },
    descriptionContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: "27%"
    },
    menuOfferName: {
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: 12,
        textAlign: "center"
    },
    priceText: {
        fontFamily: "Roboto",
        fontSize: 10,
        textAlign: "center"
    }

});

export default SpecialOfferElement;
