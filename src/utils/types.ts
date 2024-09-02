import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
	'登录': undefined;
	'首页': undefined;
	'日程': undefined;
	'学业': undefined;
	'设置': undefined;
	'成绩': undefined;
	'课表': undefined;
	'课程详情': { courseName: string };
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

export type GradeScreenNavigationProp = StackNavigationProp<RootStackParamList, '成绩'>;
export type GradeScreenRouteProp = RouteProp<RootStackParamList, '成绩'>;
export type GradeProps = {
	navigation: GradeScreenNavigationProp;
	route: GradeScreenRouteProp;
};

export type CourseDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, '课程详情'>;
export type CourseDetailScreenRouteProp = RouteProp<RootStackParamList, '课程详情'>;
export type CourseDetailProps = {
	navigation: CourseDetailScreenNavigationProp;
	route: CourseDetailScreenRouteProp;
};

export type TimetableScreenNavigationProp = StackNavigationProp<RootStackParamList, '课表'>;
export type TimetableScreenRouteProp = RouteProp<RootStackParamList, '课表'>;
export type TimetableProps = {
	navigation: TimetableScreenNavigationProp;
	route: TimetableScreenRouteProp;
};