import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StudyProps} from '../../utils/types';

interface State {
  classInfo: any[];
  gradeInfo: any[];
  selectedTerm: string;
  termSwitcher: string[];
  totalCredit: number;
  totalGrade: number;
  yearCredit: number;
  yearGrade: number;
  xueqiCredit: number;
  xueqiGrade: number;
  totalBaiFenZhi: number;
  xueqiBaiFenZhi: number;
  isTermSet: boolean;
  xueqiKeChengXueFen: number;
}

class Study extends Component {
  state: State = {
    classInfo: [],
    gradeInfo: [],
    selectedTerm: '',
    termSwitcher: [],
    totalCredit: 0,
    totalGrade: 0,
    yearCredit: 0,
    yearGrade: 0,
    xueqiCredit: 0,
    xueqiGrade: 0,
    totalBaiFenZhi: 0,
    xueqiBaiFenZhi: 0,
    isTermSet: false,
    xueqiKeChengXueFen: 0,
  };

  interval: any;

  async componentDidMount() {
    const classInfo = await AsyncStorage.getItem('classInfo');
    const gradeInfo = await AsyncStorage.getItem('gradeInfo');
    this.setState({
      classInfo: classInfo === '{}' ? [] : JSON.parse(classInfo ? classInfo : '[]'),
      gradeInfo: gradeInfo === '{}' ? [] : JSON.parse(gradeInfo ? gradeInfo : '[]'),
    });
    // 遍历classInfo，生成termSwitcher
    const termSwitcher: any = [];
    this.state.classInfo.forEach(item => {
      if (item.kbList.length > 0) {
        const xnm = item.xsxx.XNMC;
        const xqm = item.xsxx.XQM == '3' ? '秋冬' : '春夏';
        const term = `${xnm}${xqm}`;
        if (!termSwitcher.includes(term)) {
          termSwitcher.push(term);
        }
      }
    });
    // 将termSwitcher进行倒置
    termSwitcher.reverse();
    this.setState({
      termSwitcher: Array.from(new Set(termSwitcher)),
    });
    if (!this.state.isTermSet) {
      this.setState({isTermSet: true, selectedTerm: termSwitcher[0]});
      this.selectTerm(this.state.termSwitcher[0]);
    }
    // 遍历gradeInfo，计算总学分、总绩点、年度学分、年度绩点
    let totalItems: any = [];
    let yearItems: any = [];
    let xueqiItems: any = [];
    this.state.gradeInfo.forEach(item => {
      let items = item.items;
      if (items.length > 0) {
        items.forEach((item: any) => {
          totalItems.push(item);
          if (item.xnmmc === this.state.selectedTerm.substring(0, 9)) {
            yearItems.push(item);
            if (
              (item.xqmmc === '1' &&
                this.state.selectedTerm.substring(9, 11) === '秋冬') ||
              (item.xqmmc === '2' &&
                this.state.selectedTerm.substring(9, 11) === '春夏')
            ) {
              xueqiItems.push(item);
            }
          }
        });
      }
    });
    this.setState({
      totalCredit: this.calculateCredit(totalItems),
      totalGrade: this.calculateGPA(totalItems),
      yearCredit: this.calculateCredit(yearItems),
      yearGrade: this.calculateGPA(yearItems),
      xueqiCredit: this.calculateCredit(xueqiItems),
      xueqiGrade: this.calculateGPA(xueqiItems),
      totalBaiFenZhi: this.calculateBaiFenZhi(totalItems),
      xueqiBaiFenZhi: this.calculateBaiFenZhi(xueqiItems),
    });
    // 时刻监测信息变化
    this.interval = setInterval(async () => {
      const classInfo = await AsyncStorage.getItem('classInfo');
      const gradeInfo = await AsyncStorage.getItem('gradeInfo');
      this.setState({
        classInfo: classInfo === '{}' ? [] : JSON.parse(classInfo ? classInfo : '[]'),
        gradeInfo: gradeInfo === '{}' ? [] : JSON.parse(gradeInfo ? gradeInfo : '[]'),
      });
      console.log(this.state.classInfo);
      if (this.state.classInfo.length > 0) {
        this.forceUpdate();
      }
    }, 500);
  }

  componentDidUpdate() {
    if (this.state.classInfo.length > 0) {
      clearInterval(this.interval);
    }
  }

  selectTerm = (term: string) => {
    this.setState({selectedTerm: term});
    // 遍历gradeInfo，计算总学分、总绩点、年度学分、年度绩点
    let totalItems: any = [];
    let yearItems: any = [];
    let xueqiItems: any = [];
    this.state.gradeInfo.forEach(item => {
      let items = item.items;
      if (items.length > 0) {
        items.forEach((item: any) => {
          totalItems.push(item);
          if (item.xnmmc === term.substring(0, 9)) {
            yearItems.push(item);
            if (
              (item.xqmmc === '1' &&
                term.substring(9, 11) === '秋冬') ||
              (item.xqmmc === '2' &&
                term.substring(9, 11) === '春夏')
            ) {
              xueqiItems.push(item);
            }
          }
        });
      }
    });
    this.setState({
      totalCredit: this.calculateCredit(totalItems),
      totalGrade: this.calculateGPA(totalItems),
      yearCredit: this.calculateCredit(yearItems),
      yearGrade: this.calculateGPA(yearItems),
      xueqiCredit: this.calculateCredit(xueqiItems),
      xueqiGrade: this.calculateGPA(xueqiItems),
      totalBaiFenZhi: this.calculateBaiFenZhi(totalItems),
      xueqiBaiFenZhi: this.calculateBaiFenZhi(xueqiItems),
    });
  };

