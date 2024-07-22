import axios from 'axios';

export const BASE_URL = 'https://myjw.zeabur.app';

export const LOGIN = '/login';

export const CLASSINFO = '/class';

export const GRADEINFO = '/grade';

export const CODE = '/get_code';

export const DEFAULT_AVATAR = 'https://one.fjsmu.edu.cn/tp_up/resource/image/common/userpic.png';

export const xnmList = ['2030', '2029', '2028', '2027', '2026', '2025', '2024', '2023', '2022', '2021', '2019', '2018'];

export const xqmList = ['3', '12'];

export const getClassInfo = async (JSESSIONID: string) => {
  const result = [];
  for (const xnm of xnmList) {
    for (const xqm of xqmList) {
      const data = {
        'JSESSIONID': JSESSIONID,
        'xnm': xnm,
        'xqm': xqm,
      };
      const response = await axios.post(BASE_URL + CLASSINFO, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      result.push(response.data);
    }
  }
  return result;
}

export const getGradeInfo = async (JSESSIONID: string) => {
  const result = [];
  for (const xnm of xnmList) {
    for (const xqm of xqmList) {
      const data = {
        'JSESSIONID': JSESSIONID,
        'xnm': xnm,
        'xqm': xqm,
      };
      const response = await axios.post(BASE_URL + GRADEINFO, data, {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      result.push(response.data);
    }
  }
  return result;
}

export const getUserInfo = async (JSESSIONID: string) => {
  const data = {
    'JSESSIONID': JSESSIONID,
    'xnm': xnmList[0],
    'xqm': xqmList[0],
  };
  const response = await axios.post(BASE_URL + CLASSINFO, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
  const result = {
    'name': response.data.xsxx.XM,
    'id': response.data.xsxx.XH_ID,
    'class': response.data.xsxx.BJMC,
  };
  return result;
}