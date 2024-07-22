import React from "react";
import { StyleSheet } from "react-native";
import 'react-native-gesture-handler';
import Login from "./src/pages/login/login";
import Home from "./src/pages/Home/home";
import Schedule from "./src/pages/schedule/schedule";
import Setting from "./src/pages/setting/setting";
import Study from "./src/pages/study/study";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/Ionicons';
import userStore from './src/utils/UserStore';
import { Provider } from "mobx-react";
import { RootStackParamList } from "./src/utils/types";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen 
      name="首页" 
      component={Home} 
      options={{  
        tabBarLabel: '首页', 
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen 
      name="日程" 
      component={Schedule} 
      options={{  
        tabBarLabel: '日程', 
        tabBarIcon: ({ color, size }) => (
          <Icon name="calendar" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="学业" 
      component={Study} 
      options={{  
        tabBarLabel: '学业', 
        tabBarIcon: ({ color, size }) => (
          <Icon name="school-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="设置" 
      component={Setting}
      options={{  
        tabBarLabel: '设置', 
        tabBarIcon: ({ color, size }) => (
          <Icon name="settings" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

class App extends React.Component {
  render() {
    return (
      <Provider userStore={userStore}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="TabNavigator">
            <Stack.Screen 
              name="登录" 
              component={Login} 
            />
            <Stack.Screen 
              name="TabNavigator" 
              component={TabNavigator} 
              options={{ headerShown: false }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});

export default App;
