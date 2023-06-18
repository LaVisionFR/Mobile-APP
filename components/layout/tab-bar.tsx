import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs"
import { SafeAreaView } from "react-native"

import styles from "@styles/components/layout/tab-bar.scss"
import TabBarItem from "./tab-bar-item"
import { View , ImageBackground} from "react-native"



const TabBar = (
    {
        state,
        descriptors,
        navigation
    }: MaterialTopTabBarProps
) => {

    // render

    return (
        <SafeAreaView style={{...styles.container, ...styles.wave}}>
          {state.routes.map((route, index) => (
            <TabBarItem
              key={route.key}
              index={index}
              descriptors={descriptors}
              state={state}
              navigation={navigation}
            />
          ))}
        </SafeAreaView>
    );



}

export default TabBar