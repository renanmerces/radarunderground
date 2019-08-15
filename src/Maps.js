import React, {Component} from 'react'
import {View, StyleSheet, Alert} from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler'
import Geolocation from '@react-native-community/geolocation'
 
export default class Maps extends Component
{
    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }

    getInitialState = () => {
        return {
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        }
    }

    componentDidMount = () => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
        .then(data => {
            console.log('Opa', 'GPS ligado')
            Geolocation.getCurrentPosition(info => {
                this.setState({region: {
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }})
            })
        }).catch(err => {
            Alert.alert('Ops', 'Não é possível identificar a localização.')
        })
    }

    render(){
       return(
            <View style={styles.container}>
                <MapView
                style={styles.map}
                region={this.state.region}
                >
                    <Marker
                        coordinate={this.state.region}
                    />                    
                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex: 1
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
});