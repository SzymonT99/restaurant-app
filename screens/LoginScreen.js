import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, ToastAndroid } from "react-native";
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import { TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from "@react-native-async-storage/async-storage";

export class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            showPassword: false,
            rememberData: false,
            emptyLoginInput: false,
            emptyPasswordInput: false,
            warning: ''
        }
    }

    readDataFromStorage = async () => {
        let rememberedLogin = await AsyncStorage.getItem('login');
        this.setState({ login: rememberedLogin === null ? '' : rememberedLogin });

        let rememberedPassword = await AsyncStorage.getItem('password');
        this.setState({ password: rememberedPassword === null ? '' : rememberedPassword });
    }

    componentDidMount() {
        this.readDataFromStorage();
    }

    checkCompletionForm = () => {

        let status = true;

        if (this.state.login === "") {
            this.setState({ emptyLoginInput: true })
            status = false;
        }
        else {
            this.setState({ emptyLoginInput: false })
        }

        if (this.state.password === "") {
            this.setState({ emptyPasswordInput: true })
            status = false;
        }
        else {
            this.setState({ emptyPasswordInput: false })
        }

        return status;

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

    authorizeUser = async () => {
        const { login, password } = this.state;
        try {
            // należy podać swój lokalny adres ip
            let response = await fetch('http://192.168.0.153:8080/restaurant/user/login', {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    login: login,
                    password: password
                })
            });
            let loginStatus = await response.status;

            if (loginStatus === 200) {
                let json = await response.json();
                let userId = json.userId;
                let token = json.token;
                AsyncStorage.setItem('login', login);
                AsyncStorage.setItem('password', password);
                AsyncStorage.setItem('userId', String(userId));
                AsyncStorage.setItem('token', token);
                this.getCurrentOrderId(userId, token);
                this.setState({ warning: '' });
                this.props.navigation.navigate("MenuStack");
                ToastAndroid.show("Pomyślnie zalogowano!", ToastAndroid.SHORT);
            }
            else {
                let json = await response.json();
                let errMessage = json.content;
                this.setState({ warning: errMessage })
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../images/backgraund-image.jpg')} style={styles.image}>
                    <View style={styles.loginPanel}>
                        <View style={styles.headingStyle}>
                            <Text style={styles.headingText}>LOGOWANIE</Text>
                            <Text style={styles.subtitleText}>Podaj login oraz hasło</Text>
                        </View>
                        <View style={styles.formStyle}>
                            <Input
                                containerStyle={{ marginBottom: 10 }}
                                inputContainerStyle={styles.inputStyle}
                                label="Login"
                                labelStyle={{ color: "#ff8c29", fontSize: 13, fontFamily: "Roboto" }}
                                leftIcon={{ type: 'font-awesome', name: 'user', size: 28, color: "white" }}
                                inputStyle={{ marginLeft: 8, color: "white", fontSize: 16, fontFamily: "Roboto" }}
                                placeholder="Podaj login"
                                onChangeText={(text) => this.setState({ login: text })}
                                value={this.state.login}
                                errorStyle={{ fontWeight: "bold", color: "#CA0000" }}
                                errorMessage={this.state.emptyLoginInput === true ? "Nie podano loginu" : ""}
                            />
                            <Input
                                inputContainerStyle={styles.inputStyle}
                                label="Hasło"
                                labelStyle={{ color: "#ff8c29", fontSize: 13, fontFamily: "Roboto" }}
                                leftIcon={{ type: 'font-awesome', name: 'lock', size: 28, color: "white" }}
                                rightIcon={<Icon name={this.state.showPassword === true ? 'eye' : 'eye-off'}
                                    size={24} color='white'
                                    onPress={() => this.state.showPassword === false
                                        ? this.setState({ showPassword: true })
                                        : this.setState({ showPassword: false })
                                    } />}
                                inputStyle={{ marginLeft: 8, color: "white", fontSize: 16, fontFamily: "Roboto" }}
                                placeholder="Podaj hasło"
                                onChangeText={(text) => this.setState({ password: text })}
                                value={this.state.password}
                                errorStyle={{ fontWeight: "bold", color: "#CA0000" }}
                                errorMessage={this.state.emptyPasswordInput === true ? "Nie podano hasła" : ""}
                                secureTextEntry={this.state.password.length === 0 ? false :
                                    (this.state.showPassword === false ? true : false)}
                            />
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <CheckBox
                                    value={this.state.rememberData}
                                    onValueChange={(value) => { this.setState({ rememberData: value }) }}
                                    style={styles.checkbox}

                                    tintColors={{ true: '#ff8c29', false: '#ff8c29' }}
                                />
                                <Text style={{ color: "#FFFFFF", marginLeft: 4, fontFamily: "Roboto" }}>Zapamiętaj login i hasło</Text>
                            </View>
                            <Text style={styles.textWarning}>{this.state.warning}</Text>
                            <TouchableOpacity style={styles.buttonContainer}
                                onPress={
                                    () => {
                                        if (this.checkCompletionForm()) {

                                            this.state.rememberData === true
                                                ? AsyncStorage.setItem('rememberUserData', 'true')
                                                : AsyncStorage.setItem('rememberUserData', 'false');

                                            this.authorizeUser();
                                        }
                                    }
                                }>
                                <Text style={styles.buttonText}>Zaloguj</Text>
                            </TouchableOpacity>
                            <View style={styles.registerInformation}>
                                <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>Nie posiadasz konta?</Text>
                                <TouchableOpacity
                                    style={styles.registerLink}
                                    onPress={() => this.props.navigation.navigate('Register')}>
                                    <Text style={styles.registerLinkText}>Zarejestruj się</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.guestLink}
                                onPress={
                                    () => {
                                        this.props.navigation.navigate('MenuStack')
                                        AsyncStorage.setItem('guest', 'true');
                                    }}>
                                <Text style={styles.guestText}>Zaloguj się jako gość</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    loginPanel: {
        flex: 1,
        backgroundColor: "rgba(25,20,19,0.8)",
        alignItems: "center"
    },
    headingStyle: {
        marginTop: 10,
        marginBottom: 50,
        alignItems: "center"
    },
    headingText: {
        textAlign: "center",
        fontFamily: "Roboto",
        fontSize: 32,
        color: "#ff8c29"
    },
    subtitleText: {
        textAlign: "center",
        fontFamily: "Roboto",
        fontSize: 20,
        color: "#FFFFFF"
    },
    formStyle: {
        marginTop: 40,
    },
    inputStyle: {
        width: "85%",
        color: "#FFFFFF",
    },
    checkbox: {
        marginLeft: 5,
    },
    buttonContainer: {
        alignSelf: "center",
        marginTop: 15,
        borderRadius: 20,
        backgroundColor: "#ff8c29",
        width: "85%",
        height: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "Roboto",
        color: "#FFFFFF"
    },
    textWarning: {
        marginTop: 5,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold",
        color: "#CA0000"
    },
    registerInformation: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "center"
    },
    registerLinkText: {
        fontSize: 14,
        fontFamily: "Roboto",
        color: "#f6cc5c",
        fontWeight: "bold"
    },
    registerLink: {
        marginLeft: 3,
        padding: 0,
    },
    guestLink: {
        marginTop: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    guestText: {
        color: "#ff8c29",
        fontWeight: "bold",
        fontFamily: "Roboto",
        fontSize: 18,
        textDecorationLine: "underline"
    }
});
