import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import Header from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const RESTAURANT_NAME = "\"Na Dziedzińcu\"";
const ADDRESS = "Lwowska 4,33-100 Tarnów";
const MAIL = "restauracja@gmail.com";
const PHONE = "+48146960912";
const DESCRIPTION = "Prawdziwa restauracja z wieloletnią tradycją, sięgającą 1926r.\n"
	+ "Nasze dania wykonujemy z najwyższej jakości składników, aby nasi klienci mogli delektować się smakiem "
	+ "tradycyjnej polskiej kuchni.";
export class AboutRestaurantScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			orderQuantity: 0,
			internetConnected: true,
		}
	}

	getOrderQuantity = async () => {
		try {
			let orderId = await AsyncStorage.getItem('orderId');
			let userId = await AsyncStorage.getItem('userId');
			let token = await AsyncStorage.getItem('token');
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

	checkInternetConnection = () => NetInfo.addEventListener(state => {
        this.setState({ internetConnected: state.isConnected });
      });

	componentDidMount() {
		this.checkInternetConnection();
		NetInfo.fetch().then(
            state => {
                if (state.isConnected === true) {
                    this.getOrderQuantity();
                } else this.props.navigation.navigate("NoInternet");
            });
	}

	render() {
		console.log(this.state.internetConnected)
		return (
			<View style={styles.container}>
				<Header navigation={this.props.navigation} title="O restauracji" orderQuantity={this.state.orderQuantity} />
				<View style={styles.leaflet}>
					<ImageBackground source={require('../images/backgraund-image.jpg')} style={styles.image}>
						<View style={styles.leafletShadow}>
							<View style={styles.leafletTop}>
								<Text style={[styles.textNormal, styles.textColorPrimary]}>Restauracja</Text>
								<Text style={[styles.textBolded, styles.textColorSecondary]}>{RESTAURANT_NAME}</Text>
							</View>
							<Text style={[styles.textContent, styles.textColorPrimary, styles.textBolded]}>Kontakt</Text>
							<Text style={[styles.textContent, styles.textColorSecondary]}>{ADDRESS}</Text>
							<Text style={[styles.textContent, styles.textColorSecondary]}>{MAIL}</Text>
							<Text style={[styles.textContent, styles.textColorSecondary]}>{PHONE}</Text>
							<Text style={[styles.textContent, styles.textColorPrimary]}>{DESCRIPTION}</Text>
						</View>
					</ImageBackground>
				</View>

				<View style={styles.map}>
					<ImageBackground source={require('../images/map.jpg')} style={styles.image}></ImageBackground>
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		flex: 1,
		resizeMode: "cover",
	},
	leaflet: {
		height: 400,
	},
	leafletShadow: {
		height: 400,
		backgroundColor: "rgba(25,20,19,0.8)",
	},
	leafletTop: {
		marginTop: 12,
		marginBottom: 32,
		alignItems: "center",
	},
	textNormal: {
		fontSize: 18,
	},
	textBolded: {
		fontSize: 25,
	},
	textColorPrimary: {
		color: 'white'
	},
	textColorSecondary: {
		color: 'darkorange'
	},
	textContent: {
		fontSize: 17,
		marginLeft: 32,
		marginRight: 32,
		margin: 4
	},
	map: {
		height: 264,
		width: 393,
		backgroundColor: 'red'
	}
});
