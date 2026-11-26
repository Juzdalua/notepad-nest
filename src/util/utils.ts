import { diff } from 'deep-diff';

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const toCamelCase = (object: any) => {
  let newObject: any = {};
  var keys = Object.keys(object);
  const toCamelCase = (message: string) => {
    message = message.toLowerCase();
    message = message.replace(/-/gi, ' ');
    message = message.replace(/_/gi, ' ');
    let messages = message.split(' ').map((e, i) => {
      if (i > 0) {
        e = e.substring(0, 1).toUpperCase() + e.substring(1);
      }
      return e;
    });
    return messages.join('');
  };
  for (let i = 0; i < keys.length; i++) {
    newObject[toCamelCase(keys[i])] = object[keys[i]];
  }
  return newObject;
};

export const currentDate = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const getDiffObjects = (oldObj: any, newObj: any) => {
  const differences = diff(oldObj, newObj);
  const beforeFlat = {};
  const afterFlat = {};

  if (!differences) return { before: {}, after: {} };

  // 변경부분 추출: {'buyerCompany.country.id': 'KR'}
  for (const change of differences) {
    const path = change.path.join('.');
    beforeFlat[path] = change.lhs;
    afterFlat[path] = change.rhs;
  }

  // 추출한 데이터 원본데이터화: { buyerCompany: { country: { id: 'KR' } } }
  const unflattenObject = (flatObj: Record<string, any>) => {
    const result = {};
    for (const key in flatObj) {
      const keys = key.split('.');
      keys.reduce((acc, k, idx) => {
        if (idx === keys.length - 1) {
          acc[k] = flatObj[key];
        } else {
          acc[k] = acc[k] || {};
        }
        return acc[k];
      }, result);
    }
    return result;
  };

  return {
    before: unflattenObject(beforeFlat),
    after: unflattenObject(afterFlat)
  };
};
