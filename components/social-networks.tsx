import { View, TouchableOpacity, StyleProp, Linking } from "react-native";

import styles from "@styles/components/social.scss";

import TwitterIcon from "../assets/social/twitter.svg";
import InstagramIcon from "../assets/social/instagram.svg";
import SpotifyIcon from "../assets/social/spotify.svg";

interface Props {
    name: string;
    url: string;
    style?: StyleProp<any>;
}

const Socialnetworks = ({
    name,
    url,
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

    let IconComponent: any;

    switch(name) {
        case "Twitter":
        IconComponent = TwitterIcon;
        break;
    case "Instagram":
        IconComponent = InstagramIcon;
        break;
    case "Spotify":
        IconComponent = SpotifyIcon;
        break;
    }

    // render
    return (
        <View style={getStyles()} >
            <TouchableOpacity 
                onPress={() => Linking.openURL(url)}
                style={getComponentStyles("socialWrapper")}> 
                <IconComponent  
                    style={getComponentStyles("socialIcon")} 
                    width={32}
                    height={32}
                />
            </TouchableOpacity>
           
        </View>
    );
}

export default Socialnetworks;
