import { MaterialTopTabDescriptorMap, MaterialTopTabNavigationEventMap } from "@react-navigation/material-top-tabs/lib/typescript/src/types";
import { NavigationHelpers, ParamListBase, TabNavigationState } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

import styles from "@styles/components/layout/tar-bar-item.scss";
import HomeIcon from "../../assets/navBar/home.svg";
import MagazineIcon from "../../assets/navBar/magazine.svg";
import FeaturesIcon from "../../assets/navBar/features.svg";

interface Props {
  index: number;
  state: TabNavigationState<ParamListBase>;
  descriptors: MaterialTopTabDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, MaterialTopTabNavigationEventMap>;
}

const TabBarItem = ({ index, state, descriptors, navigation }: Props) => {
  // Route data
    const route = state.routes[index];
    const { options } = descriptors[route.key];
    const label = options.tabBarLabel?.toString() || options.title || route.name;

    // Navigate to the tab when it is pressed
    const onPress = () => {
        const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
        });

        if (state.index !== index && !event.defaultPrevented) {
            { /* @ts-ignore */}
            navigation.navigate({ name: route.name, merge: true });
        }
    };

    // Render
    
    let IconComponent: any;

    switch(label) {
        case "Home":
        IconComponent = HomeIcon;
        break;
    case "Magazine":
        IconComponent = MagazineIcon;
        break;
    case "Features":
        IconComponent = FeaturesIcon;
        break;
    }

    return (
        <TouchableOpacity style={styles.item} onPress={onPress}>
        <IconComponent   
                width={24}
                height={24}
            />
        </TouchableOpacity>
    );
};

export default TabBarItem;
