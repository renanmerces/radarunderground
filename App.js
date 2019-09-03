import React from 'react'
import { StyleSheet, Platform, Image, Text, View, TouchableHighlight } from 'react-native'
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome'

import Loading from './src/screens/Loading'
import SignUp from './src/screens/SignUp'
import Login from './src/screens/Login'
import Maps from './src/screens/Maps'
import InfoPlace from './src/screens/InfoPlace'
import Events from './src/screens/Events'

const MainNav = createDrawerNavigator(
  {
    Events,
    Maps
  },
  {
    initialRouteName: 'Maps'
  }
)

const EventsNav = createStackNavigator(
  {
    MainNav: {
      screen: MainNav,
      navigationOptions: ({ navigation }) => ({
        headerLeft: (
          <TouchableHighlight
            onPress={() => navigation.openDrawer()}
          >
              <Icon name='bars' size={30} color="#000"/>
          </TouchableHighlight>
        )
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
    initialRouteName: 'MainNav'
  }
)

const App = createSwitchNavigator(
    {
      Loading,
      SignUp,
      Login,
      EventsNav
    },
    {
      initialRouteName: 'Loading'
    }
)

export default createAppContainer(App)