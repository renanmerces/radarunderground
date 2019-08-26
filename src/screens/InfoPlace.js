import React from 'react'
import {View, Text, FlatList} from 'react-native'
import moment from 'moment'
import 'moment/locale/pt-br'

export default props => 
    <View>
        <Text>{props.navigation.getParam('place')}</Text>
        <FlatList
            data={props.navigation.getParam('events')}
            keyExtractor={(_, index) => `${index}`}
            renderItem={({item}) => 
                <View>
                    <Text>Evento: {item.evento}</Text>
                    <Text>Data: {moment(item.data).locale('pt-br').format('DD/MM/YYYY')}</Text>
                </View>
            }
        />
    </View>