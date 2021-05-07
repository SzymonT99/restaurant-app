import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, ScrollView, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import MenuElement from "../components/MenuElement";
import { SearchBar } from 'react-native-elements';

export class MenuScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            searchedMenuItems: [],
            menuItems: null
        }
    }

    getMenuByCategoryId = async () => {
        const { categoryId } = this.props.route.params;
        try {
            let response = await fetch(
                'http://192.168.0.152:8080/restaurant/menu-category/' + categoryId
            );
            let responseJson = await response.json();
            this.setState({
                menuItems: responseJson,
                searchedMenuItems: responseJson
            });
        } catch (error) {
            console.error(error);
        }
    }

    filtrMenu = (phrase) => {

        const { menuItems } = this.state;

        this.setState({ search: phrase });
        const reg = new RegExp("^" + phrase, "i");
        
        let menuArray = [];

        for (let item of menuItems) {
            if (reg.test(item.itemName)) {
                menuArray = menuArray.concat(item)
            }
        }

        this.setState({
            searchedMenuItems: menuArray
        })

    }

    componentDidMount() {
        this.getMenuByCategoryId();
    }

    generateMenuElements = () => {
        const { searchedMenuItems } = this.state;

        let menuLayout = searchedMenuItems.map((item, itemIndex) => {
            return <MenuElement
                navigation={this.props.navigation}
                detailsId={item.detailsId}
                menuItemImage={item.menuItemImage}
                menuItemName={item.itemName}
                menuItemIngritients={item.ingredients.join(", ")}
                menuItemPrice={item.price}
                menuItemRate={item.rate}
                key={itemIndex} />
        })
        return menuLayout;
    }

    render() {

        const { categoryName, image } = this.props.route.params;

        return (
            <View style={styles.container}>
                <Header comeBack={true} navigation={this.props.navigation} title={categoryName} />
                <ImageBackground source={{ uri: image }} style={styles.imageContainer}>
                    <SearchBar
                        clearIcon={{ color: "#000000" }}
                        searchIcon={{ color: "#000000", size: 26 }}
                        leftIconContainerStyle={{ color: "red" }}
                        containerStyle={styles.searchBarContainerStyle}
                        inputContainerStyle={styles.searchBarInputStyle}
                        inputStyle={{ color: "#000000", marginTop: 3, fontSize: 16 }}
                        placeholder="Wyszukaj"
                        onChangeText={(text) => this.filtrMenu(text)}
                        value={this.state.search}
                    />
                </ImageBackground>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>{this.state.menuItems !== null
                        ? (this.state.menuItems.length > 10 || this.state.menuItems.length === 0
                            ? this.state.menuItems.length + " pozycji"
                            : this.state.menuItems.length + " pozycje")
                        : ""} </Text>
                </View>
                <View style={styles.contentContainer}>
                    <ScrollView>
                        {this.state.menuItems !== null
                            ? this.generateMenuElements()
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
        backgroundColor: "transparent",
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
