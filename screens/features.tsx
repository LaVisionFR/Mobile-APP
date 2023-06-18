import Brand from "@components/brand"
import ScreenContainer from "@components/screen-container"
import { View, ScrollView } from "react-native"

import { ScreenProps } from "@utils/types"

import styles from "@styles/screens/features.scss"
import Block from "@components/block"

const Features = ({ navigation }: ScreenProps) => {

    // render

    return (
        <ScreenContainer style={styles.screen}>
            <Brand />
            <View style={styles.container}>
                <Block
                    icon={"Shuffle"}
                    title={"Fais-moi découvrir une pépite "}
                    onPress={() => { 
                        /* @ts-ignore */ 
                        navigation.navigate('Shuffle');
                    }} 
                />
                

                { /* @ts-ignore */}
                <Block  
                    icon={"Micro"} 
                    title={"Deviens la voix de ton rappeur !"}       
                    onPress={() => {
                        /* @ts-ignore */ 
                        navigation.navigate('Ia');
                    }} 
                />
            </View>
        </ScreenContainer>
    )

}

export default Features