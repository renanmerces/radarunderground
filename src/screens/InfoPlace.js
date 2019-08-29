import React, {Component} from 'react'
import {View, Text, FlatList, TouchableOpacity, Alert, Modal} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import haversine from 'haversine'
import { Rating } from 'react-native-ratings'

export default class InfoPlace extends Component
{ 
    constructor(props){
        super(props)
        this.state = {
            dia: 0,
            showModal: false
        }
    }

    ratingCompleted(rating) {
        Alert.alert('Opa', 'Enviar sua nota? (Nota: ' + rating + ')')
    }

    currentRating(qtdNotas, somaNotas){
        const media = somaNotas/qtdNotas

        if(qtdNotas == 0) return <Text>Local não avaliado</Text>
        else if(media >= 0 && media < 1) return <Text>Avaliação: {media}/5 (Péssimo)</Text>
        else if(media >= 1 && media < 2) return <Text>Avaliação: {media}/5 (Ruim)</Text>
        else if(media >= 2 && media < 3) return <Text>Avaliação: {media}/5 (Ok)</Text>
        else if(media >= 3 && media < 4) return <Text>Avaliação: {media}/5 (Bom)</Text>
        else if(media >= 4 && media < 5) return <Text>Avaliação: {media}/5 (Excelente)</Text>
        else if(media == 5) return <Text>Avaliação: {media}/5 (Perfeito)</Text>
    }

    render(){
        return(
            <View>
                
                <Text style={{fontSize: 20}}>{this.props.navigation.getParam('place')}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    {   this.currentRating(this.props.navigation.getParam('qtdNotas'), this.props.navigation.getParam('somaNotas'))
                    }
                </View>
                
                <View style={{alignItems: 'center'}}>
                    <Rating
                        type='custom'
                        ratingColor='yellow'
                        ratingBackgroundColor='#c8c7c8'
                        ratingCount={5}
                        startingValue={0}
                        imageSize={30}
                        onFinishRating={this.ratingCompleted}
                        style={{ paddingVertical: 10 }}
                    />
                    <Text>Arraste para avaliar</Text>
                </View>
                
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