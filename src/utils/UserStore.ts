import { observable, action } from 'mobx';

class UserStore {
  @observable username: string = '';
	@observable password: string = '';
	@observable classInfo: any = {};
	@observable gradeInfo: any = {};
	@observable userInfo: any = {};

  @action 
	setUsername(username: string) {
    this.username = username;
  }

	@action 
	setPassword(password: string) {
		this.password = password;
	}

	@action
	setClassInfo(classInfo: any) {
		this.classInfo = classInfo;
	}

	@action
	setGradeInfo(gradeInfo: any) {
		this.gradeInfo = gradeInfo;
	}

	@action
	setUserInfo(userInfo: any) {
		this.userInfo = userInfo;
	}
}

const userStore = new UserStore();
export default userStore;
