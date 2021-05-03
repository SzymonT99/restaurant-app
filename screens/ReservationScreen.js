import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Header from "../components/Header";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Picker} from '@react-native-picker/picker';

const hours = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"];
const minutes = ["5","10","15","20","25","30","35","40","45","50","55"];
const buttons = [ "1 - 2", "3 - 4" ,"5 - 6" ,"7 - 8" ,"8+" ];
export class ReservationScreen extends Component {

    constructor(props) {
        super(props);
		this.state={
			markedDates: {},
			selectedHour: '',
			selectedMinute: ''
		}
    }

	_onDayPress = day => {
    const { dateString } = day;
    let { markedDates } = this.state;

	markedDates={};
    markedDates[`${dateString}`] = { selected: true, selectedColor: 'orange' };

    this.setState( 
     { ...this.state, markedDates, current: null }, 
     () => {
       this.setState({
        ...this.state,
        current: dateString
       });
     });
	 console.log('selected day', day);
  };

    render() {
        return (
          <View style={styles.container}>
				<View style={{height: 420}}>
                 <Header navigation={this.props.navigation} title="Rezerwacja stolika" />
				 <Text style={[styles.text, styles.margin]}>Date</Text>
				 <Calendar
					  // Collection of dates that have to be marked. Default = {}
					  markedDates={this.state.markedDates}		 
					  // Initially visible month. Default = Date()
					  current={Date()}
					  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
					  minDate={'2021-01-1'}
					  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
					  maxDate={'2022-12-31'}
					  // Handler which gets executed on day press. Default = undefined
					  //onDayPress={(day) => {console.log('selected day', day), this.markDay(day)}}
					  onDayPress={this._onDayPress}
					  hideDayNames={true}
					  // Handler which gets executed on day long press. Default = undefined
					  onDayLongPress={(day) => {console.log('selected day', day)}}
					  // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
					  monthFormat={'MMM d, yyyy'}
					  // Handler which gets executed when visible month changes in calendar. Default = undefined
					  onMonthChange={(month) => {console.log('month changed', month)}}
					  // Do not show days of other months in month page. Default = false
					  hideExtraDays={true}
					  // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
					  firstDay={1} 
					  // Handler which gets executed when press arrow icon left. It receive a callback can go back month
					  onPressArrowLeft={subtractMonth => subtractMonth()}
					  // Handler which gets executed when press arrow icon right. It receive a callback can go next month
					  onPressArrowRight={addMonth => addMonth()}
					  // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
					  disableAllTouchEventsForDisabledDays={true}
					  enableSwipeMonths={true}
					  style={{
						width: 330,
						marginLeft: 32
					  }}
					  theme={{
						arrowColor: 'black',
						todayTextColor: 'darkorange',
						todayTextFontWeight: 'bold',
						headerBackgroundColor: 'darkorange',
						backgroundColor: 'darkorange',
						calendarBackground: 'rgb(252, 220, 165)',
						'stylesheet.calendar.header': {
							header: {
							  flexDirection: 'row',
							  justifyContent: 'space-between',
							  paddingLeft: 10,
							  paddingRight: 10,
							  marginTop: 6,
							  alignItems: 'center',
							  backgroundColor: 'darkorange'
							},
						},
					  }}
				 />
			</View>
			
			<View style={[styles.margin, styles.row]}>
				<Text style={{marginLeft:1, marginTop:12, fontWeight:'bold', fontSize: 20}}>Hours:</Text>
				<Text style={{marginLeft:30, marginTop:12, fontWeight:'bold', fontSize: 20}}>Minutes:</Text>
			</View>
			
			<View style={[styles.row, styles.margin]}>
				<Text> </Text>
				<Picker style={styles.pickerStyle}
					mode='dropdown'
					dropdownIconColor='darkorange'
					selectedValue={this.selectedHour}
					onValueChange={(itemValue, itemIndex) =>
						{console.log('Picked hour: '+itemValue),
						this.setState({
							selectedHour: itemValue,
						})}
					}>
					{hours.map((hour, index) => (
						<Picker.Item key={index} label={hour} value={hour} style={styles.pickerLabel}/>
					))}
				</Picker>
					
				<Picker style={styles.pickerStyle}
					mode='dropdown'
					dropdownIconColor='darkorange'
					selectedValue={this.selectedMinute}
					onValueChange={(itemValue, itemIndex) =>
						{console.log('Picked minute: '+itemValue),
						this.setState({
							selectedMinute: itemValue,
						})}
					}>
					{minutes.map((minute, index) => (
						<Picker.Item key={index} label={minute} value={minute} style={styles.pickerLabel}/>
					))}
				</Picker>
			</View>
			
			<Text style={[styles.text, styles.margin]}>Number of people</Text>
			
			<View style={[styles.row, styles.margin]}>
				{buttons.map((button, index) => (
						<TouchableOpacity key={index} style={styles.button}>
							<Text style={styles.buttonText}>{button}</Text>
						</TouchableOpacity>
					))}
			</View>
			
			<View style={{alignItems: 'center'}}>
				<TouchableOpacity style={styles.reservation} onPress={this.onPress} >
					<Text style={styles.buttonText}>Potwierdź rezerwację</Text>
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
		margin: 6,
		marginLeft: 32
	},
	pickerStyle: {
		width: 100,
		color: 'white',
	},
	pickerLabel: {
		color: 'white',
		backgroundColor: 'darkorange',
	},
	row: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	button: {
		marginRight: 13.5,
		width: 55,
		padding:10,
		backgroundColor: 'darkorange',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: 15,
		color: 'white',
		fontWeight: 'bold',
	},
	reservation: {
		marginTop:12,
		width: 330,
		padding:10,
		backgroundColor: 'darkorange',
		alignItems: 'center',
	}
});
