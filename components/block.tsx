import { Pressable, StyleProp, Text, View } from "react-native"

import ShuffleIcon from "../assets/features/shuffle.svg"
import MicroIcon from "../assets/features/micro.svg"

import { useNavigation } from '@react-navigation/native';

import styles from "@styles/components/block.scss"
import { useState } from "react";

interface Props {
    title?: string;
    style?: StyleProp<any>;
    icon?: string;
    onPress: () => void;
}

const Block = (
    {
        title,
        style,
        icon,
        onPress
    }: Props
) => {

    // utils
    
    const getStyles = () => {
        let s = { ...styles.button }
        if(style) s = { ...s, ...style }
        return s
    }

    // state

    const [buttonStyles, setButtonStyles] = useState(getStyles())

    // handlers

    const onPressIn = () => setButtonStyles({ ...buttonStyles, ...styles["Pressed"] })
    const onPressOut = () => setButtonStyles(getStyles())

    let IconComponent: any;

    switch(icon) {
        case "Shuffle":
            IconComponent = ShuffleIcon;
        break;
        case "Micro":
            IconComponent = MicroIcon;
        break;
    }

    // render

    return (
        <Pressable
            style={buttonStyles}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPress}>
            
            <View style={styles.background} >

                <IconComponent
                    style={styles.icon}
                    width={72}
                    height={72}
                />
            
                <Text style={styles.title}>{title}</Text>
            </View>
        </Pressable>
    )
}

export default Block