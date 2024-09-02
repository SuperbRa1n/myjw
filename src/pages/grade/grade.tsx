import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GradeProps} from '../../utils/types';

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
}

class Grade extends Component<{}, State> {
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
  };

  async componentDidMount() {
    const classInfo = await AsyncStorage.getItem('classInfo');
    const gradeInfo = await AsyncStorage.getItem('gradeInfo');
    this.setState({
      classInfo: classInfo ? JSON.parse(classInfo) : [],
      gradeInfo: gradeInfo ? JSON.parse(gradeInfo) : [],
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

    // 按照年份排序，再按照秋冬春夏排序
    termSwitcher.sort((a: string, b: string) => {
      if (a.substring(0, 9) < b.substring(0, 9)) {
        return 1;
      } else if (a.substring(0, 9) > b.substring(0, 9)) {
        return -1;
      } else {
        if (a.substring(9, 11) === '秋冬' && b.substring(9, 11) === '春夏') {
          return 1;
        } else if (
          a.substring(9, 11) === '春夏' &&
          b.substring(9, 11) === '秋冬'
        ) {
          return -1;
        } else {
          return 0;
        }
      }
    });
    this.setState({
      termSwitcher: Array.from(new Set(termSwitcher)),
    });
    if (!this.state.isTermSet) {
      this.setState({isTermSet: true, selectedTerm: termSwitcher[0]});
      this.selectTerm(termSwitcher[0]);
    }
  }

  componentDidUpdate(prevProps: any, prevState: State) {
    if (prevState.selectedTerm !== this.state.selectedTerm) {
      this.updateGrades();
    }
  }

  updateGrades = () => {
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
  };

  selectTerm = (term: string) => {
    this.setState({selectedTerm: term});
  };

  // 计算GPA
  calculateGPA = (grade: any) => {
    let totalCredit = 0;
    let totalGrade = 0;
    grade.forEach((item: any) => {
      totalCredit += parseFloat(item.xf);
      totalGrade += parseFloat(item.xf) * parseFloat(item.jd);
    });
    return totalGrade / totalCredit;
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
    return totalGrade / totalCredit;
  };

  // 计算学期GPA
  calculateXueqiGPA = (xueqi: string) => {
    const xnmmc = xueqi.substring(0, 9);
    const xqmmc = xueqi.substring(9, 11);
    const xqmTable: any = {秋冬: '1', 春夏: '2'};
    let totalCredit = 0;
    let totalGrade = 0;
    this.state.gradeInfo.forEach(item => {
      let items = item.items;
      if (items.length > 0) {
        items.forEach((item: any) => {
          if (item.xnmmc === xnmmc && item.xqmmc === xqmTable[xqmmc]) {
            totalCredit += parseFloat(item.xf);
            totalGrade += parseFloat(item.xf) * parseFloat(item.jd);
          }
        });
      }
    });
    return totalGrade / totalCredit;
  };

  // 计算学期学分
  calculateXueqiCredit = (xueqi: string) => {
    const xnmmc = xueqi.substring(0, 9);
    const xqmmc = xueqi.substring(9, 11);
    const xqmTable: any = {秋冬: '1', 春夏: '2'};
    let totalCredit = 0;
    this.state.gradeInfo.forEach(item => {
      let items = item.items;
      if (items.length > 0) {
        items.forEach((item: any) => {
          if (item.xnmmc === xnmmc && item.xqmmc === xqmTable[xqmmc]) {
            totalCredit += parseFloat(item.xf);
          }
        });
      }
    });
    return totalCredit;
  };

  // 通过学期获取课程
  getCoursesByTerm = (term: string) => {
    const xnmmc = term.substring(0, 9);
    const xqmmc = term.substring(9, 11);
    const xqmTable: any = {秋冬: '1', 春夏: '2'};
    let courses: any = [];
    this.state.gradeInfo.forEach(item => {
      let items = item.items;
      if (items.length > 0) {
        items.forEach((item: any) => {
          if (item.xnmmc === xnmmc && item.xqmmc === xqmTable[xqmmc]) {
            courses.push(item);
          }
        });
      }
    });
    // 根据百分制成绩排序
    courses.sort((a: any, b: any) => {
      return parseFloat(b.bfzcj) - parseFloat(a.bfzcj);
    });
    return courses;
  };

  renderCourse = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.courseItem}
      onPress={() => {
        const {navigation} = this.props as GradeProps;
        navigation.navigate('课程详情', {courseName: item.kcmc});
      }}>
      <View style={styles.courseHeader}>
        <Text style={styles.courseName}>{item.kcmc}</Text>
        <Text style={styles.courseScore}>
          {item.bfzcj} / {item.jd}
        </Text>
      </View>
      <Text style={styles.courseInfo}>
        {item.jxbmc} / {item.xf} 学分
      </Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, {width: `${item.bfzcj}%`}]} />
      </View>
    </TouchableOpacity>
  );

  renderHeader = () => (
    <View>
      <View style={styles.gradeSummary}>
        {[
          {
            label: '总均绩',
            value: this.state.totalGrade.toFixed(2),
            color: '#E3F2FD',
          },
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
      <View style={styles.termSummary}>
        <FlatList
          horizontal
          data={this.state.termSwitcher}
          renderItem={({item: term, index}) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.termItem,
                this.state.selectedTerm === term && styles.selectedTermItem,
              ]}
              onPress={() => this.selectTerm(term)}>
              <Text style={styles.termLabel}>{term}</Text>
              <Text style={styles.termValue}>
                {this.calculateXueqiGPA(term).toFixed(2)}/
                {this.calculateXueqiCredit(term).toFixed(2)}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );

  render() {
    return (
      <FlatList
        ListHeaderComponent={this.renderHeader}
        data={this.getCoursesByTerm(this.state.selectedTerm)}
        renderItem={this.renderCourse}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.courseList}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gradeSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  gradeItem: {
    width: '24%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  gradeLabel: {
    fontSize: 14,
    color: '#666',
  },
  gradeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  termSummary: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  termItem: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    marginRight: 5,
    marginLeft: 5,
  },
  selectedTermItem: {
    backgroundColor: '#E3F2FD',
  },
  termLabel: {
    fontSize: 14,
    color: '#666',
  },
  termValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  courseList: {
    padding: 10,
  },
  courseItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseScore: {
    fontSize: 20,
  },
  courseInfo: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    marginTop: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#74c6f7',
  },
});

export default Grade;
