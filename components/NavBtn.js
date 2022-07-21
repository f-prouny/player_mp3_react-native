/* eslint-disable prettier/prettier */
import React from 'react';
import { Image, StyleSheet, TouchableHighlight } from 'react-native';


const NavBtn = (props) => {
    console.log(props.icone);
    return (
        <TouchableHighlight onPress={props.action}>
            <Image
                source={{ uri: 'asset:' + props.icone }}
                style={styles.imgIcone}
            />
        </TouchableHighlight>
    )
}
const styles = StyleSheet.create({
    imgIcone: {
        width: 60,
        height: 60,
        borderColor:'black',
        borderRadius:5,
    },
})

export default NavBtn;