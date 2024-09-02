import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TimetableProps} from '../../utils/types';

interface State {
  classInfo: any[];
  selectedTerm: string;
  termSwitcher: string[];
  isTermSet: boolean;
}

class Timetable extends React.Component<{}, State> {
  state: State = {
    classInfo: [],
    selectedTerm: '',
    termSwitcher: [],
    isTermSet: false,
  };

  async componentDidMount() {
    const classInfo = await AsyncStorage.getItem('classInfo');
    this.setState({classInfo: classInfo ? JSON.parse(classInfo) : []});
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

  selectTerm = (term: string) => {
    this.setState({selectedTerm: term});
  };

  renderTimetable = () => {
    const {selectedTerm, classInfo} = this.state;
    let filteredClasses = classInfo.filter(
      c =>
        `${c.xsxx.XNMC}${c.xsxx.XQM === '3' ? '秋冬' : '春夏'}` ===
        selectedTerm,
    );
    let kbList = filteredClasses[0].kbList;
    kbList = kbList.sort(
      (a: {jcs: string; xqj: string}, b: {jcs: string; xqj: string}) => {
        const classTimeListA = a.jcs.split('-');
        const classStartIndexA = parseInt(classTimeListA[0]);
        const classTimeListB = b.jcs.split('-');
        const classStartIndexB = parseInt(classTimeListB[0]);
        const classDayA = parseInt(a.xqj);
        const classDayB = parseInt(b.xqj);
        if (classDayA === classDayB) {
          return classStartIndexA - classStartIndexB;
        } else {
          return classDayA - classDayB;
        }
      },
    );

    const timeSlots = [
      '08:00',
      '08:50',
      '10:00',
      '10:50',
      '11:40',
      '13:25',
      '14:15',
      '15:05',
      '16:15',
      '17:05',
      '18:50',
      '19:40',
      '20:30',
      '21:20',
    ];
    const days = ['一', '二', '三', '四', '五', '六', '日'];
    return (
      <View style={styles.timetable}>
        <ScrollView
          style={styles.timetable}
          contentContainerStyle={styles.timetableContent}>
          <View style={styles.headerRow}>
            <View style={styles.timeCell} />
            {days.map(day => (
              <View key={day} style={styles.dayCell}>
                <Text style={styles.dayHeader}>{day}</Text>
              </View>
            ))}
          </View>
          {timeSlots.map((time, timeIndex) => (
            <View key={time} style={styles.row}>
              <View style={styles.timeCell}>
                <Text style={styles.timeIndex}>{timeIndex + 1}</Text>
                <Text style={styles.timeLabel}>{time}</Text>
              </View>
              {days.map((day, dayIndex) => {
                const classForThisTime = kbList.find(
                  (c: {xqj: string; jcs: string}) =>
                    c.xqj === (dayIndex + 1).toString() &&
                    c.jcs.split('-')[0] === (timeIndex + 1).toString(),
                );
                let classDuration = 0;
                let top = 0;
                if (classForThisTime) {
                  const classTimeList = classForThisTime.jcs.split('-');
                  const classStartIndex = parseInt(classTimeList[0]);
                  const classEndIndex = parseInt(classTimeList[1]);
                  classDuration = classEndIndex - classStartIndex + 1;
                }
                return (
                  <View key={day} style={styles.classCell}>
                    {classForThisTime ? (
                      <TouchableOpacity
                        style={[
                          styles.classBlock,
                          {
                            height: classDuration * cellHeight,
                            top: top,
                          },
                        ]}
                        onPress={() => {
                          const {navigation} = this.props as TimetableProps;
                          navigation.navigate('课程详情', {
                            courseName: classForThisTime.kcmc,
                          });
                        }}>
                        <Text style={styles.className}>
                          {classForThisTime.kcmc}
                        </Text>
                        {classDuration > 1 ? (
                          <Text style={styles.classLocation}>
                            @{classForThisTime.cdmc}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.termSummary}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.termSummary}>
            {this.state.termSwitcher.map(term => (
              <TouchableOpacity
                key={term}
                style={[
                  styles.termItem,
                  this.state.selectedTerm === term && styles.selectedTermItem,
                ]}
                onPress={() => this.selectTerm(term)}>
                <Text style={styles.termLabel}>{term}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {this.state.isTermSet && this.renderTimetable()}
      </View>
    );
  }
}

const {width, height} = Dimensions.get('window');
const cellHeight = (height - 250) / 14;
const cellWidth = (width - 20) / 8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  termSummary: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 70,
  },
  termItem: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    marginRight: 5,
    height: 40,
  },
  selectedTermItem: {
    backgroundColor: '#E3F2FD',
  },
  termLabel: {
    fontSize: 14,
    color: '#666',
  },
  timetable: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 15 * cellHeight + 20,
  },
  timetableContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  timeCell: {
    width: cellWidth,
    justifyContent: 'center',
    alignItems: 'center',
    height: cellHeight,
  },
  dayCell: {
    width: cellWidth,
    justifyContent: 'center',
    alignItems: 'center',
    height: cellHeight,
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeLabel: {
    fontSize: 10,
  },
  timeIndex: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  classCell: {
    width: cellWidth,
    height: cellHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classBlock: {
    backgroundColor: '#74c6f7',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: cellWidth,
  },
  className: {
    fontSize: 10,
    color: '#fff',
  },
  classLocation: {
    fontSize: 8,
    color: '#fff',
  },
});

export default Timetable;
