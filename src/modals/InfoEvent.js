import React from 'react'
import {Modal, Text, TouchableHighlight, View, Button, Dimensions} from 'react-native'
import moment from 'moment'
import 'moment/locale/pt-br'

export default props => 
    <Modal
        animationType="slide"
        transparent={false}
        visible={props.infoModalVisible}
        onRequestClose={props.modalClose}>
        <View style={{flex: 1}}>
            <TouchableHighlight style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}} onPress={props.modalClose}>
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
                    <Text style={{fontSize: 18, margin: 10, padding: 10}}>{props.item.evento}</Text>
                    <Text style={{margin: 10, padding: 10}}>Local: {props.item.local}</Text>
                    <Text style={{margin: 10, padding: 10}}>Data: {moment(props.item.data).locale('pt-br').format('DD/MM/YYYY')}</Text>
                    <Text style={{margin: 10, padding: 10}}>Atrações: X</Text>
                    <Text style={{margin: 10, padding: 10}}>Valor: Y</Text>
                </View>
                <Button
                    style={{margin: 10, padding: 10}} 
                    title='Voltar'
                    onPress={props.modalClose}/>
            </View>
            <TouchableHighlight style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}} onPress={props.modalClose}>
                <View style={{flex: 1}}></View>
            </TouchableHighlight>
        </View>
    </Modal>

