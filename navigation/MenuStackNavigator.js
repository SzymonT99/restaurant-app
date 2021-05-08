import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { CategoryScreen } from "../screens/CategoryScreen";
import { MenuScreen } from "../screens/MenuScreen";
import { DetailsScreen } from "../screens/DetailsScreen";

const Stack = createStackNavigator();

const MenuStackNavigator = () => {

    return (
        <Stack.Navigator 
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name='Category' component={CategoryScreen} 
             unmountOnBlur={true} options={{ unmountOnBlur: true}}/>
            <Stack.Screen name='Menu' component={MenuScreen} 
             unmountOnBlur={true} options={{ unmountOnBlur: true}}/>
            <Stack.Screen name='Details' component={DetailsScreen} 
             unmountOnBlur={true} options={{ unmountOnBlur: true}}/>
        </Stack.Navigator>
    );
};

export { MenuStackNavigator };
