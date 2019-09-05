import React, {Component} from 'react'
import {View, Text, FlatList, TouchableOpacity, TouchableWithoutFeedback, Alert} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import haversine from 'haversine'
import { Rating } from 'react-native-ratings'
import InfoEvent from '../modals/InfoEvent'
import RatingPlace from '../modals/RatingPlace'
import firebase from 'react-native-firebase'

export default class InfoPlace extends Component
{ 
    constructor(props){
        super(props)
        this.state = {
            dia: 0,
            showModal: false,
            infoModalVisible: false,
            place: '',
            somaNotas: 0,
            qtdNotas: 0,
            id: 0,
            itemInfo: {
                evento: '',
                local: '',
                data: ''
            },
            ratingModalVisible: false,
        }
    }

    componentDidMount = () => {
        this.setState({
            id: this.props.navigation.getParam('id'),
            place: this.props.navigation.getParam('place'),
            qtdNotas: this.props.navigation.getParam('qtdNotas'),
            somaNotas: this.props.navigation.getParam('somaNotas')
        })
    }

    currentRating(qtdNotas, somaNotas){
        const media = somaNotas/qtdNotas

        if(qtdNotas == 0) return null
        else if(media >= 1 && media < 2) return <Text>Avaliação: {media.toFixed(2)}/5 (Péssimo)</Text>
        else if(media >= 2 && media < 3) return <Text>Avaliação: {media.toFixed(2)}/5 (Ruim)</Text>
        else if(media >= 3 && media < 4) return <Text>Avaliação: {media.toFixed(2)}/5 (Ok)</Text>
        else if(media >= 4 && media < 5) return <Text>Avaliação: {media.toFixed(2)}/5 (Bom)</Text>
        else if(media == 5) return <Text>Avaliação: {media}/5 (Excelente)</Text>
    }

    openInfoModal = item => {
        this.setState({
            itemInfo: {
                evento: item.evento,
                local: this.state.place,
                data: item.data
            },
            infoModalVisible: true
        })
    }

    closeInfoModal = () => {
        this.setState({infoModalVisible: false})
    }

    openRatingModal = () => {
        this.setState({
            ratingModalVisible: true
        })
    }

    closeRatingModal = () => {
        this.setState({ratingModalVisible: false})
    }

    updateNota = nota => {
        this.setState({ratingModalVisible: false})
        let novaSomaNotas = this.state.somaNotas + nota
        let novaQtdNotas = this.state.qtdNotas + 1
        firebase.database()
            .ref(`/locais/${this.state.id}`)
            .update({
                qtdNotas: novaQtdNotas,
                somaNotas: novaSomaNotas
            })
            .then(() => this.setState({
                qtdNotas: novaQtdNotas,
                somaNotas: novaSomaNotas
            }))
            .then(() => Alert.alert('Opa', 'Deu bom'))
            .catch(() => Alert.alert('Ops', 'Deu ruim'))
    }

    render(){

        let media = this.state.qtdNotas > 0 ? this.state.somaNotas/this.state.qtdNotas : null

        return(
            <View>
                <InfoEvent 
                    infoModalVisible={this.state.infoModalVisible} 
                    modalClose={() => this.closeInfoModal()}
                    item={this.state.itemInfo}    
                />

                <RatingPlace 
                    ratingModalVisible={this.state.ratingModalVisible} 
                    updateNota={this.updateNota}
                    modalClose={() => this.closeRatingModal()}
                />
                
                <Text style={{fontSize: 20}}>{this.state.place}</Text>
                
                { 
                    media ?
                    <TouchableWithoutFeedback onPress={() => this.openRatingModal()}>
                        <View style={{alignItems: 'center'}} >
                            <Rating
                                type='custom'
                                ratingColor='yellow'
                                ratingBackgroundColor='#c8c7c8'
                                ratingCount={5}
                                startingValue={media}
                                imageSize={30}
                                readonly={true}
                                style={{ paddingVertical: 10 }}
                            />
                            { this.currentRating(this.state.qtdNotas, this.state.somaNotas) }     
                            <Text>Clique para avaliar</Text>  
                        </View>               
                    </TouchableWithoutFeedback> 
                    :
                    <TouchableWithoutFeedback onPress={() => this.openRatingModal()}>
                        <View style={{alignItems: 'center'}} >
                            <Rating
                                type='custom'
                                ratingColor='yellow'
                                ratingBackgroundColor='#c8c7c8'
                                ratingCount={5}
                                startingValue={0}
                                imageSize={30}
                                readonly={true}
                                style={{ paddingVertical: 10 }}
                            />
                            <Text>Local não avaliado</Text>    
                            <Text>Clique para avaliar</Text> 
                        </View>                
                    </TouchableWithoutFeedback>
                }
                
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
                        <TouchableOpacity style={{margin: 10, padding: 10}} onPress={() => this.openInfoModal(item)}>
                            <Text style={{fontSize: 16}}>Evento: {item.evento}</Text>
                        </TouchableOpacity>
                    }
                />
            </View>
        )
    }
}