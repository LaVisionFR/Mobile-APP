import styles from "@styles/components/group.scss"
import { View, StyleProp } from "react-native"

interface Props {
    children: any
    style?: StyleProp<any>;
}

const Group = (
    {  
        children,
        style
    }: Props
) => {

    // utils

    const getStyles = () => {
        let s = styles.container
        if(style) s = { ...s, ...style }
        return s
    }

    // render

    return (
        <View style={getStyles()} >
            {children}
        </View>
    )
}

export default Group