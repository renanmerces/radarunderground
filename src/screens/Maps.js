import React, {Component} from 'react'
import {View, StyleSheet, Alert, Platform, PermissionsAndroid, ToastAndroid} from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler'
import firebase from 'react-native-firebase'
import Geolocation from 'react-native-geolocation-service'

export default class Maps extends Component
{
    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }

    getInitialState = () => {
        return {
            currentUser: null,
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            },
            places: []
        }
    }

    componentDidMount = () => {
        const { currentUser } = firebase.auth()
        this.setState({ currentUser })

        
        Platform.OS === 'ios' ? false :
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
        .then(data => {
            console.log('Opa', 'GPS ligado')
            this.getLocation()
            this.loadPlaces()
        })
        .catch(err => {
            Alert.alert('Ops',`Não deu bom não. (${JSON.stringify(err)})`)
        })

    }

    hasLocationPermission = async () => {
        if (Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version < 23)) {
            return true;
        }
    
        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
    
        if (hasPermission) return true;
    
        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
    
        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;
    
        if (status === PermissionsAndroid.RESULTS.DENIED) {
            ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
        }
    
        return false;
    }

    getLocation = async () => {
        const hasLocationPermission = await this.hasLocationPermission();
    
        if (!hasLocationPermission) return;
    
        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({ region: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421, 
                }});
            },
            (error) => {
                console.log(error)
                Alert.alert('Ops', `Não foi possível identificar a localização. (${JSON.stringify(error)})`);
            },
            { enableHighAccuracy: false, timeout: 1500, maximumAge: 10000, distanceFilter: 10, forceRequestLocation: true }
        );
    }

    loadPlaces = () => {
        const placesRef = firebase.database().ref('/locais');
        placesRef.once('value').then(snapshot => {
            this.setState({ places: snapshot.val() })
        })
        .catch(err => Alert.alert('Ops', JSON.stringify(err)))
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
                    {this.state.places.map((place, index) => (
                        <Marker
                        key={index}
                        coordinate={{
                            latitude: place.latitude,
                            longitude: place.longitude,
                            latitudeDelta: place.latitudeDelta,
                            longitudeDelta: place.longitudeDelta
                        }}
                        title={place.nome}
                        pinColor='green'
                        onPress={e =>
                            this.props.navigation.navigate("InfoPlace", {
                                place: place.nome,
                                events: place.eventos,
                                myLocation: {
                                    latitude: this.state.region.latitude,
                                    longitude: this.state.region.longitude
                                },
                                placeLocation: {
                                    latitude: place.latitude,
                                    longitude: place.longitude
                                }                                
                            })
                        }
                        />
                    ))}     
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