import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ToastAndroid } from "react-native";
import Header from "../components/Header";
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const paymentMethods = ["Przelew bankowy", "Blik", "P24Now", "Google Pay", "Płatność przy odbiorze"]

export class OrderScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            town: '',
            street: '',
            postalCode: '',
            selectedPaymentMethod: 'Przelew bankowy',
            warning: ''
        }
    }

    validateFields = () => {
		const { town, street, postalCode, selectedPaymentMethod } = this.state
		if (town !== '' && street != 0 && postalCode != '' && selectedPaymentMethod !== '') {
			this.setState({ warning: 'Wysyłanie zamówienia...' });
			return true;
		}
		else {
			this.setState({ warning: 'Nie uzupełniono wszystkich danych' });
			return false;
		}
	}

    getCurrentOrderId = async (userId, token) => {
        try {
            let response = await fetch('http://192.168.0.153:8080/restaurant/order-create/' + userId, {
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'UserId': userId
                }),
            });
            let currentOrderId = await response.json();
            AsyncStorage.setItem('orderId', String(currentOrderId));
            console.log("---- orderId: " + currentOrderId)
        }
        catch (error) {
            console.error(error);
        }
    }
  
    confirmOrder = async () => {
		try {
			const { town, street, postalCode, selectedPaymentMethod } = this.state
            let orderId = await AsyncStorage.getItem('orderId');
			let userId = await AsyncStorage.getItem('userId');
			let token = await AsyncStorage.getItem('token');

            const data = { userId: userId, orderId: orderId };

			let response = await fetch(`http://192.168.0.153:8080/restaurant/confirm-order?userId=${encodeURIComponent(data.userId)}&orderId=${encodeURIComponent(data.orderId)}`, {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token,
					'UserId': userId
				}),
				body: JSON.stringify({
					town: town,
					postalCode: postalCode,
					street: street,
					paymentMethod: selectedPaymentMethod
				})
			});
			let loginStatus = await response.status;

			if (loginStatus === 200) {
				this.setState({ warning: '' });
				this.setState({ town: '' });
				this.setState({ street: '' });
                this.setState({ postalCode: '' });
                this.getCurrentOrderId(userId, token);
				ToastAndroid.show("Zamówienie zostało złożone!", ToastAndroid.SHORT);
                this.props.navigation.navigate("OrdersHistory")
			}
            else {
                this.setState({ warning: "Nie można potwierdzić zamówienia!"})
            }
		}
		catch (error) {
			console.error(error);
		}
	}

    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation} title="Zamówienie" form={true} />
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Podaj adres</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({ town: text })}
                        value={this.state.town}
                        placeholder="Miejscowość"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({ street: text })}
                        value={this.state.street}
                        placeholder="Ulica"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({ postalCode: text })}
                        value={this.state.postalCode}
                        placeholder="Kod pocztowy"
                    />
                    <Text style={styles.title}>Wybierz metodę płatności</Text>
                    <SelectDropdown
                        data={paymentMethods}
                        buttonStyle={styles.input}
                        dropdownStyle={styles.input}
                        defaultButtonText={"Przelew bankowy"}
                        renderDropdownIcon={() => <Icon name='chevron-down' size={32} />}
                        buttonTextStyle={{ fontSize: 16, textAlign: "left" }}
                        onSelect={(selectedItem, index) => {
                            this.setState({ selectedPaymentMethod: selectedItem })
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            return item
                        }}
                    />
                    <Image
                        style={styles.image}
                        source={require('../images/credit_cards.png')}
                    />
                    <Text style={styles.title}>Cena zamówienia z dostawą</Text>
                    <View style={styles.priceBox}>
                        <Text style={styles.priceTextStyle}>
                            {/\.[0-9]{1}$/.test(this.props.route.params.sumOfPrices)
                                ? this.props.route.params.sumOfPrices + "0 zł"
                                : this.props.route.params.sumOfPrices}
                        </Text>
                    </View>
                    <Text style={styles.warningStyle}>{this.state.warning}</Text>
                    <TouchableOpacity style={styles.orderButton}
						onPress={() => {
							this.validateFields() === true 
							? this.confirmOrder()
							: null
						}} >
						<Text style={styles.orderText}>Potwierdź zamówienie</Text>
					</TouchableOpacity>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        marginLeft: 32,
        marginRight: 32
    },
    title: {
        marginTop: 15,
        fontFamily: "Roboto",
        fontSize: 20,
        fontWeight: "bold"
    },
    input: {
        backgroundColor: "white",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#b1b1b1",
        width: "100%",
        padding: 9,
        fontFamily: "Roboto",
        fontSize: 16,
        marginTop: 8
    },
    image: {
        marginTop: 8,
        alignSelf: "center",
        width: 280,
        height: 150
    },
    priceBox: {
        backgroundColor: "#fcdca5",
        width: "40%",
        height: 32,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 12
    },
    priceTextStyle: {
        fontFamily: "Roboto",
        fontSize: 16,
        fontWeight: "bold"
    },
    orderButton: {
		borderRadius: 20,
		marginTop: 8,
		width: "84%",
		height: 50,
		backgroundColor: '#ff8c29',
		alignItems: 'center',
		justifyContent: "center",
        alignSelf: "center"
	},
	orderText: {
		fontSize: 18,
		textAlign: "center",
		fontWeight: "bold",
		fontFamily: "Roboto",
		color: "#FFFFFF"
	},
    warningStyle: {
		marginTop: 8,
		textAlign: "center",
		fontSize: 15,
		fontWeight: "bold",
		color: "#CA0000"
	}
});
