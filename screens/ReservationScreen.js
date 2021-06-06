import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ToastAndroid } from "react-native";
import Header from "../components/Header";
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

const hours = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];
const minutes = ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
const time = ["1", "2", "3", "4", "5", "6"];
const buttons = ["1 - 2", "3 - 4", "5 - 6", "7 - 8", "+10"];
export class ReservationScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			markedDates: {},
			selectedDate: '',
			selectedHour: 1,
			selectedMinute: 5,
			selectedTime: 1,
			selectedSeats: 0,
			orderQuantity: 0,
			name: "",
			surname: "",
			warning: '',
		}
	}

	getOrderQuantity = async () => {
		try {
			let orderId = await AsyncStorage.getItem('orderId');
			let userId = await AsyncStorage.getItem('userId');
			let token = await AsyncStorage.getItem('token');
			let response = await fetch('http://192.168.0.153:8080/restaurant/order/quantity/' + orderId, {
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

	validateFields = () => {
		const { selectedDate, name, surname, selectedSeats } = this.state
		if (selectedDate !== '' && selectedSeats != 0 && name != '' && surname !== '') {
			this.setState({ warning: 'Sprawdzanie wolnych terminów...' });
			return true;
		}
		else {
			this.setState({ warning: 'Nie uzupełniono wszystkich danych' });
			return false;
		}
	}

	createReservation = async () => {
		try {
			const { selectedDate, selectedHour, selectedMinute, selectedTime, name, surname, selectedSeats } = this.state
			let bookingDate = selectedDate + ' ' + (selectedHour.length === 1 ? "0" + selectedHour : selectedHour)
			+ ':' + (selectedMinute.length === 1 ? "0" + selectedMinute : selectedMinute) + ':00'
			let userId = await AsyncStorage.getItem('userId');
			let token = await AsyncStorage.getItem('token');
			let response = await fetch('http://192.168.0.153:8080/restaurant/create-reservation', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token,
					'UserId': userId
				}),
				body: JSON.stringify({
					startBooking: bookingDate,
					bookingTime: selectedTime,
					userId: userId,
					numberOfTableSeats: selectedSeats,
					clientName: name,
					clientSurname: surname
				})
			});
			let loginStatus = await response.status;

			if (loginStatus === 200) {
				this.setState({ warning: '' });
				this.setState({ name: '' });
				this.setState({ surname: '' });
				ToastAndroid.showWithGravity("Zarezerwowano stolik!", ToastAndroid.CENTER, ToastAndroid.SHORT);
			}
			if (loginStatus === 403) {
				this.setState({ warning: "Nie można dokonać takiej rezerwaji" })
			}
		}
		catch (error) {
			console.error(error);
		}
	}

	_onDayPress = day => {
		const { dateString } = day;
		let { markedDates } = this.state;

		markedDates = {};
		markedDates[`${dateString}`] = { selected: true, selectedColor: 'orange' };

		this.setState(
			{ ...this.state, markedDates, current: null },
			() => {
				this.setState({
					...this.state,
					current: dateString
				});
			});
		this.setState({
			selectedDate: day.dateString.substring(8) + '-' +
				day.dateString.substring(5, 7) + '-' + day.dateString.substring(0, 4)
		})

	};

	componentDidMount() {
		this.getOrderQuantity();
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={{ marginBottom: 6 }}>
					<Header navigation={this.props.navigation} title="Rezerwacja stolika" orderQuantity={this.state.orderQuantity} />
					<Text style={[styles.text, styles.margin]}>Wybierz date</Text>
					<Calendar
						markedDates={this.state.markedDates}
						current={Date()}
						minDate={'2021-01-1'}
						maxDate={'2022-12-31'}
						onDayPress={this._onDayPress}
						hideDayNames={true}
						monthFormat={'dd.MM.yyyy'}
						hideExtraDays={true}
						firstDay={1}
						onPressArrowLeft={subtractMonth => subtractMonth()}
						onPressArrowRight={addMonth => addMonth()}
						disableAllTouchEventsForDisabledDays={true}
						enableSwipeMonths={true}
						style={{
							width: 330,
							marginLeft: 32,
							borderRadius: 12,
						}}
						theme={{
							arrowColor: 'black',
							todayTextColor: 'black',
							todayTextFontWeight: 'bold',
							dayTextColor: "black",
							textDayFontFamily: "Roboto",
							headerBackgroundColor: '#ff8c29',
							backgroundColor: '#ff8c29',
							color: "black",
							calendarBackground: 'rgb(252, 220, 165)',
							'stylesheet.calendar.header': {
								header: {
									borderRadius: 30,
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
									backgroundColor: '#ff8c29'
								}
							},
							'stylesheet.calendar.main': {
								week: { marginTop: 4, marginBottom: 4, flexDirection: 'row', justifyContent: 'space-around' }
							}
						}}
					/>
				</View>
				<Text style={[styles.text, styles.margin]}>Osoba rezerwująca</Text>
				<View style={styles.userDataBox}>
					<TextInput
						style={styles.input}
						onChangeText={(text) => this.setState({ name: text })}
						value={this.state.name}
						placeholder="Podaj imie"
					/>
					<TextInput
						style={styles.input}
						onChangeText={(text) => this.setState({ surname: text })}
						value={this.state.surname}
						placeholder="Podaj nazwisko"
					/>
				</View>

				<View style={[styles.margin, styles.row]}>
					<Text style={{ marginLeft: 17, marginTop: 6, fontWeight: 'bold', fontSize: 18 }}>Godzina</Text>
					<Text style={{ marginLeft: 40, marginTop: 6, fontWeight: 'bold', fontSize: 18 }}>Minuta</Text>
					<Text style={{ marginLeft: 50, marginTop: 6, fontWeight: 'bold', fontSize: 18 }}>Czas</Text>
				</View>

				<View style={[styles.row, styles.margin, styles.pickerLayout]}>
					<Picker style={styles.pickerStyle}
						mode='dropdown'
						dropdownIconColor='#ff8c29'
						selectedValue={this.selectedHour}
						onValueChange={(itemValue, itemIndex) => {
							console.log('Picked hour: ' + itemValue),
								this.setState({
									selectedHour: itemValue,
								})
						}
						}>
						{hours.map((hour, index) => (
							<Picker.Item key={index} label={hour} value={hour} style={styles.pickerLabel} />
						))}
					</Picker>

					<Picker style={styles.pickerStyle}
						mode='dropdown'
						dropdownIconColor='#ff8c29'
						selectedValue={this.selectedMinute}
						onValueChange={(itemValue, itemIndex) => {
							console.log('Picked minute: ' + itemValue),
								this.setState({
									selectedMinute: itemValue,
								})
						}
						}>
						{minutes.map((minute, index) => (
							<Picker.Item key={index} label={minute} value={minute} style={styles.pickerLabel} />
						))}
					</Picker>

					<Picker style={styles.pickerStyle}
						mode='dropdown'
						dropdownIconColor='#ff8c29'
						selectedValue={this.selectedTime}
						onValueChange={(itemValue, itemIndex) => {
							console.log('Picked time: ' + itemValue),
								this.setState({
									selectedTime: itemValue,
								})
						}
						}>
						{time.map((time, index) => (
							<Picker.Item key={index} label={time} value={time} style={styles.pickerLabel} />
						))}
					</Picker>
				</View>
				<Text style={[styles.text, styles.margin]}>Liczba miejsc</Text>
				<View style={[styles.row, styles.margin]}>
					{buttons.map((number, index) => (
						<TouchableOpacity key={index} style={styles.button}
							onPress={() => this.setState({ selectedSeats: parseInt(number.substring(number.length - 2)) })}>
							<Text style={styles.buttonText}>{number}</Text>
						</TouchableOpacity>
					))}
				</View>
				<Text style={styles.warningStyle}>{this.state.warning}</Text>
				<View style={{ alignItems: 'center' }}>
					<TouchableOpacity style={styles.reservationButton}
						onPress={() => {
							this.validateFields() === true 
							? this.createReservation()
							: null
						}} >
						<Text style={styles.reservationText}>Potwierdź rezerwację</Text>
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
	text: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	margin: {
		margin: 4,
		marginLeft: 32
	},
	pickerLayout: {
		backgroundColor: 'rgb(252, 220, 165)',
		borderRadius: 12,
		justifyContent: "center",
		paddingLeft: 20,
		marginRight: 32
	},
	pickerStyle: {
		marginLeft: 2,
		width: 100,
		color: 'white',
		fontSize: 16,
		fontWeight: "bold",
		fontFamily: "Roboto",
		height: 40
	},
	pickerLabel: {
		color: 'white',
		backgroundColor: '#ff8c29',
		fontSize: 16,
		fontWeight: "bold",
		fontFamily: "Roboto",
		height: 40
	},
	row: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	button: {
		borderRadius: 12,
		marginRight: 13.5,
		width: 55,
		padding: 10,
		backgroundColor: '#ff8c29',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: 15,
		color: 'white',
		fontWeight: 'bold',
	},
	reservationButton: {
		borderRadius: 20,
		marginTop: 6,
		width: "74%",
		height: 50,
		backgroundColor: '#ff8c29',
		alignItems: 'center',
		justifyContent: "center"
	},
	reservationText: {
		fontSize: 18,
		textAlign: "center",
		fontWeight: "bold",
		fontFamily: "Roboto",
		color: "#FFFFFF"
	},
	userDataBox: {
		flexDirection: "row",
		marginLeft: 32,
		marginRight: 32,
		justifyContent: "space-between"
	},
	input: {
		backgroundColor: "white",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#b1b1b1",
		width: 160,
		padding: 9,
		fontFamily: "Roboto",
		fontSize: 16
	},
	warningStyle: {
		marginTop: 3,
		textAlign: "center",
		fontSize: 15,
		fontWeight: "bold",
		color: "#CA0000"
	}
});
