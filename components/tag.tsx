import { View, TouchableOpacity, StyleProp, Text, Image, Linking } from "react-native";

import styles from "@styles/components/tag.scss";

interface Props {
    name?: string;
    nameSection?: string;
    style?: StyleProp<any>;
}

const Tag = ({
    name,
    nameSection,
    style
}: Props) => {
    // utils
    const getStyles = () => {
        let s = styles.container;
        if (style) s = { ...s, ...style };
        return s;
    }

    const getComponentStyles = (component: string) => {
        let s = styles[component];
        return s;
    }

    // render
    return (
        <View style={getStyles()} >
            {name && (
                <TouchableOpacity style={getComponentStyles("tagWrapper")}> 
                    <Text style={getComponentStyles("tagName")} numberOfLines={1}>
                        {name}
                    </Text>
                </TouchableOpacity>
            )}
            { nameSection && (
                <Text style={styles.section}>{ nameSection }</Text>
            )}
        </View>
    );
}

export default Tag;
