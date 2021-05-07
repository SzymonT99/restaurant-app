import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { SearchBar } from 'react-native-elements';
import Header from "../components/Header";
import SpecialOfferElement from "../components/SpecialOfferElement";
import CategoryElement from "../components/CategoryElement";

export class CategoryScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            searchedCategory: [],
            categories: null,
            specialOffers: null
        }
    }

    getCategoriesFromApi = async () => {
        try {
            let response = await fetch(
                'http://192.168.0.152:8080/restaurant/categories'
            );
            let responseJson = await response.json();
            this.setState({
                categories: responseJson,
                searchedCategory: responseJson
            });
        } catch (error) {
            console.error(error);
        }
    }

    getSpecialOffersFromApi = async () => {
        try {
            let response = await fetch(
                'http://192.168.0.152:8080/restaurant/menu/special-offer'
            );
            let responseJson = await response.json();
            this.setState({
                specialOffers: responseJson
            });
        } catch (error) {
            console.error(error);
        }
    }

    componentDidMount() {
        this.getCategoriesFromApi();
        this.getSpecialOffersFromApi();
    }

    generateCategoryElements = () => {
        const { searchedCategory } = this.state;

        let categoriesLayout = searchedCategory.map((category, categoryIndex) => {
            return <CategoryElement
                navigation={this.props.navigation}
                categoryId={category.categoryId}
                categoryImage={category.categoryImage}
                categoryName={category.categoryName}
                key={categoryIndex} />
        })
        return categoriesLayout;
    }

    generateSpecialOfferElements = () => {
        const { specialOffers } = this.state;

        let specialsLayout = specialOffers.map((offer, offerIndex) => {
            return <SpecialOfferElement
                navigation={this.props.navigation}
                detailsId={offer.detailsId}
                image={offer.menuItemImage}
                name={offer.itemName}
                price={offer.price}
                key={offerIndex} />
        })
        return specialsLayout;
    }

    filtrCategories = (phrase) => {

        const { categories } = this.state;

        this.setState({ search: phrase });
        const reg = new RegExp("^" + phrase, "i");

        let categoryArray = [];

        for (let category of categories) {
            if (reg.test(category.categoryName)) {
                categoryArray = categoryArray.concat(category)
            }
        }

        this.setState({
            searchedCategory: categoryArray
        })

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
                        placeholder="Wyszukaj kategorie"
                        onChangeText={(text) => this.filtrCategories(text)}
                        value={this.state.search}
                    />
                    <ScrollView>
                        <Text style={styles.offerHeader}>Dania dnia</Text>
                        <SafeAreaView>
                            <ScrollView horizontal={true} style={styles.specialOfferContainer} alignItems="center">
                                {this.state.specialOffers !== null
                                    ? this.generateSpecialOfferElements()
                                    : <ActivityIndicator size="large" />}
                            </ScrollView>
                        </SafeAreaView>
                        <Text style={styles.offerHeader}>Kategorie</Text>

                        {this.state.categories !== null
                            ? this.generateCategoryElements()
                            : <ActivityIndicator size="large" />}
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
        backgroundColor: "transparent",
        borderBottomWidth: 0,
        borderTopWidth: 0,
        padding: 0,
        marginTop: 12,
        marginBottom: 12
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
        fontWeight: "bold",
        marginBottom: 8
    },
    specialOfferContainer: {
        height: 180,
        flexDirection: "row",
        marginBottom: 12
    }
});
