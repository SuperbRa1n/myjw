import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  Linking,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SettingProps} from '../../utils/types';
import * as utils from '../../utils/utils';
import axios from 'axios';

interface State {
  username: string;
  password: string;
  userInfo: any;
  classInfo: any;
  gradeInfo: any;
  isAutoRefreshEnabled: boolean;
  isProEnabled: boolean;
  isAutoUpdateEnabled: boolean;
}
class Setting extends React.Component {
  state: State = {
    username: '',
    password: '',
    userInfo: {},
    classInfo: {},
    gradeInfo: {},
    isAutoRefreshEnabled: true,
    isProEnabled: false,
    isAutoUpdateEnabled: false,
  };

  autoRefreshInterval: NodeJS.Timeout | null = null;

  startAutoRefresh = () => {
    // 模拟每日自动刷新数据
    this.autoRefreshInterval = setInterval(() => {
      this.refreshData();
    }, 86400000); // 每24小时刷新一次
  };

  stopAutoRefresh = () => {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
  };

  refreshData = () => {
    const loginData = {
      username: this.state.username,
      password: this.state.password,
    };
    axios
      .post(utils.BASE_URL + utils.LOGIN, loginData)
      .then(async response => {
        if (response.data.status === '登录成功') {
          const JSESSIONID = response.data.JSESSIONID;
          const userInfo = await utils.getUserInfo(JSESSIONID);
          const classInfo = await utils.getClassInfo(JSESSIONID);
          const gradeInfo = await utils.getGradeInfo(JSESSIONID);
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          await AsyncStorage.setItem('classInfo', JSON.stringify(classInfo));
          await AsyncStorage.setItem('gradeInfo', JSON.stringify(gradeInfo));
          this.setState({
            userInfo: userInfo,
            classInfo: classInfo,
            gradeInfo: gradeInfo,
          });
          this.forceUpdate();
        }
      });
      Alert.alert('数据已刷新', '每日自动刷新数据');
  };

  handleLoginNavigation = () => {
    const {navigation} = this.props as SettingProps;
    navigation.navigate('登录');
  };

  handleLogout = () => {
    AsyncStorage.setItem('username', '');
    AsyncStorage.setItem('password', '');
    AsyncStorage.setItem('userInfo', JSON.stringify({}));
    AsyncStorage.setItem('classInfo', JSON.stringify({}));
    AsyncStorage.setItem('gradeInfo', JSON.stringify({}));
    // 重新渲染页面
    this.setState({
      username: '',
      password: '',
      userInfo: {},
      classInfo: {},
      gradeInfo: {},
    });
    this.forceUpdate();
  };

  componentDidMount(): void {
    const {navigation} = this.props as SettingProps;
    navigation.addListener('focus', async () => {
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
      const userInfo = await AsyncStorage.getItem('userInfo');
      const classInfo = await AsyncStorage.getItem('classInfo');
      const gradeInfo = await AsyncStorage.getItem('gradeInfo');
      this.setState({
        username: username ? username : '',
        password: password ? password : '',
        userInfo: userInfo ? JSON.parse(userInfo) : {},
        classInfo: classInfo ? JSON.parse(classInfo) : {},
        gradeInfo: gradeInfo ? JSON.parse(gradeInfo) : {},
      });
      this.forceUpdate();
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={
              this.state.username ? styles.logoutButton : styles.loginButton
            }
            onPress={
              this.state.username
                ? this.handleLogout
                : this.handleLoginNavigation
            }>
            <Text style={styles.logoutText}>
              {this.state.username ? '登出' : '登录'}
            </Text>
          </TouchableOpacity>
          <View style={styles.userInfoContainer}>
            <Image
              style={styles.avatar}
              source={
                this.state.username
                  ? {uri: utils.DEFAULT_AVATAR} // 用户头像URL
                  : {uri: utils.DEFAULT_AVATAR} // 默认头像
              }
            />
            <Text style={styles.name}>
              {this.state.username ? this.state.userInfo.name : '未登录'}
            </Text>
            {this.state.username && (
              <>
                <Text style={styles.info}>{this.state.userInfo.id}</Text>
                <Text style={styles.info}>{this.state.userInfo.class}</Text>
              </>
            )}
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionHeader}>刷新设置</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>每日自动刷新数据</Text>
              <Switch
                value={this.state.isAutoRefreshEnabled}
                onValueChange={value =>
                  this.setState({isAutoRefreshEnabled: value})
                }
              />
            </View>
            <TouchableOpacity onPress={this.refreshData}>
              <View style={styles.settingItem}>
                <Text style={styles.settingText}>立即刷新数据</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.sectionHeader}>其他</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>服务条款</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>关于我们</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>前往项目网站</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>付款码</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200, // 设置一定的高度
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'center', // 确保内容居中
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    position: 'relative',
    borderRadius: 20,
  },
  userInfoContainer: {
    alignItems: 'center',
  },
  loginButton: {
    padding: 10,
    backgroundColor: '#17a8f9',
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#ff5c5c',
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  settingsContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 10,
  },
  settingText: {
    fontSize: 16,
  },
});

export default Setting;
