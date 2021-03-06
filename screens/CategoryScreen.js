import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { SearchBar } from 'react-native-elements';
import Header from "../components/Header";
import SpecialOfferElement from "../components/SpecialOfferElement";
import CategoryElement from "../components/CategoryElement";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export class CategoryScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            searchedCategory: [],
            categories: null,
            specialOffers: null,
            orderQuantity: 0,
            guest: false,
            internetConnected: true,
        }
    }

    checkInternetConnection = () => NetInfo.addEventListener(state => {
        this.setState({ internetConnected: state.isConnected });
    });

    getOrderQuantity = async () => {
        if (this.state.internetConnected) {
            if (this.state.guest !== true) {
                let orderId = await AsyncStorage.getItem('orderId');
                let userId = await AsyncStorage.getItem('userId');
                let token = await AsyncStorage.getItem('token');
                try {
                    let response = await fetch(
                        'http://192.168.0.152:8080/restaurant/order/quantity/' + orderId, {
                        headers: new Headers({
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token,
                            'UserId': userId
                        }),
                    });
                    let responseJson = await response.json();
                    this.setState({ orderQuantity: responseJson })
                } catch (error) {
                    console.error(error);
                }
            }
        } else this.props.navigation.navigate("NoInternet");
    }

    getCategoriesFromApi = async () => {
        if (this.state.internetConnected) {
            let guest = false;
            await AsyncStorage.getItem('guest').then((flag) => {
                if (flag === 'true') {
                    this.setState({ guest: true })
                    guest = true;
                }
            });
            try {
                let response = await fetch(
                    'http://192.168.0.152:8080/restaurant/categories'
                );
                let responseJson = await response.json();
                this.setState({
                    categories: responseJson,
                    searchedCategory: responseJson
                });
                if (guest !== true) {
                    this.getOrderQuantity();
                }
            } catch (error) {
                console.error(error);
            }
        } else this.props.navigation.navigate("NoInternet");
    }

    getSpecialOffersFromApi = async () => {
        if (this.state.internetConnected) {
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
        } else this.props.navigation.navigate("NoInternet");
    }

    componentDidMount() {
        this.checkInternetConnection();
        NetInfo.fetch().then(
            state => {
                if (state.isConnected === true) {
                    this.getCategoriesFromApi();
                    this.getSpecialOffersFromApi();
                } else this.props.navigation.navigate("NoInternet");
            });
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
                <Header navigation={this.props.navigation} title="Menu" orderQuantity={this.state.orderQuantity}
                    logout={this.state.guest !== false ? true : false}
                    noneRight={this.state.guest !== false ? true : false} />
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.offerHeader}>Dania dnia</Text>
                        <SafeAreaView>
                            <ScrollView horizontal={true} style={styles.specialOfferContainer} alignItems="center"
                                showsHorizontalScrollIndicator={false}>
                                {this.state.specialOffers !== null
                                    ? this.generateSpecialOfferElements()
                                    : <ActivityIndicator size={100} color="#ff8c29" style={{ marginLeft: 130 }} />}
                            </ScrollView>
                        </SafeAreaView>
                        <Text style={styles.offerHeader}>Kategorie</Text>

                        {this.state.categories !== null
                            ? this.generateCategoryElements()
                            : <ActivityIndicator size={100} color="#ff8c29" style={{ marginTop: 60 }} />}
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
