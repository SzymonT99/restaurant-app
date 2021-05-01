import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, ToastAndroid } from "react-native";
import { Input, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import { TouchableOpacity } from 'react-native-gesture-handler'

export class RegisterScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            login: '',
            password: '',
            repeatedPassword: '',
            phoneNumber: '',
            showPassword: false,
            showRepeatedPassword: false,
            acceptedRules: false,
            emailInputWarning: '',
            loginInputWarning: '',
            passwordInputWarning: '',
            repeatedPasswordInputWarning: '',
            phoneNumberInputWarning: '',
            warning: ''
        }
    }

    validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
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

    checkCorrectnessOfFields = () => {
        const { login, email, phoneNumber, password, repeatedPassword } = this.state;

        let status = true;
       
        if (email === ''){
            this.setState({emailInputWarning: 'Nie podano e-maila'})
            status = false;
        }
        else {
            if (!this.validateEmail(email)) {
                this.setState({emailInputWarning: 'Błędna struktura e-maila'})
                status = false;
            }
            else {
                this.setState({emailInputWarning: ''})
            }
        }

        if (login === ''){
            this.setState({loginInputWarning: 'Nie podano loginu'})
            status = false;
        }
        else {
            alert(this.validateLogin(login))
            if (!this.validateLogin(login)) {
                this.setState({loginInputWarning: 'Login powinien mieć min. 4 a max. 20 znaków'})
                status = false;
            }
            else {
                this.setState({loginInputWarning: ''})
            }
        }

        if (password === ''){
            this.setState({passwordInputWarning: 'Nie podano hasła'})
            status = false;
        }
        else {
            if (!this.validatePassword(password)) {
                this.setState({passwordInputWarning: 'Hasło powinno mieć min. 10 a max. 50 znaków'})
                status = false;
            }
            else {
                this.setState({passwordInputWarning: ''})
            }
        }

        if (repeatedPassword === ''){
            this.setState({repeatedPasswordInputWarning: 'Nie podano hasła'})
            status = false;
        }
        else {
            if (password !== repeatedPassword) {
                this.setState({repeatedPasswordInputWarning: 'Podane hasło nie jest identyczne'})
                status = false;
            }
            else {
                this.setState({repeatedPasswordInputWarning: ''})
            }
        }

        if (phoneNumber === ''){
            this.setState({phoneNumberInputWarning: 'Nie podano numeru telefonu'})
            status = false;
        }
        else {
            if (phoneNumber.length !== 9) {
                this.setState({phoneNumberInputWarning: 'Numer telefonu składa się z 9 cyfr'})
                status = false;
            }
            else {
                this.setState({phoneNumberInputWarning: ''})
            }
        }

        return status;

    }

    createUser = async () => {
        const { login, email, phoneNumber, password } = this.state;
        try {
            // należy podać swój lokalny adres ip
            let response = await fetch('http://192.168.0.152:8080/restaurant/create-user', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: login,
                    email: email,
                    phoneNumber: phoneNumber,
                    password: password
                })
            });
            let loginStatus = await response.status;

            if (loginStatus === 201) {
                this.setState({warning: ''});
                this.props.navigation.navigate("Login");
                ToastAndroid.show("Utworzono konto!", ToastAndroid.SHORT);
            }
            if (loginStatus === 403) {
                this.setState({ warning: "Konto o podanej nazwie już istnieje" })
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
                    <View style={styles.registerPanel}>
                        <View style={styles.headingStyle}>
                            <Text style={styles.headingText}>REJESTRACJA</Text>
                            <Text style={styles.subtitleText}>Utwórz nowe konto</Text>
                            <Avatar
                                size="large"
                                rounded
                                overlayContainerStyle={{ backgroundColor: '#FFFFFF' }}
                                icon={{ name: 'user', color: '#000000', type: 'font-awesome' }}
                                activeOpacity={0.7}
                                containerStyle={{ marginTop: 10 }}
                                onPress={() => alert("TODO: dodawanie zdjęć profilowych")}
                            />
                        </View>
                        <View>
                            <Input
                                inputContainerStyle={styles.inputStyle}
                                label="E-mail"
                                labelStyle={{ color: "#ff8c29", fontSize: 13, fontFamily: "Roboto" }}
                                leftIcon={{ type: 'font-awesome', name: 'envelope', size: 28, color: "white" }}
                                inputStyle={{ color: "white", fontSize: 16, fontFamily: "Roboto" }}
                                placeholder="Podaj e-mail"
                                onChangeText={(text) => this.setState({ email: text })}
                                value={this.state.email}
                                errorStyle={{ fontWeight: "bold", color: "#CA0000" }}
                                errorMessage={this.state.emailInputWarning}
                            />
                            <Input
                                inputContainerStyle={styles.inputStyle}
                                label="Login"
                                labelStyle={{ color: "#ff8c29", fontSize: 13, fontFamily: "Roboto" }}
                                leftIcon={{ type: 'font-awesome', name: 'user', size: 28, color: "white" }}
                                inputStyle={{ marginLeft: 8, color: "white", fontSize: 16, fontFamily: "Roboto" }}
                                placeholder="Podaj login"
                                onChangeText={(text) => this.setState({ login: text })}
                                value={this.state.login}
                                errorStyle={{ fontWeight: "bold", color: "#CA0000" }}
                                errorMessage={this.state.loginInputWarning}
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
                                errorMessage={this.state.passwordInputWarning}
                                secureTextEntry={this.state.password.length === 0 ? false :
                                    (this.state.showPassword === false ? true : false)}
                            />
                            <Input
                                inputContainerStyle={styles.inputStyle}
                                label="Powtórz Hasło"
                                labelStyle={{ color: "#ff8c29", fontSize: 13, fontFamily: "Roboto" }}
                                leftIcon={{ type: 'font-awesome', name: 'lock', size: 28, color: "white" }}
                                rightIcon={<Icon name={this.state.showPassword === true ? 'eye' : 'eye-off'}
                                    size={24} color='white'
                                    onPress={() => this.state.showRepeatedPassword === false
                                        ? this.setState({ showRepeatedPassword: true })
                                        : this.setState({ showRepeatedPassword: false })
                                    } />}
                                inputStyle={{ marginLeft: 8, color: "white", fontSize: 16, fontFamily: "Roboto" }}
                                placeholder="Podaj drugi raz hasło"
                                onChangeText={(text) => this.setState({ repeatedPassword: text })}
                                value={this.state.repeatedPassword}
                                errorStyle={{ fontWeight: "bold", color: "#CA0000" }}
                                errorMessage={this.state.repeatedPasswordInputWarning}
                                secureTextEntry={this.state.repeatedPassword.length === 0 ? false :
                                    (this.state.showRepeatedPassword === false ? true : false)}
                            />
                            <Input
                                inputContainerStyle={styles.inputStyle}
                                label="Nr. telefonu"
                                labelStyle={{ color: "#ff8c29", fontSize: 13, fontFamily: "Roboto" }}
                                leftIcon={{ type: 'font-awesome', name: 'phone', size: 28, color: "white" }}
                                inputStyle={{ marginLeft: 8, color: "white", fontSize: 16, fontFamily: "Roboto" }}
                                placeholder="Podaj nr. telefonu"
                                onChangeText={(text) => this.setState({ phoneNumber: text })}
                                value={this.state.phoneNumber}
                                errorStyle={{ fontWeight: "bold", color: "#CA0000" }}
                                errorMessage={this.state.phoneNumberInputWarning}
                            />
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <CheckBox
                                    value={this.state.acceptedRules}
                                    onValueChange={(value) => { this.setState({ acceptedRules: value }) }}
                                    style={styles.checkbox}
                                    tintColors={{ true: '#ff8c29', false: '#ff8c29' }}
                                />
                                <Text style={{ color: "#FFFFFF", marginLeft: 4, fontFamily: "Roboto" }}>Akceptuję regulamin restauracji</Text>
                            </View>
                            <Text style={styles.textWarning}>{this.state.warning}</Text>
                            <TouchableOpacity style={styles.buttonContainer}
                                onPress={
                                    () => {
                                        this.state.acceptedRules === false 
                                        ? this.setState({warning: 'Musisz zaakceptować regulamin'})
                                        : this.setState({warning: ''});

                                        if (this.checkCorrectnessOfFields() && this.state.acceptedRules === true){
                                            this.createUser();
                                        }
                                    }}>
                                <Text style={styles.buttonText}>Zarejestruj</Text>
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
    registerPanel: {
        flex: 1,
        backgroundColor: "rgba(25,20,19,0.8)",
        alignItems: "center"
    },
    headingStyle: {
        marginTop: 10,
        marginBottom: 5,
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
    inputStyle: {
        width: "80%",
        height: 38,
        color: "#FFFFFF",
    },
    checkbox: {
        marginLeft: 5,
    },
    buttonContainer: {
        alignSelf: "center",
        marginTop: 10,
        borderRadius: 20,
        backgroundColor: "#ff8c29",
        width: "80%",
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
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold",
        color: "#CA0000"
    }
});
