import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
	'登录': undefined;
	'首页': undefined;
	'日程': undefined;
	'学业': undefined;
	'设置': undefined;
	TabNavigator: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, '登录'>;
export type LoginScreenRouteProp = RouteProp<RootStackParamList, '登录'>;
export type LoginProps = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, '首页'>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, '首页'>;
export type HomeProps = {
	navigation: HomeScreenNavigationProp;
	route: HomeScreenRouteProp;
};

export type ScheduleScreenNavigationProp = StackNavigationProp<RootStackParamList, '日程'>;
export type ScheduleScreenRouteProp = RouteProp<RootStackParamList, '日程'>;
export type ScheduleProps = {
	navigation: ScheduleScreenNavigationProp;
	route: ScheduleScreenRouteProp;
};

export type StudyScreenNavigationProp = StackNavigationProp<RootStackParamList, '学业'>;
export type StudyScreenRouteProp = RouteProp<RootStackParamList, '学业'>;
export type StudyProps = {
	navigation: StudyScreenNavigationProp;
	route: StudyScreenRouteProp;
};

export type SettingScreenNavigationProp = StackNavigationProp<RootStackParamList, '设置'>;
export type SettingScreenRouteProp = RouteProp<RootStackParamList, '设置'>;
export type SettingProps = {
	navigation: SettingScreenNavigationProp;
	route: SettingScreenRouteProp;
};
