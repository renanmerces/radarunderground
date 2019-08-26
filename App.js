import React from 'react'
import { StyleSheet, Platform, Image, Text, View, TouchableHighlight } from 'react-native'
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome'

import Loading from './src/screens/Loading'
import SignUp from './src/screens/SignUp'
import Login from './src/screens/Login'
import Maps from './src/screens/Maps'
import InfoPlace from './src/screens/InfoPlace'

const Events = createStackNavigator(
  {
    Maps: {
      screen: Maps,
      navigationOptions: ({ navigation }) => ({
        title: 'Explorar'
      }),
    },
    InfoPlace: {
      screen: InfoPlace,
      navigationOptions: ({ navigation }) => ({
        title: 'Informações',
        headerLeft: (
          <TouchableHighlight
            onPress={() => navigation.goBack(null)}
          >
              <Icon name='arrow-left' size={30} color="#000"/>
          </TouchableHighlight>
        )
      }),
    },
  },
  {
    initialRouteName: 'Maps'
  }
)

const App = createSwitchNavigator(
    {
      Loading,
      SignUp,
      Login,
      Events
    },
    {
      initialRouteName: 'Loading'
    }
)

export default createAppContainer(App)