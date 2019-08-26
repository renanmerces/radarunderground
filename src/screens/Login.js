import React, {Component} from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import firebase from 'react-native-firebase'

export default class Login extends Component {
    
    state = { 
        email: '', 
        password: '',
        errorMessage: null 
    }
    
    handleLogin = () => {
        const { email, password } = this.state
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => this.props.navigation.navigate('Events'))
            .catch(error => this.setState({ errorMessage: error.message }))
      }
    
    render() {
        return (
            <View style={styles.container}>
                <Text>Acesso</Text>
                {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage}
                </Text>}
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="E-mail"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Senha"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <View style={styles.button}>
                    <Button title="Login" onPress={this.handleLogin} />
                </View>
                <View style={styles.button}>
                    <Button
                        title="Não tem uma conta? Cadastre-se"
                        onPress={() => this.props.navigation.navigate('SignUp')}
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