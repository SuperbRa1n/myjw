import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CourseDetailProps} from '../../utils/types';

interface State {
  classItem: any[];
  gradeItem: any;
  classInfo: any[];
  gradeInfo: any[];
  isSjk: boolean;
}

class CourseDetail extends Component<CourseDetailProps, State> {
  state: State = {
    classItem: [],
    gradeItem: {},
    classInfo: [],
    gradeInfo: [],
    isSjk: false,
  };

  async componentDidMount() {
    const {route} = this.props;
    const courseName = route.params.courseName;

    const classInfoStr = await AsyncStorage.getItem('classInfo');
    const gradeInfoStr = await AsyncStorage.getItem('gradeInfo');

    if (classInfoStr && gradeInfoStr) {
      const classInfo = JSON.parse(classInfoStr);
      const gradeInfo = JSON.parse(gradeInfoStr);

      let classItem: any = [];
      let gradeItem: any = {};

      for (const item of classInfo) {
        if (item.kbList.length > 0) {
          for (const course of item.kbList) {
            if (course.kcmc === courseName) {
							console.log(course);
              classItem.push(course);
            }
          }
        }
      }

      if (classItem.length === 0) {
        for (const item of classInfo) {
          if (item.sjkList.length > 0) {
            for (const course of item.sjkList) {
              if (course.kcmc === courseName) {
								console.log(course);
                classItem.push(course);
              }
            }
          }
        }
        this.setState({isSjk: true});
      }

      for (const item of gradeInfo) {
        if (item.items.length > 0) {
          for (const course of item.items) {
            if (course.kcmc === courseName) {
              gradeItem = course;
              break;
            }
          }
        }
      }

      this.setState({classItem, gradeItem});
    }
  }

	getData = async () => {
		const {route} = this.props;
    const courseName = route.params.courseName;

    const classInfoStr = await AsyncStorage.getItem('classInfo');
    const gradeInfoStr = await AsyncStorage.getItem('gradeInfo');

    if (classInfoStr && gradeInfoStr) {
      const classInfo = JSON.parse(classInfoStr);
      const gradeInfo = JSON.parse(gradeInfoStr);

      let classItem: any = [];
      let gradeItem: any = {};

      for (const item of classInfo) {
        if (item.kbList.length > 0) {
          for (const course of item.kbList) {
            if (course.kcmc === courseName) {
							console.log(course);
              classItem.push(course);
            }
          }
        }
      }

      if (classItem.length === 0) {
        for (const item of classInfo) {
          if (item.sjkList.length > 0) {
            for (const course of item.sjkList) {
              if (course.kcmc === courseName) {
								console.log(course);
                classItem.push(course);
              }
            }
          }
        }
        this.setState({isSjk: true});
      }
      for (const item of gradeInfo) {
        if (item.items.length > 0) {
          for (const course of item.items) {
            if (course.kcmc === courseName) {
              gradeItem = course;
              break;
            }
          }
        }
      }

      this.setState({classItem, gradeItem});
    }
	}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>基本信息</Text>
        <View style={styles.section}>
          <View style={styles.infoItem}>
            <View style={styles.iconRow}>
              <Icon name="book" size={20} color="#74c6f7" />
              <Text style={styles.courseName}>
                {this.state.classItem.length > 0
                  ? this.state.classItem[0].kcmc
                  : ''}
              </Text>
            </View>
            <Text style={styles.courseDetail}>
              <Icon name="key" size={16} color="#666" /> 课号:{' '}
              {this.state.gradeItem ? this.state.gradeItem.jxbmc : '未知，出成绩后可获取'}
            </Text>
            <Text style={styles.courseDetail}>
              <Icon name="person" size={16} color="#666" /> 教师:{' '}
              {this.state.classItem.length > 0 ? (this.state.isSjk
                ? this.state.classItem[0].jsxm
                : this.state.classItem[0].xm) : ''}
            </Text>
            <Text style={styles.courseDetail}>
              <Icon name="school" size={16} color="#666" /> 学分:{' '}
              {this.state.classItem.length > 0 ? this.state.classItem[0].xf : ''}
            </Text>
            {this.state.gradeItem ? (
              <Text style={styles.courseDetail}>
                <Icon name="star" size={16} color="#f44336" /> 成绩:{' '}
                {this.state.gradeItem.bfzcj}/{this.state.gradeItem.jd}
              </Text>
            ) : null}
          </View>
        </View>
        <Text style={styles.sectionTitle}>课时</Text>
        <View style={styles.section}>
          <FlatList
            data={this.state.classItem}
            renderItem={({item}) => (
              <View style={styles.infoItem}>
                <Text>
                  <Icon name="calendar" size={16} color="#f44336" />{' '}
                  {this.state.isSjk ? item.qsjsz : item.xqjmc + ' ' + item.jc}
                </Text>
                <Text>
                  <Icon name="location" size={16} color="#666" /> 地点:{' '}
                  {this.state.isSjk ? item.qtkcgs.split('/').pop() : item.cdmc}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoItem: {
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 5,
  },
  courseDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
});

export default CourseDetail;
