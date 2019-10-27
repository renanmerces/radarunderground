import React, {Component} from 'react'
import {ScrollView, View, Text, StyleSheet,TouchableOpacity} from 'react-native'
import {DrawerItems} from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome'

class Menu extends Component {

    logout = async () => {
        try {
            await firebase.auth().signOut();
            this.props.navigation.navigate('Loading')
        } catch (e) {
            console.log(e)
        }    
    }

    render()
    {
        return(
            <ScrollView>
                <View style={styles.menuList}>
                    <DrawerItems {...this.props}></DrawerItems>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity onPress={this.logout}>
                        <View style={styles.logoutIcon}>
                            <Text style={styles.logout}>Sair </Text><Icon name='sign-out' size={30} color='#800'></Icon>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    menu: {
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    menuList: {
        flex: 1
    },
    userInfo:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    footer:{
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#DDD',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    logoutIcon:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 20
    },
    logout:{
        fontSize: 20
    }
})

export default Menu