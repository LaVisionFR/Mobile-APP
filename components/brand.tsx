import { View, Text } from "react-native"
import AppIcon from "@assets/brand/icon.svg"
import SettingsIcon from "@assets/brand/settings.svg"

import styles from "@styles/components/brand.scss"

const Brand = () => {

    // helpers 

    const getContainerStyles = () => styles.brand

    const getAppNameStyles = () => styles.appName

    // render

    return (
        <View style={getContainerStyles()}>
            <AppIcon 
                width={48}
                height={48}
            />

            <Text style={getAppNameStyles()}>LaVision</Text>
            <SettingsIcon
                width={24}
                height={24}
                color={"#fff"}
            />
        </View>
    )

}

export default Brand