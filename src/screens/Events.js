import React, {Component} from 'react'
import {View, Text, FlatList, TouchableOpacity, Alert, Platform, PermissionsAndroid, ToastAndroid} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import firebase from 'react-native-firebase'
import Slider from '@react-native-community/slider'
import Geolocation from 'react-native-geolocation-service'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler'
import haversine from 'haversine'
import InfoEvent from '../modals/InfoEvent'

export default class Events extends Component
{ 
    constructor(props){
        super(props)
        this.state = {
            dia: 0,
            events: [],
            range: 100,
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            },
            infoModalVisible: false,
            itemInfo: {
                evento: '',
                local: '',
                data: ''
            }
        }
    }

    componentWillMount() {
        this.loadPlaces()
    }

    componentDidMount() {
        Platform.OS === 'ios' ? false :
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
        .then(data => {
            console.log('Opa', 'GPS ligado')
            this.getLocation()
        })
        .catch(err => {
            Alert.alert('Ops',`Não deu bom não. (${JSON.stringify(err)})`)
        })
    }

    loadPlaces = () => {
        const placesRef = firebase.database().ref('/locais');
        placesRef.once('value').then(snapshot => {
            let events = []
            for(let i = 0; i < snapshot.val().length; i++){
                let local = snapshot.val()[i].nome
                let latitude = snapshot.val()[i].latitude
                let longitude = snapshot.val()[i].longitude
                
                for(j = 0; j < snapshot.val()[i].eventos.length; j++){
                    events.push({
                        evento: snapshot.val()[i].eventos[j].evento,
                        local,
                        latitude,
                        longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421, 
                        data: snapshot.val()[i].eventos[j].data
                    })
                }
            }
            this.setState({events})
        })
        .catch(err => Alert.alert('Ops', JSON.stringify(err)))
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

    openModal = item => {
        this.setState({
            itemInfo: {
                evento: item.evento,
                local: item.local,
                data: item.data
            },
            infoModalVisible: true
        })
    }

    closeModal = () => {
        this.setState({infoModalVisible: false})
    }

    render(){
        return(
            <View>
                <InfoEvent 
                    infoModalVisible={this.state.infoModalVisible} 
                    modalClose={() => this.closeModal()}
                    item={this.state.itemInfo}    
                />
                <View style={{
                    flexDirection: 'row', 
                    width: '100%', 
                    justifyContent: 'space-between',
                    alignItems: 'center', 
                    padding: 10
                }}>
                    <TouchableOpacity onPress={() => this.setState({dia: (this.state.dia - 1)})}>
                        <Icon name='angle-double-left' size={30}></Icon>
                    </TouchableOpacity>
                    <View>
                        <Text style={{fontSize: 16}}>{moment().add(this.state.dia, 'days').locale('pt-br').format('ddd, D [de] MMMM')}</Text>
                    </View>
                    <TouchableOpacity  onPress={() => this.setState({dia: (this.state.dia + 1)})}>
                        <Icon name='angle-double-right' size={30}></Icon>    
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Slider
                        style={{width: 200, height: 40}}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor="#AAA"
                        maximumTrackTintColor="#555"
                        value={this.state.range}
                        onValueChange={value => this.setState({range: value})}
                    />
                    <Text>
                        Distância: {this.state.range.toFixed(2)} km
                    </Text>
                </View>
                <FlatList
                    data={
                        this.state.events.filter(event => 
                            moment(event.data).startOf('day').diff(moment().startOf('day').add(this.state.dia, 'days'), 'days') == 0 
                            && 
                            Number(haversine(this.state.region, {latitude: event.latitude, longitude: event.longitude}, {unit: 'meter'})/1000) < this.state.range)
                        }
                    keyExtractor={(_, index) => `${index}`}
                    renderItem={({item}) =>
                        <TouchableOpacity style={{margin: 10, padding: 10}} onPress={() => this.openModal(item)}>
                            <Text style={{fontSize: 16}}>Evento: {item.evento}</Text>
                        </TouchableOpacity>
                    }
                />
            </View>
        )
    }
}