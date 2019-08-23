import React, {Component} from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import firebase from 'react-native-firebase'

export default class SignUp extends Component {
  
    state = { 
        email: '', 
        password: '', 
        errorMessage: null 
    }

    handleSignUp = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => this.props.navigation.navigate('Maps'))
            .catch(error => this.setState({ errorMessage: error.message }))
    }

    render() {
        return (
        <View style={styles.container}>
            <Text>Realizar cadastro</Text>
            {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
                {this.state.errorMessage}
            </Text>}
            <TextInput
                placeholder="E-mail"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
            />
            <TextInput
                secureTextEntry
                placeholder="Senha"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
            />
            <View style={styles.button}>
                <Button title="Cadastrar" onPress={this.handleSignUp} />
            </View>
            <View style={styles.button}>
                <Button
                    title="Já tem conta? Acesse"
                    onPress={() => this.props.navigation.navigate('Login')}
                />
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    },
    button: {
        margin: 10
    }
})