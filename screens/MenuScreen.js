import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, ScrollView } from "react-native";
import Header from "../components/Header";
import MenuElement from "../components/MenuElement";
import { SearchBar } from 'react-native-elements';

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
                <ImageBackground source={require('../images/danie_glowne.jpg')} style={styles.imageContainer}>
                    <SearchBar
                        clearIcon={{ color: "#000000" }}
                        searchIcon={{ color: "#000000", size: 26 }}
                        leftIconContainerStyle={{ color: "red" }}
                        containerStyle={styles.searchBarContainerStyle}
                        inputContainerStyle={styles.searchBarInputStyle}
                        inputStyle={{ color: "#000000", marginTop: 3, fontSize: 16 }}
                        placeholder="Wyszukaj"
                        onChangeText={(text) => this.setState({ search: text })}
                        value={this.state.search}
                    />
                </ImageBackground>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>27 pozycji</Text>
                </View>
                <View style={styles.contentContainer}>
                    <ScrollView>
                        <MenuElement navigation={this.props.navigation}
                            menuItemImage={require('../images/tajskie-pulpeciki-drobiowe.jpg')}
                            menuItemName="Kurczak z pieczarkami"
                            menuItemIngritients="filet z kurczaka, pieczarki, cebula, koperek, papryka"
                            menuItemPrice={27.99}
                            menuItemRate={4.8}
                        />
                        <MenuElement navigation={this.props.navigation}
                            menuItemImage={require('../images/tajskie-pulpeciki-drobiowe.jpg')}
                            menuItemName="Kurczak z pieczarkami"
                            menuItemIngritients="filet z kurczaka, pieczarki, cebula, koperek, papryka"
                            menuItemPrice={27.99}
                            menuItemRate={4.8}
                        />
                        <MenuElement navigation={this.props.navigation}
                            menuItemImage={require('../images/tajskie-pulpeciki-drobiowe.jpg')}
                            menuItemName="Kurczak z pieczarkami"
                            menuItemIngritients="filet z kurczaka, pieczarki, cebula, koperek, papryka"
                            menuItemPrice={27.99}
                            menuItemRate={4.8}
                        />
                        <MenuElement navigation={this.props.navigation}
                            menuItemImage={require('../images/tajskie-pulpeciki-drobiowe.jpg')}
                            menuItemName="Kurczak z pieczarkami"
                            menuItemIngritients="filet z kurczaka, pieczarki, cebula, koperek, papryka"
                            menuItemPrice={27.99}
                            menuItemRate={4.8}
                        />
                        <MenuElement navigation={this.props.navigation}
                            menuItemImage={require('../images/tajskie-pulpeciki-drobiowe.jpg')}
                            menuItemName="Kurczak z pieczarkami"
                            menuItemIngritients="filet z kurczaka, pieczarki, cebula, koperek, papryka"
                            menuItemPrice={27.99}
                            menuItemRate={4.8}
                        />
                    </ScrollView>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "#f2f2f4",
        marginLeft: 12,
        marginRight: 12,
        marginTop: 10
    },
    imageContainer: {
        height: 130,
        width: "100%"
    },
    searchBarInputStyle: {
        height: 40,
        backgroundColor: "#FFFFFF",
        borderColor: "#aaaaaa",
        borderWidth: 1.5,
        borderRadius: 20,
        borderBottomWidth: 1.5,
        alignItems: "center",
    },
    searchBarContainerStyle: {
        backgroundColor: "#f2f2f4",
        borderBottomWidth: 0,
        borderTopWidth: 0,
        padding: 0,
        marginTop: 75,
        marginLeft: 12,
        marginRight: 12,
    },
    infoBox: {
        backgroundColor: "#fcdca5",
        height: 35,
        alignItems: "center",
        justifyContent: "center"
    },
    infoText: {
        textAlign: "center",
        fontFamily: "Roboto",
        fontSize: 18,
        fontWeight: "bold"
    }
});
