import { View, TouchableOpacity, StyleProp, Text, Image, Linking } from "react-native";

import styles from "@styles/components/card.scss";
import { Key } from "react";

interface Props {
    artist?: string;
    imgArtist?: any;
    subArtist?: string;
    spotifyUrl?: string;
    style?: StyleProp<any>;
}

const Card = ({
    artist,
    imgArtist,
    subArtist,
    spotifyUrl,
    style
}: Props) => {
    // utils
    const getStyles = () => {
        let s = styles.card;
        if (style) s = { ...s, ...style };
        return s;
    }

    const getComponentStyles = (component: string) => {
        let s = styles[component];
        return s;
    }

    const handlePress = () => {
        if (spotifyUrl) Linking.openURL(spotifyUrl);
    };

    // render
    return (
        <View style={getStyles()} >
            {imgArtist && (
                <Image
                    style={getComponentStyles("imgArtist")}
                    source={{
                        uri: imgArtist,
                    }}
                />
            )}
            {artist && <Text style={getComponentStyles("nameArtist")}>{artist}</Text>}
            {subArtist && (
                <Text 
                    numberOfLines={1} 
                    style={getComponentStyles("auditeur")}
                >
                    {subArtist}
                </Text>
            )}
            {spotifyUrl && (
                <TouchableOpacity 
                    onPress={handlePress}>
                    <Text 
                        style={getComponentStyles("spotify")} 
                        numberOfLines={1}>
                            Voir sur Spotify
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

export default Card;
