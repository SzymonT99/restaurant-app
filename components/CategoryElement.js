import React from "react";
import { Text, StyleSheet, TouchableOpacity, ImageBackground, View } from "react-native";

const CategoryElement = (props) => {

    return (
        <TouchableOpacity style={styles.categoryContainer}
            onPress={() => props.navigation.navigate("Menu")}>
            <ImageBackground source={props.categoryImage} style={styles.image} borderRadius={12}>
                <View style={styles.categoryBackground}>
                    <Text style={styles.categoryText}>{props.categoryName}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    categoryContainer: {
        height: 100,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.12,
        shadowRadius: 66.11,
        elevation: 4,
    },
    image: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    categoryBackground: {
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        width: 200,
        height: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    categoryText: {
        fontFamily: "Roboto",
        fontWeight: '600',
        fontSize: 24,
        color: "#FFFFFF"
    }
});

export default CategoryElement;