  // 计算GPA
  calculateGPA = (grade: any) => {
    let totalCredit = 0;
    let totalGrade = 0;
    grade.forEach((item: any) => {
      totalCredit += parseFloat(item.xf);
      totalGrade += parseFloat(item.xf) * parseFloat(item.jd);
    });
    return (totalGrade / totalCredit);
  };

  // 计算学分
  calculateCredit = (grade: any) => {
    let totalCredit = 0;
    grade.forEach((item: any) => {
      totalCredit += parseFloat(item.xf);
    });
    return totalCredit;
  };

  // 计算百分制
  calculateBaiFenZhi = (grade: any) => {
    let totalCredit = 0;
    let totalGrade = 0;
    grade.forEach((item: any) => {
      totalCredit += parseFloat(item.xf);
      totalGrade += parseFloat(item.xf) * parseFloat(item.bfzcj);
    });
    return (totalGrade / totalCredit);
  };

  // 计算学分
  calculateXueFen = (classItem: any) => {
    let totalXueFen = 0;
    let allCourse: any = [];
    classItem.forEach((item: any) => {
      if (!allCourse.includes(item.kcmc)) {
        allCourse.push(item.kcmc);
        totalXueFen += parseFloat(item.xf);
      }
    });
    return totalXueFen;
  }

  // 计算课程数
  calculateCourse = (classItem: any) => {
    let allCourse: any = [];
    classItem.forEach((item: any) => {
      if (!allCourse.includes(item.kcmc)) {
        allCourse.push(item.kcmc);
      }
    });
    return allCourse.length;
  } 

  // 通过学期获取课程
  getCoursesByTerm = (term: string) => {
    const xnmmc = term.substring(0, 9);
    const xqmmc = term.substring(9, 11);
    const xqmTable: any = { 秋冬: '1', 春夏: '2' };
    const xqmmcTable: any = { 秋冬: '3', 春夏: '12' };
    let courses: any = [];
    this.state.classInfo.forEach(item => {
      let items = item.kbList;
      if (items.length > 0) {
        items.forEach((item: any) => {
          if (item.xnm === xnmmc.substring(0, 4) && item.xqm === xqmmcTable[xqmmc]) {
            courses.push(item);
          }
        });
      }
    });
    this.state.classInfo.forEach(item => {
      let items = item.sjkList;
      if (items.length > 0) {
        items.forEach((item: any) => {
          // 避免重复添加
          if (item.xnmc === xnmmc && item.xqmmc === xqmTable[xqmmc] && !courses.includes(item)) {
            courses.push(item);
          }
        });
      }
    });
    return courses;
  };

  // 计算总学时
  calculateTotalKeShi = (classItem: any) => {
    let totalKeShi = 0;
    classItem.forEach((item: any) => {
      if (item.zxs) {
        totalKeShi += parseFloat(item.zxs);
      }
    });
    return totalKeShi;
  }

  // 计算课表课程数
  calculateKbCourse = (classItem: any) => {
    let allCourse: any = [];
    classItem.forEach((item: any) => {
      if (!item.qtkcgs) {
        if (!allCourse.includes(item.kcmc)) {
          allCourse.push(item.kcmc);
        }
      }
    });
    return allCourse.length;
  }

  // 计算实践课程数
  calculateSjkCourse = (classItem: any) => {
    let allCourse: any = [];
    classItem.forEach((item: any) => {
      if (item.qtkcgs) {
        if (!allCourse.includes(item.kcmc)) {
          allCourse.push(item.kcmc);
        }
      }
    });
    return allCourse.length;
  }

  // 计算实践课程学分
  calculateSjkXueFen = (classItem: any) => {
    let totalXueFen = 0;
    let allCourse: any = [];
    classItem.forEach((item: any) => {
      if (item.qtkcgs) {
        if (!allCourse.includes(item.kcmc)) {
          allCourse.push(item.kcmc);
          totalXueFen += parseFloat(item.xf);
        }
      }
    });
    return totalXueFen;
  }

  // 计算课表课程学分
  calculateKbXueFen = (classItem: any) => {
    let totalXueFen = 0;
    let allCourse: any = [];
    classItem.forEach((item: any) => {
      if (!item.qtkcgs) {
        if (!allCourse.includes(item.kcmc)) {
          totalXueFen += parseFloat(item.xf);
          allCourse.push(item.kcmc);
        }
      }
    });
    return totalXueFen;
  }


