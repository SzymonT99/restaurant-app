import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Badge } from 'react-native-elements'

export default function Header({ orderQuantity, comeBack, title, navigation }) {

    //let comeBack = (pcomeBack === undefined) ? false : true;

    return (
        <View style={styles.header}>
            <View style={styles.leftComponent}>
                {comeBack == true
                    ? <MaterialIcons name='arrow-back' size={32} onPress={() => navigation.goBack()} />
                    : <Icon name='menu' size={32} onPress={() => navigation.openDrawer()} />}
            </View>
            <View>
                <Text style={styles.headerText}>{title}</Text>
            </View>
            <View style={styles.rightComponent}>
                <View>
                    <Icon name='cart' size={30} onPress={() => navigation.navigate("Basket")} />
                    <Badge
                        textStyle={styles.badgeTextStyle}
                        badgeStyle={styles.badgeStyle}
                        value={orderQuantity}
                        containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        borderColor: "#aaaaaa",
        borderBottomWidth: 1.5,
        backgroundColor: "#FFFFFF"
    },
    leftComponent: {
        paddingLeft: 15,
    },
    rightComponent: {
        paddingRight: 15,
    },
    headerText: {
        textAlign: "center",
        fontFamily: "Roboto",
        fontSize: 26,
    },
    badgeStyle: {
        backgroundColor: "#dddddd",
    },
    badgeTextStyle: {
        color: "#000000",
        fontWeight: "bold"
    }
});