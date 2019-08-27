import React, {Component} from 'react'
import {View, Text, FlatList, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import haversine from 'haversine'

export default class InfoPlace extends Component
{ 
    constructor(props){
        super(props)
        this.state = {
            dia: 0,
        }
    }

    render(){
        return(
            <View>
                <Text style={{fontSize: 20}}>{this.props.navigation.getParam('place')}</Text>
                <Text>Distância da sua localização atual: {Number(haversine(this.props.navigation.getParam('myLocation'), this.props.navigation.getParam('placeLocation'), {unit: 'meter'})/1000).toFixed(2)} km</Text>
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
                <FlatList
                    data={this.props.navigation.getParam('events').filter(event => moment(event.data).startOf('day').diff(moment().startOf('day').add(this.state.dia, 'days'), 'days') == 0)}
                    keyExtractor={(_, index) => `${index}`}
                    renderItem={({item}) => 
                        <View>
                            <Text style={{fontSize: 16}}>Evento: {item.evento}</Text>
                        </View>
                    }
                />
            </View>
        )
    }
}