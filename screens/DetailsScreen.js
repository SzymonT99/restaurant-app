import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, ToastAndroid } from "react-native";
import Header from "../components/Header";
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CommentElement from "../components/CommentElement";
import { Rating } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";

export class DetailsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menuItemDetails: null,
            currentUserId: null,
            comment: '',
            rate: 0.0,
            commentWarning: false,
        }
    }

    getDetailsById = async () => {
        const { detailsId } = this.props.route.params;
        try {
            let response = await fetch(
                'http://192.168.0.152:8080/restaurant/menu/details/' + detailsId
            );
            let responseJson = await response.json();
            this.setState({
                menuItemDetails: responseJson,
            });
        } catch (error) {
            console.error(error);
        }
    }

    generateIngredients = () => {

        const { menuItemDetails } = this.state
        let ingredients = menuItemDetails.ingredients;

        return ingredients.map((ingredient, ingredientIndex) => {
            return <Text key={ingredientIndex}> {"\u25cf" + "   " + ingredient}</Text>
        })
    }

    generateComments = () => {
        const { menuItemDetails } = this.state;
        let reviews = menuItemDetails.details.reviews;

        let commentsLayout = reviews.map((review, reviewIndex) => {
            return <CommentElement
                userName={review.userName}
                rate={review.rate}
                comment={review.comment}
                key={reviewIndex} />
        })
        return commentsLayout;
    }

    addComment = async () => {
        const { currentUserId, menuItemDetails, comment, rate } = this.state;
        let detailsId = menuItemDetails.details.detailsId;
        try {
            let response = await fetch('http://192.168.0.152:8080/restaurant/add-review', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: currentUserId,
                    detailsId: detailsId,
                    comment: comment,
                    rate: rate
                })
            });
            let status = await response.json();

            if (status === true) {
                ToastAndroid.show("Wysłano komentarz", ToastAndroid.SHORT);
                this.getDetailsById();
            }
            else {
                ToastAndroid.show("Nie można dodawać więcej komentarzy", ToastAndroid.SHORT);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    getUserId = async () => {
        try {
            const id = await AsyncStorage.getItem('userId');
            if (id !== '') {
                this.setState({ currentUserId: parseInt(id) })
            }
        } catch (error) {
        }
    };

    componentDidMount() {
        this.getDetailsById();
        this.getUserId();
    }

    render() {

        const { menuItemDetails } = this.state;

        return (
            <ScrollView
                ref={(view) => { this.scrollView = view; }}
                style={styles.container}>
                <Header comeBack={true} navigation={this.props.navigation} title="Szczegóły" />
                {menuItemDetails !== null
                    ? <View>
                        <View>
                            <Image style={styles.imageStyle} source={{ uri: menuItemDetails.details.detailedImage }} />
                            <View style={[styles.statsBox, { top: 0 }]}>
                                <Icon name="star" color="#FFFFFF" size={28} />
                                <Text style={styles.rateText}>{Math.round(menuItemDetails.rate * 10) / 10}</Text>
                            </View>
                            <View style={[styles.statsBox, { top: 42 }]}>
                                <Icon name="turned-in" color="#FFFFFF" size={26} />
                                <Text style={styles.rateText}>{menuItemDetails.details.ordersNumber}</Text>
                            </View>
                        </View>
                        <View style={[styles.infoBox, { height: 60 }]}>
                            <Text style={styles.menuItemNaneText}>{menuItemDetails.itemName}</Text>
                            <View style={styles.basketContainer}>
                                <Text style={styles.priceText}>
                                    {"Cena: " +
                                        (String(menuItemDetails.price).slice(-1) !== "0" ? menuItemDetails.price + "0" : menuItemDetails.price)
                                        + " zł"}
                                </Text>
                                <TouchableOpacity style={styles.basketButton}
                                    onPress={() => alert("xd")}>
                                    <MaterialCommunityIcon name="cart-plus" color="#FFFFFF" size={24} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.descriptionText}>
                                {menuItemDetails.details.description}
                            </Text>
                            <Text style={styles.titleText}>Składniki:</Text>
                            <View style={styles.ingridientsContainer}>
                                {this.generateIngredients()}
                            </View>
                        </View>
                        <View style={[styles.infoBox, { height: 35, justifyContent: "flex-start" }]}>
                            <Text style={[styles.titleText, { marginLeft: 12 }]}>Sekcja komentarzy:</Text>
                            <TouchableOpacity style={styles.addButtonStyle}
                                onPress={() => this.scrollView.scrollToEnd({ animated: true })}>
                                <Text style={styles.titleText}>Dodaj</Text>
                                <Icon style={{ marginLeft: 5 }} name="add-circle-outline" size={28} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contentContainer}>
                            {this.generateComments()}
                        </View>
                        <View style={styles.addCommentContainer}>
                            <View style={styles.ratingContainer}>
                                <View style={{ flexDirection: "row", }}>
                                    <Text style={styles.titleText}>Ustal ocenę: </Text>
                                    <Rating
                                        fractions={1}
                                        type='star'
                                        ratingCount={5}
                                        imageSize={20}
                                        style={styles.ratingStyle}
                                        startingValue={1}
                                        onFinishRating={(num) => this.setState({rate: num})}
                                    />
                                </View>
                                <View style={{ marginTop: 5, borderBottomWidth: 1 }} />
                                <TextInput
                                    multiline
                                    onChangeText={(text) => this.setState({ comment: text })}
                                    value={this.state.comment}
                                    placeholder="Dodaj komentarz"
                                    style={{ paddingLeft: 0, paddingBottom: 0, paddingTop: 5 }}
                                />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={styles.textWarning}>
                                    {this.state.commentWarning === true ? "Nie wpisano komentarza" : ""}
                                </Text>
                                <TouchableOpacity style={styles.addCommentButton}
                                    onPress={() => {
                                        if (this.state.comment !== "") {
                                            this.addComment();
                                            this.setState({
                                                 commentWarning: false,
                                                 comment: ''
                                            })

                                        }
                                        else {
                                            this.setState({ commentWarning: true })
                                        }}
                                    }>
                                    <Icon name="send" color="#FFFFFF" size={26} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    : <ActivityIndicator size="large" />}
            </ScrollView>

        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    imageStyle: {
        width: "100%",
        height: 245
    },
    statsBox: {
        height: 40,
        width: 80,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        position: 'absolute',
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    rateText: {
        color: "#FFFFFF",
        paddingLeft: 3,
        fontSize: 20,
        fontFamily: "Roboto",
        fontWeight: "bold"
    },
    infoBox: {
        backgroundColor: "#fcdca5",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    menuItemNaneText: {
        width: "50%",
        color: "#ff8c29",
        fontFamily: "Roboto",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        paddingLeft: 20
    },
    basketContainer: {
        width: "50%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginLeft: 15
    },
    priceText: {
        fontFamily: "Roboto",
        fontSize: 14,
        paddingRight: 8
    },
    basketButton: {
        height: 40,
        width: 40,
        backgroundColor: "#ff8c29",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 15
    },
    contentContainer: {
        flex: 1,
        marginLeft: 12,
        marginRight: 12,
        marginTop: 10
    },
    descriptionText: {
        marginBottom: 10,
        textAlign: "justify"
    },
    ingridientsContainer: {
        backgroundColor: "#f2f2f2",
        borderRadius: 14,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 3,
        marginBottom: 10
    },
    titleText: {
        fontFamily: "Roboto",
        fontSize: 16,
        fontWeight: "bold",
    },
    addButtonStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 155
    },
    addCommentContainer: {
        backgroundColor: "#f2f2f2",
        width: "100%",
        padding: 10
    },
    ratingContainer: {
        backgroundColor: "#FFFFFF",
        padding: 8,
        borderColor: "#000000",
        borderWidth: 1,
        borderRadius: 14,
    },
    ratingStyle: {
        alignSelf: "flex-start",
    },
    addCommentButton: {
        width: 80,
        backgroundColor: "#ff8c29",
        alignSelf: "flex-end",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        padding: 8,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 14
    },
    textWarning: {
        marginLeft: 60,
        fontFamily: "Roboto",
        fontWeight: "bold",
        color: "#CA0000",
        fontSize: 16,
    }
});

