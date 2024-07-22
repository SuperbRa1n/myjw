import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import userStore from '../../utils/UserStore';
import { inject, observer } from 'mobx-react';
import { SettingProps } from '../../utils/types';


@inject('userStore')
@observer
class Setting extends React.Component {
  handleLoginNavigation = () => {
		const { navigation } = this.props as SettingProps;
		navigation.navigate('登录');
	}

	handleLogout = () => {
		userStore.setUsername('');
		userStore.setPassword('');
    userStore.setClassInfo({});
    userStore.setGradeInfo({});
    userStore.setUserInfo({});
    // 重新渲染页面
    this.forceUpdate();
	}

  componentDidMount(): void {
    const { navigation } = this.props as SettingProps;
    navigation.addListener('focus', () => {
      this.forceUpdate();
    });
  }

  render() {
    console.log('Setting rendered');
    console.log(userStore.userInfo);
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.userInfo} onPress={this.handleLoginNavigation}>
          <Image
            style={styles.avatar}
            source={
              userStore.username
                ? { uri: 'https://one.fjsmu.edu.cn/tp_up/resource/image/common/userpic.png' } // 用户头像URL
                : { uri: 'https://one.fjsmu.edu.cn/tp_up/resource/image/common/userpic.png' } // 默认头像
            }
          />
          <Text style={styles.username}>
            {userStore.username ? userStore.userInfo.name + '-' + userStore.userInfo.id + '-' + userStore.userInfo.class : '未登录'}
          </Text>
        </TouchableOpacity>
        <Button title="Logout" onPress={this.handleLogout} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    color: '#333',
  },
});

export default Setting;