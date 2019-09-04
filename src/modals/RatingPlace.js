import React, {Component} from 'react'
import {Text, Modal, View, TouchableHighlight, Dimensions, Button, Alert} from 'react-native'
import { AirbnbRating  } from 'react-native-ratings'

export default class RatingPlace extends Component 
{
    constructor(props){
        super(props)
        state = {
            nota: 3
        }
    }

    ratingCompleted = rating => {
        this.setState({nota: rating})
    }

    render()
    {
        return(
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.ratingModalVisible}
                onRequestClose={this.props.modalClose}>
                <View style={{flex: 1}}>
                    <TouchableHighlight style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}} onPress={this.props.modalClose}>
                        <View style={{flex: 1}}></View>
                    </TouchableHighlight>
                    <View style={{
                        height: Dimensions.get('window').height * 2/3, 
                        marginTop: 22, 
                        backgroundColor: '#FFF', 
                        justifyContent: 'center', 
                        alignItems: 'center'
                    }}>
                        <View>
                            <Text>Avaliar</Text>
                            <AirbnbRating 
                                count={5}
                                reviews={["Péssimo", "Ruim", "Ok", "Bom", "Excelente"]}
                                defaultRating={3}
                                size={50}
                                onFinishRating={this.ratingCompleted}
                            />
                        </View>
                        
                        <Button
                            style={{margin: 10, padding: 10}} 
                            title='Confirmar'
                            onPress={() => this.props.updateNota(this.state.nota)}/>
                        <Button
                            style={{margin: 10, padding: 10}} 
                            title='Voltar'
                            onPress={this.props.modalClose}/>
                    </View>
                    <TouchableHighlight style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}} onPress={this.props.modalClose}>
                        <View style={{flex: 1}}></View>
                    </TouchableHighlight>
                </View>
            </Modal>
        )
    }
}