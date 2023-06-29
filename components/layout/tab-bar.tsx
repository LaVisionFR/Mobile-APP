import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs"
import { SafeAreaView, View } from "react-native"
import styles from "@styles/components/layout/tab-bar.scss"
import TabBarItem from "./tab-bar-item"

const TabBar = (
    {
        state,
        descriptors,
        navigation
    }: MaterialTopTabBarProps
) => {

    // render

    return (
        <SafeAreaView style={styles.container}>
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