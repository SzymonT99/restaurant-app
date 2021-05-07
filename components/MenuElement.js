import React from "react";
import { Text, StyleSheet, TouchableOpacity, View, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MenuElement = (props) => {

    formatCurrentName = (text) => {
        if (text.length > 22) {
            return text.substr(0, 22) + "...";
        }
        else return text;
    }

    formatCurrentIngritients = (text) => {
        if (text.length > 70) {
            return text.substr(0, 70) + "...";
        }
        else return text;
    }

    return (
        <TouchableOpacity style={styles.container}
            onPress={() => props.navigation.navigate("Details", { detailsId: props.detailsId })}>
            <View style={{ flexDirection: "row" }}>
                <Image
                    style={styles.imageStyle}
                    source={{ uri: props.menuItemImage }}
                />
                <View style={styles.menuItemContainer}>
                    <Text style={styles.menuItemNameStyle}>{formatCurrentName(props.menuItemName)}</Text>
                    <Text style={styles.menuItemIngritientsStyle}>{formatCurrentIngritients(props.menuItemIngritients)}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <View>
                            <Text style={styles.menuItemPriceText}>{"Cena: " + props.menuItemPrice + " zł"}</Text>
                            <View style={styles.rateContainer}>
                                <Icon name="star" color="#ff8c29" size={20} />
                                <Text style={styles.rateMenuItemText}>{props.menuItemRate}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.basketButtonStyle}
                            onPress={() => props.navigation.navigate("Basket")}>
                            <Text style={styles.basketButtonText}>Dodaj do koszyka</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Icon style={styles.heartIconStyle} name="heart" color="#f26566" size={24} onPress={() => alert("sth")} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 10,
        paddingLeft: 12,
        paddingRight: 12,
        justifyContent: "center",
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
        height: 86,
        width: 86,
        alignSelf: "center"
    },
    menuItemContainer: {
        marginLeft: 15,
    },
    menuItemNameStyle: {
        fontSize: 17,
        fontFamily: "Roboto",
        fontWeight: "bold"
    },
    menuItemIngritientsStyle: {
        height: 30,
        width: 230,
        fontSize: 11,
        fontFamily: "Roboto",
    },
    menuItemPriceText: {
        fontSize: 14,
        fontFamily: "Roboto",
    },
    basketButtonStyle: {
        marginLeft: 30,
        width: 114,
        height: 24,
        backgroundColor: "#ff8c29",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    basketButtonText: {
        fontSize: 11,
        fontWeight: "bold",
        fontFamily: "Roboto",
        textAlign: "center",
        color: "#FFFFFF"
    },
    rateContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rateMenuItemText: {
        marginLeft: 4,
        fontFamily: "Roboto",
        fontSize: 13,
    },
    heartIconStyle: {
        position: 'absolute',
        top: -1,
        right: -8
    }
});

export default MenuElement;