  render() {
    // 判断是否有课程信息
    if (this.state.classInfo.length === 0) {
      return (
        <View style={styles.container}>
          <Text>暂无课程信息</Text>
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.termSwitcher}>
            {this.state.termSwitcher.map((term, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.termButton,
                  this.state.selectedTerm === term && styles.selectedTermButton,
                ]}
                onPress={() => this.selectTerm(this.state.termSwitcher[index])}>
                <Text
                  style={[
                    styles.termText,
                    this.state.selectedTerm === term && styles.selectedTermText,
                  ]}>
                  {term}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.section} onPress={() => {
          // 跳转到成绩详情页面
          const {navigation} = this.props as StudyProps;
          navigation.navigate('成绩');
        }}>
          <View style={[styles.sectionHeader, {backgroundColor: '#E0F7FA'}]}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="school-outline" size={20} color="#333" />
              <Text style={styles.sectionTitle}>成绩</Text>
            </View>
            <View style={styles.sectionHeaderRight}>
              <Icon name="information-circle-outline" size={16} color="#999" />
              <Text style={styles.sectionUpdate}>以教务网数据为准！</Text>
            </View>
          </View>
          <View style={styles.gradeContainer}>
            {[
              {label: '总均绩', value: this.state.totalGrade.toFixed(2), color: '#E3F2FD'},
              {
                label: '获得学分',
                value: this.state.totalCredit.toFixed(2),
                color: '#FFF3E0',
              },
              {
                label: '学年均绩',
                value: this.state.yearGrade.toFixed(2),
                color: '#E8F5E9',
              },
              {
                label: '学年学分',
                value: this.state.yearCredit.toFixed(2),
                color: '#F3E5F5',
              },
              {
                label: '学期均绩',
                value: this.state.xueqiGrade.toFixed(2),
                color: '#FFFDE7',
              },
              {
                label: '学期学分',
                value: this.state.xueqiCredit.toFixed(2),
                color: '#E1F5FE',
              },
              {
                label: '总百分制',
                value: this.state.totalBaiFenZhi.toFixed(2),
                color: '#FFEBEE',
              },
              {
                label: '学期百分制',
                value: this.state.xueqiBaiFenZhi.toFixed(2),
                color: '#E0F7FA',
              },
            ].map((item, index) => (
              <View
                key={index}
                style={[styles.gradeItem, {backgroundColor: item.color}]}>
                <Text style={styles.gradeLabel}>{item.label}</Text>
                <Text style={styles.gradeValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, {backgroundColor: '#E1F5FE'}]}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="calendar-outline" size={20} color="#333" />
              <Text style={styles.sectionTitle}>课程</Text>
            </View>
            <View style={styles.sectionHeaderRight}>
              <Icon name="information-circle-outline" size={16} color="#999" />
              <Text style={styles.sectionUpdate}>以教务网数据为准！</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.courseContainer} onPress={() => {
            // 跳转到课程详情页面
            const {navigation} = this.props as StudyProps;
            navigation.navigate('课表');
          }}>
            <View style={styles.courseSummary}>
              <Text style={styles.courseSummaryItem}>{this.calculateCourse(this.getCoursesByTerm(this.state.selectedTerm))} 门课程</Text>
              <Text style={styles.courseSummaryItem}>{this.calculateXueFen(this.getCoursesByTerm(this.state.selectedTerm))} 学分</Text>
              <Text style={styles.courseSummaryItem}>{this.calculateTotalKeShi(this.getCoursesByTerm(this.state.selectedTerm))} 总学时</Text>
            </View>
            <View style={styles.courseDetails}>
              <View
                style={[styles.courseDetailItem, {backgroundColor: '#FFEBEE'}]}>
                <Text style={styles.courseTerm}>课表课程</Text>
                <Text style={styles.courseValue}>{this.calculateKbXueFen(this.getCoursesByTerm(this.state.selectedTerm))}学分/{this.calculateKbCourse(this.getCoursesByTerm(this.state.selectedTerm))}门课程</Text>
              </View>
              <View
                style={[styles.courseDetailItem, {backgroundColor: '#E3F2FD'}]}>
                <Text style={styles.courseTerm}>实践（其它）课程</Text>
                <Text style={styles.courseValue}>{this.calculateSjkXueFen(this.getCoursesByTerm(this.state.selectedTerm))}学分/{this.calculateSjkCourse(this.getCoursesByTerm(this.state.selectedTerm))}门课程</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  searchBar: {
    height: 40,
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    backgroundColor: '#f8f8f8',
  },
  termSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  termButton: {
    margin: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  selectedTermButton: {
    backgroundColor: '#d0e8ff',
  },
  termText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTermText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#333',
  },
  sectionUpdate: {
    fontSize: 14,
    marginLeft: 5,
    color: '#999',
  },
  gradeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gradeItem: {
    width: '24%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  gradeLabel: {
    fontSize: 12,
    color: '#666',
  },
  gradeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  courseContainer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  courseSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  courseSummaryItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseDetailItem: {
    width: '48%',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  courseTerm: {
    fontSize: 14,
    color: '#666',
  },
  courseValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Study;
