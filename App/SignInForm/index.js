import React, { Component } from 'react';
import { View, Text, Button, ActivityIndicator, } from 'react-native'
import firebase from 'firebase'
import TextFieldInput from './TextFieldInput'
import Main from '../Components/Main';
import styles from './styles.js'

class SignInForm extends Component {
	state = { email: 'timoftealexandru5@gmail.com', password: '123456', error: '', loading: false};
	onSignInPress() {
		this.setState({ error: '', loading: true });
		const { email, password } = this.state;
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(() => {
				this.setState({ error: '', loading: false });
				this.goToMain()
			})
			.catch((err) => {
        console.log("eroare",err)
				firebase.auth().createUserWithEmailAndPassword(email, password)
					.then(() => {
            firebase.database().ref().child(`users/${email.split('@')[0]}`)
              .set({
                active: 1,
              })
              .then(() => user)
              .catch(err=>console.log("error",err))
						this.setState({ error: '', loading: false});
						this.goToMain()
					})
					.catch((err) => {
            console.log("erroare",err)
						this.setState({ error: 'Authentication failed.', loading: false, });
					});
			});
	}
	renderButtonOrLoading() {
		if (this.state.loading) {
			return <View><ActivityIndicator /></View>
		}
		return <Button onPress={this.onSignInPress.bind(this)} title="Log in" />;
	}
	
	goToMain() {
		this.props.navigator.push({
			title:'GithubNotetaker',
			component: Main,
			passProps: {email: this.state.email}
		});
	}
	
	render() {
		return (
			<View style={styles.loginFormStyle}>
				<TextFieldInput
					label='Email Address'
					placeholder='youremailaddress@domain.com'
					value={this.state.email}
					onChangeText={email => this.setState({ email })}
					autoCorrect={false}/>
				<TextFieldInput
					label='Password'
					autoCorrect={false}
					placeholder='Your Password'
					secureTextEntry
					value={this.state.password}
					onChangeText={password => this.setState({ password })}
				/>
				<Text style={styles.errorTextStyle}>{this.state.error}</Text>
				{this.renderButtonOrLoading()}
			</View>
		);
	}
}
export default SignInForm;