import axios from 'axios';
import React, { Component } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ActivityIndicator, GestureResponderEvent } from 'react-native';
import userStore from '../../utils/UserStore';
import { LoginProps } from '../../utils/types';
import * as utils from '../../utils/utils';
import { Alert } from 'react-native';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

interface State {
  username: string;
  password: string;
  checked: boolean;
  isLoading: boolean;
}


class Login extends Component<LoginProps, State> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      checked: false,
      isLoading: false,
    };
  }

  handleUsernameChange = (text: string) => {
    this.setState({ username: text });
  }

  handlePasswordChange = (text: string) => {
    this.setState({ password: text });
  }


  toggleCheckbox = () => {
    this.setState((prevState: State) => ({ checked: !prevState.checked }));
  }


  handleLoginPress = (event: GestureResponderEvent) => {
    this.setState({ isLoading: true });
    const data = {
      username: this.state.username,
      password: this.state.password,
    };
    axios.post(utils.BASE_URL + utils.LOGIN, data)
      .then(async (response) => {
        this.setState({ isLoading: false });
        if (response.data.status === '登录成功') {
          userStore.setUsername(this.state.username);
          userStore.setPassword(this.state.password);
          const JSESSIONID = response.data.JSESSIONID;
          const userInfo = await utils.getUserInfo(JSESSIONID);
          userStore.setUserInfo(userInfo);
          // 重新渲染设置页面并跳转
          this.props.navigation.navigate('设置');
          const classInfo = await utils.getClassInfo(JSESSIONID); 
          const gradeInfo = await utils.getGradeInfo(JSESSIONID);
          Promise.all([classInfo, gradeInfo])
            .then((values) => {
              userStore.setClassInfo(values[0]);
              userStore.setGradeInfo(values[1]);
          });
        } else {
          // 弹窗提示登录失败
          Alert.alert('登录失败', response.data.status);
        }
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={{ uri: 'https://tannin-1316822731.cos.ap-nanjing.myqcloud.com/2024-07-06-%E5%9B%BE%E7%89%871.png' }} style={styles.logo} />
        <Text style={styles.title}>登录界面</Text>
        <TextInput
          style={styles.input}
          placeholder="学号"
          value={this.state.username}
          onChangeText={this.handleUsernameChange}
        />
        <TextInput
          style={styles.input}
          placeholder="学校通行证密码"
          value={this.state.password}
          onChangeText={this.handlePasswordChange}
          secureTextEntry
        />
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={this.toggleCheckbox} style={styles.checkbox}>
            {this.state.checked && <View style={styles.checkedBox} />}
          </TouchableOpacity>
          <Text>同意 免责声明、隐私政策等服务条款</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={this.handleLoginPress} disabled={this.state.isLoading}>
          {this.state.isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>登录</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: "100%",
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  captchaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  captchaInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  captchaImage: {
    width: 100,
    height: 40,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    width: 14,
    height: 14,
    backgroundColor: '#000',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Login;