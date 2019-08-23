import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import Loading from './src/screens/Loading'
import SignUp from './src/screens/SignUp'
import Login from './src/screens/Login'
import Maps from './src/screens/Maps'

const App = createSwitchNavigator(
    {
      Loading,
      SignUp,
      Login,
      Maps
    },
    {
      initialRouteName: 'Loading'
    }
)

export default createAppContainer(App)