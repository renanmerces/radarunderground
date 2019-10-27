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

import Menu from './Menu'

const MainNav = createDrawerNavigator(
  {
    Events: {
      screen: Events,
      navigationOptions: {
          title: 'Eventos'
      }
    },
    Maps: {
      screen: Maps,
      navigationOptions: {
          title: 'Mapa'
      }
    },
  },
  { 
    initialRouteName: 'Maps',
    contentComponent: Menu,
    contentOptions:{
        labelStyle:{
            fontSize: 20
            },
        activateLabel:{
            color: '#080'
        },
    },
    drawerBackgroundColor: '#FFF',
    drawerPosition: 'left',
    drawerWidth: 280
  }
)

const EventsNav = createStackNavigator(
  {
    MainNav: {
      screen: MainNav,
      navigationOptions: ({ navigation }) => ({
        headerLeft: (
          <TouchableHighlight
            style={{padding: 10}}
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
            style={{padding: 10}}
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