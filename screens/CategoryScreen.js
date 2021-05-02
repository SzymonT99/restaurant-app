import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { SearchBar } from 'react-native-elements';
import Header from "../components/Header";
import SpecialOfferElement from "../components/SpecialOfferElement";
import CategoryElement from "../components/CategoryElement";

export class CategoryScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation} title="Menu" />
                <View style={styles.contentContainer}>
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
                    <Text style={styles.offerHeader}>Dania dnia</Text>
                    <SafeAreaView>
                        <ScrollView horizontal={true} style={styles.specialOfferContainer} alignItems="center">
                            <SpecialOfferElement navigation={this.props.navigation}
                                image={require('../images/tajskie-pulpeciki-drobiowe.jpg')}
                                name="Tajskie pulpeciki drobiowe"
                                price={27.99} />
                            <SpecialOfferElement navigation={this.props.navigation}
                                image={require('../images/tajskie-pulpeciki-drobiowe.jpg')}
                                name="Tajskie pulpeciki drobiowe"
                                price={27.99} />
                            <SpecialOfferElement navigation={this.props.navigation}
                                image={require('../images/tajskie-pulpeciki-drobiowe.jpg')}
                                name="Tajskie pulpeciki drobiowe"
                                price={27.99} />
                            <SpecialOfferElement navigation={this.props.navigation}
                                image={require('../images/tajskie-pulpeciki-drobiowe.jpg')}
                                name="Tajskie pulpeciki drobiowe"
                                price={27.99} />
                        </ScrollView>
                    </SafeAreaView>
                    <Text style={styles.offerHeader}>Kategorie</Text>
                    <ScrollView style={styles.categoryContainer}>
                        <CategoryElement navigation={this.props.navigation}
                            categoryImage={require('../images/danie_glowne.jpg')}
                            categoryName="DANIE GŁÓWNE" />
                        <CategoryElement navigation={this.props.navigation}
                            categoryImage={require('../images/danie_glowne.jpg')}
                            categoryName="DANIE GŁÓWNE" />
                        <CategoryElement navigation={this.props.navigation}
                            categoryImage={require('../images/danie_glowne.jpg')}
                            categoryName="DANIE GŁÓWNE" />
                        <CategoryElement navigation={this.props.navigation}
                            categoryImage={require('../images/danie_glowne.jpg')}
                            categoryName="DANIE GŁÓWNE" />
                        <CategoryElement navigation={this.props.navigation}
                            categoryImage={require('../images/danie_glowne.jpg')}
                            categoryName="DANIE GŁÓWNE" />
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
        marginTop: 12,
        marginBottom: 8,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "#f2f2f4",
        marginLeft: 12,
        marginRight: 12,
    },
    offerHeader: {
        fontSize: 24,
        fontFamily: "Roboto",
        fontWeight: "bold"
    },
    specialOfferContainer: {
        flexDirection: "row",
        height: 200,
    },
    categoryContainer: {
        marginTop: 10
    }
});
