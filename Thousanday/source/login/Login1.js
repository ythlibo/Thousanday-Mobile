import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    RefreshControl
} from "react-native";
/*
const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    AccessToken
} = FBSDK;*/
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import processError from "../../js/processError.js";
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //show refresh
            refresh: false
        };
    }
    componentDidMount() {
        this._gSetup();
    }
    async _gSetup() {
        await GoogleSignin.hasPlayServices({ autoResolve: true });
        await GoogleSignin.configure({
			iosClientId: '835652983909-gf89tn5ttgcbkdacintdi0kiqem0968t.apps.googleusercontent.com',
            webClientId: '835652983909-6if3h222alkttk9oas3hr3tl15sq1u7m.apps.googleusercontent.com',
            offlineAccess: false
        });
        let user = await GoogleSignin.currentUserAsync();
    }
    _gSignIn() {
        GoogleSignin.signIn()
            .then((user) => {
                this.setState({refresh: true});
                fetch("https://thousanday.com/account/google", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "token": user.idToken,
                        "platform": "ios"
                    })
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        processError(response);
                    }
                })
                .then((result) => {
                    this.setState({refresh: false});
                    if (result.id) {
                        this.props.goSignup(user, "google");
                    } else {
                        this.props.processLogin(result, "google");
                    }
                });
            })
            .done();
    }
    render() {
        return (
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refresh}
                    />
                }>
                <Image style={styles.logo} source={require("../../image/logo.png")} />
                <Text style={styles.title}>
                    Welcome! Please login ..
                </Text>
                <View style={styles.google}>
                    <GoogleSigninButton
                        style={{width: 186, height: 38}}
                        size={GoogleSigninButton.Size.Standard}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={this._gSignIn.bind(this)}
                    />
                </View>
				{/*<Facebook facebookId={this.props.processLogin.bind(this)} goSignup={this.props.goSignup.bind(this)} />*/}
                
                <Text style={styles.notice}>
                    {"Don't have an account?"}
                </Text>
                <Text style={styles.notice}>
                    {"Simply click the"}
                </Text>
                <Text style={styles.notice}>
                    {"Google or Facebook button above"}
                </Text>
                <Text style={styles.notice}>
                    {"to create one"}
                </Text>
            </ScrollView>
        )
    }
}
/*
let Facebook = React.createClass({
    render: function() {
        return (
            <View style={styles.facebook}>
                <LoginButton
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                alert("Login Error: " + result.error);
                            } else if (result.isCancelled) {
                                //alert("login is cancelled.");
                            } else {
                                AccessToken.getCurrentAccessToken().then(
                                    (data) => {
                                        this.setState({refresh: true});
                                        fetch("https://thousanday.com/account/facebook", {
                                            method: "POST",
                                            headers: {
                                                "Accept": "application/json",
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                "token": data.accessToken,
                                                "platform": "mobile"
                                            })
                                        })
                                        .then((response) => {
                                            if (response.ok) {
                                                return response.json();
                                            } else {
                                                processError(response);
                                            }
                                        })
                                        .then((result) => {
                                            this.setState({refresh: false});
                                            if (result.id) {
                                                this.props.goSignup(data, "facebook");
                                            } else {
                                                this.props.facebookId(result, "facebook");
                                            }
                                        });
                                    }
                                )
                            }
                        }
                    }
                />
            </View>
        );
    }
});
*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
        alignItems: "center"
    },
    logo: {
        marginTop: 50,
        width: 50,
        height: 50,
    },
    title: {
        marginVertical: 10,
        fontSize: 20,
        fontWeight: "bold"
    },
    notice: {
        fontSize: 14,
        paddingHorizontal: 50,
        marginTop: 20,
        textAlign: "center"
    },
    google: {
        marginTop: 20
    },
    facebook: {
        marginVertical: 15
    }
});

export default Login;
