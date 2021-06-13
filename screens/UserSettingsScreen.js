import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, ToastAndroid, ScrollView, TouchableOpacity } from "react-native";
import { Input } from 'react-native-elements';
import Header from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export class UserSettingsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderQuantity: 0,
            newEmail: '',
            newLogin: '',
            oldPassword: '',
            newPassword: "",
            repeatedNewPassword: '',
            newPhoneNumber: '',
            newEmailInputWarning: '',
            newLoginInputWarning: '',
            oldPasswordInputWarning: '',
            newPasswordInputWarning: '',
            repeatedNewPasswordInputWarning: '',
            newPhoneNumberInputWarning: '',
            internetConnected: true,
        }
    }

    checkInternetConnection = () => NetInfo.addEventListener(state => {
        this.setState({ internetConnected: state.isConnected });
      });

    getOrderQuantity = async () => {
        if (this.state.internetConnected) {
            try {
                let orderId = await AsyncStorage.getItem('orderId');
                let userId = await AsyncStorage.getItem('userId');
                let token = await AsyncStorage.getItem('token');
                let response = await fetch('http://192.168.0.152:8080/restaurant/order/quantity/' + orderId, {
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
        } else this.props.navigation.navigate("NoInternet");
    }

    validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase()) && email.length !== 0;
    }

    validateLogin = (login) => {
        if (login.length >= 4 && login.length <= 20) {
            return true;
        }
        else {
            return false;
        }
    }

    validatePassword = (password) => {
        if (password.length >= 10 && password.length <= 50) {
            return true;
        }
        else {
            return false;
        }
    }

    validatePhoneNumber = (number) => {
        const re = /^[0-9]{9}$/;
        return re.test(String(number)) && number.length !== 0;
    }

    updateEmail = async () => {
        if (this.state.internetConnected) {
            let userId = await AsyncStorage.getItem('userId');
            let token = await AsyncStorage.getItem('token');

            let login = await AsyncStorage.getItem('login');
            let password = await AsyncStorage.getItem('password');

            try {
                let response = await fetch('http://192.168.0.152:8080/restaurant/user-update/email', {
                    method: 'PUT',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                        'UserId': userId
                    }),
                    body: JSON.stringify({
                        login: login,
                        password: password,
                        newEmail: this.state.newEmail,
                    })
                });

                let status = await response.status;

                if (status === 200) {
                    this.setState({ newEmailInputWarning: '' })
                    this.setState({ newEmail: '' })
                    ToastAndroid.show("Zmieniono email!", ToastAndroid.SHORT);
                }
            }
            catch (error) {
                console.error(error);
            }
        } else this.props.navigation.navigate("NoInternet");
    }

    updateLogin = async () => {
        if (this.state.internetConnected) {
            let userId = await AsyncStorage.getItem('userId');
            let token = await AsyncStorage.getItem('token');

            let login = await AsyncStorage.getItem('login');
            let password = await AsyncStorage.getItem('password');

            try {
                let response = await fetch('http://192.168.0.152:8080/restaurant/user-update/login', {
                    method: 'PUT',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                        'UserId': userId
                    }),
                    body: JSON.stringify({
                        oldLogin: login,
                        password: password,
                        newLogin: this.state.newLogin,
                    })
                });

                let status = await response.status;

                if (status === 200) {
                    let json = await response.json();
                    AsyncStorage.setItem('token', json.token);
                    AsyncStorage.setItem('login', this.state.newLogin);
                    this.setState({ newLoginInputWarning: '' })
                    this.setState({ newLogin: '' })
                    ToastAndroid.show("Zmieniono login!", ToastAndroid.SHORT);
                }
            }
            catch (error) {
                console.error(error);
            }
        } else this.props.navigation.navigate("NoInternet");
    }

    checkPasswordFields = () => {
        const { oldPassword, newPassword, repeatedNewPassword } = this.state;
        let status = true;

        if (oldPassword === '') {
            this.setState({ oldPasswordInputWarning: 'Nie podano hasła' })
            status = false;
        }


        if (newPassword === '') {
            this.setState({ newPasswordInputWarning: 'Nie podano hasła' })
            status = false;
        }
        else {
            if (!this.validatePassword(newPassword)) {
                this.setState({ newPasswordInputWarning: 'Hasło powinno mieć min. 10 a max. 50 znaków' })
                status = false;
            }
            else {
                this.setState({ newPasswordInputWarning: '' })
            }
        }

        if (repeatedNewPassword === '') {
            this.setState({ repeatedNewPasswordInputWarning: 'Nie podano hasła' })
            status = false;
        }
        else {
            if (!this.validatePassword(repeatedNewPassword)) {
                this.setState({ repeatedNewPasswordInputWarning: 'Hasło powinno mieć min. 10 a max. 50 znaków' })
                status = false;
            }
            else if (repeatedNewPassword !== newPassword) {
                this.setState({ repeatedNewPasswordInputWarning: 'Podane hasła nie są takie same' })
                status = false;
            }
            else {
                this.setState({ repeatedNewPasswordInputWarning: '' })
            }
        }

        return status;

    }

    updatePassword = async () => {
        if (this.state.internetConnected) {
            const { oldPassword, newPassword } = this.state;
            let login = await AsyncStorage.getItem('login');
            let userId = await AsyncStorage.getItem('userId');
            let token = await AsyncStorage.getItem('token');

            try {
                let response = await fetch('http://192.168.0.152:8080/restaurant/user-update/password', {
                    method: 'PUT',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                        'UserId': userId
                    }),
                    body: JSON.stringify({
                        login: login,
                        oldPassword: oldPassword,
                        newPassword: newPassword
                    })
                });

                let status = await response.status;

                if (status === 200) {
                    let json = await response.json();
                    AsyncStorage.setItem('token', json.token);
                    AsyncStorage.setItem('password', newPassword);

                    this.setState({ oldPasswordInputWarning: '' })
                    this.setState({ newPasswordInputWarning: '' })
                    this.setState({ repeatedNewPasswordInputWarning: '' })
                    this.setState({ oldPassword: '' })
                    this.setState({ newPassword: '' })
                    this.setState({ repeatedNewPassword: '' })

                    ToastAndroid.show("Zmieniono hasło!", ToastAndroid.SHORT);
                }
                if (status === 401) {
                    this.setState({ oldPasswordInputWarning: 'Hasło nie autoryzuje użytkownika' })
                }
            }
            catch (error) {
                console.error(error);
            }
        } else this.props.navigation.navigate("NoInternet");
    }

    updatePhoneNumber = async () => {
        if (this.state.internetConnected) {
            let userId = await AsyncStorage.getItem('userId');
            let token = await AsyncStorage.getItem('token');

            let login = await AsyncStorage.getItem('login');
            let password = await AsyncStorage.getItem('password');

            try {
                let response = await fetch('http://192.168.0.152:8080/restaurant/user-update/phone', {
                    method: 'PUT',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                        'UserId': userId
                    }),
                    body: JSON.stringify({
                        login: login,
                        password: password,
                        newPhoneNumber: this.state.newPhoneNumber
                    })
                });

                let status = await response.status;

                if (status === 200) {
                    this.setState({ newPhoneNumberInputWarning: '' })
                    this.setState({ newPhoneNumber: '' })
                    ToastAndroid.show("Zmieniono numer telefonu!", ToastAndroid.SHORT);
                }
            }
            catch (error) {
                console.error(error);
            }
        } else this.props.navigation.navigate("NoInternet");
    }

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
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation} title="Ustawienia konta" orderQuantity={this.state.orderQuantity} />
                <ImageBackground source={require('../images/backgraund-image.jpg')} style={styles.image}>
                    <ScrollView style={{ backgroundColor: "rgba(25,20,19,0.8)" }}>
                        <View style={styles.accountPanel}>
                            <View>
                                <Text style={[styles.title, { marginTop: 24 }]}>Zmiana adresu e-mail</Text>
                                <Input
                                    inputContainerStyle={styles.inputStyle}
                                    label="Nowy E-mail"
                                    labelStyle={{ color: "#ff8c29", fontSize: 13, fontFamily: "Roboto" }}
                                    leftIcon={{ type: 'font-awesome', name: 'envelope', size: 24, color: "white" }}
                                    rightIcon={
                                        <TouchableOpacity style={styles.confirmButton}
                                            onPress={
                                                () => this.validateEmail(this.state.newEmail)
                                                    ? this.updateEmail()
                                                    : this.setState({ newEmailInputWarning: "Niepoprawny format emaila" })
                                            }>
                                            <Text style={styles.confirmButtonText}>Zapisz</Text>
                                        </TouchableOpacity>}
                                    inputStyle={{ color: "white", fontSize: 16, fontFamily: "Roboto" }}
                                    placeholder="Podaj nowy e-mail"
                                    onChangeText={(text) => this.setState({ newEmail: text })}
                                    value={this.state.newEmail}
                                    errorStyle={{ fontWeight: "bold", color: "#CA0000" }}
                                    errorMessage={this.state.newEmailInputWarning}
                                />
                                <Text style={styles.title}>Zmiana loginu</Text>
                                <Input
                                    inputContainerStyle={styles.inputStyle}
                                    label="Nowy Login"
                                    labelStyle={{ color: "#ff8c29", fontSize: 13, fontFamily: "Roboto" }}
                                    leftIcon={{ type: 'font-awesome', name: 'user', size: 28, color: "white" }}
                                    rightIcon={
                                        <TouchableOpacity style={styles.confirmButton}
                                            onPress={
                                                () => this.validateLogin(this.state.newLogin)
                                                    ? this.updateLogin()
                                                    : this.setState({ newLoginInputWarning: "Login musi mieć min. 4 a max. 20 znaków" })
                                            }>
                                            <Text style={styles.confirmButtonText}>Zapisz</Text>
                                        </TouchableOpacity>}
                                    inputStyle={{ marginLeft: 8, color: "white", fontSize: 16, fontFamily: "Roboto" }}
                                    placeholder="Podaj nowy login"
                                    onChangeText={(text) => this.setState({ newLogin: text })}
                                    value={this.state.newLogin}
                                    errorStyle={{ fontWeight: "bold", color: "#CA0000" }}
                                    errorMessage={this.state.newLoginInputWarning}
                                />
                                <Text style={styles.title}>Zmiana hasła</Text>
                                <Input
                                    inputContainerStyle={styles.inputStyle}
                                    label="Stare hasło"
                                    labelStyle={{ color: "#ff8c29", fontSize: 13, fontFamily: "Roboto" }}
                                    leftIcon={{ type: 'font-awesome', name: 'lock', size: 28, color: "white" }}
                                    inputStyle={{ marginLeft: 8, color: "white", fontSize: 16, fontFamily: "Roboto" }}
                                    placeholder="Podaj stare hasło"
                                    onChangeText={(text) => this.setState({ oldPassword: text })}
                                    value={this.state.oldPassword}
                                    errorStyle={{ fontWeight: "bold", color: "#CA0000" }}
                                    errorMessage={this.state.oldPasswordInputWarning}
                                    secureTextEntry={this.state.oldPassword.length === 0 ? false : true}
                                />
                                <Input
                                    inputContainerStyle={styles.inputStyle}
                                    label="Nowe hasło"
                                    labelStyle={{ color: "#ff8c29", fontSize: 13, fontFamily: "Roboto" }}
                                    leftIcon={{ type: 'font-awesome', name: 'lock', size: 28, color: "white" }}
                                    inputStyle={{ marginLeft: 8, color: "white", fontSize: 16, fontFamily: "Roboto" }}
                                    placeholder="Podaj nowe hasło"
                                    onChangeText={(text) => this.setState({ newPassword: text })}
                                    value={this.state.newPassword}
                                    errorStyle={{ fontWeight: "bold", color: "#CA0000" }}
                                    errorMessage={this.state.newPasswordInputWarning}
                                    secureTextEntry={this.state.newPassword.length === 0 ? false : true}
                                />
                                <Input
                                    inputContainerStyle={styles.inputStyle}
                                    label="Powtórz hasło"
                                    labelStyle={{ color: "#ff8c29", fontSize: 13, fontFamily: "Roboto" }}
                                    leftIcon={{ type: 'font-awesome', name: 'lock', size: 28, color: "white" }}
                                    rightIcon={
                                        <TouchableOpacity style={styles.confirmButton}
                                            onPress={() => this.checkPasswordFields() ? this.updatePassword() : null}>
                                            <Text style={styles.confirmButtonText}>Zapisz</Text>
                                        </TouchableOpacity>}
                                    inputStyle={{ marginLeft: 8, color: "white", fontSize: 16, fontFamily: "Roboto" }}
                                    placeholder="Powtórz nowe hasło"
                                    onChangeText={(text) => this.setState({ repeatedNewPassword: text })}
                                    value={this.state.repeatedNewPassword}
                                    errorStyle={{ fontWeight: "bold", color: "#CA0000" }}
                                    errorMessage={this.state.repeatedNewPasswordInputWarning}
                                    secureTextEntry={this.state.repeatedNewPassword.length === 0 ? false : true}
                                />
                                <Text style={styles.title}>Zmiana numeru telefonu</Text>
                                <Input
                                    inputContainerStyle={styles.inputStyle}
                                    label="Nowy nr. telefonu"
                                    labelStyle={{ color: "#ff8c29", fontSize: 13, fontFamily: "Roboto" }}
                                    leftIcon={{ type: 'font-awesome', name: 'phone', size: 28, color: "white" }}
                                    rightIcon={
                                        <TouchableOpacity style={styles.confirmButton}
                                            onPress={
                                                () => this.validatePhoneNumber(this.state.newPhoneNumber)
                                                    ? this.updatePhoneNumber()
                                                    : this.setState({ newPhoneNumberInputWarning: "Niepoprawny numer telefonu" })
                                            }>
                                            <Text style={styles.confirmButtonText}>Zapisz</Text>
                                        </TouchableOpacity>}
                                    inputStyle={{ marginLeft: 8, color: "white", fontSize: 16, fontFamily: "Roboto" }}
                                    placeholder="Podaj nowy nr. telefonu"
                                    onChangeText={(text) => this.setState({ newPhoneNumber: text })}
                                    value={this.state.newPhoneNumber}
                                    errorStyle={{ fontWeight: "bold", color: "#CA0000" }}
                                    errorMessage={this.state.newPhoneNumberInputWarning}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>
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
    accountPanel: {
        flex: 1,
        alignItems: "center"
    },
    title: {
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 5,
        color: "#ff8c29",
        fontSize: 20,
        fontFamily: "Roboto",
        fontWeight: "bold"
    },
    inputStyle: {
        width: "85%",
        height: 38,
        color: "#FFFFFF",
    },
    textWarning: {
        textAlign: "center",
        fontSize: 14,
        fontFamily: "Roboto",
        fontWeight: "bold",
        color: "#CA0000"
    },
    confirmButton: {
        alignSelf: "center",
        borderRadius: 40,
        backgroundColor: "#ff8c29",
        marginBottom: 14,
        width: 75,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    confirmButtonText: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "Roboto",
        color: "#FFFFFF"
    },
});