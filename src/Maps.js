import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import MapView from 'react-native-maps'

export default class Maps extends Component
{
    render(){
       return(
            <View style={styles.container}>
                <MapView
                style={styles.map}
                region={{
                    latitude: -13.002965,
                    longitude: -38.454410,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                >
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