/**
 * 清空对象所有属性的值
 * @param {Object} obj
 */
export function resetObjValue(obj) {
  if (!obj) return;
  for (const key in obj) {
    if (Reflect.has(obj, key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        resetObjValue(obj[key]);
      } else if (typeof obj[key] === 'string') {
        obj[key] = '';
      } else if (typeof obj[key] === 'number') {
        obj[key] = 0;
      } else if (Array.isArray(obj[key])) {
        obj[key] = [];
      }
      return '';
    }
  }
}

/**
 * 生成uuuid
 */
export function generateUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 校验form表单所有值不为空
 * @param {Object} form 表单对象
 * @param {Array} excludeList 要排除的字段列表
 * @returns {Boolean}
 */
export function checkFormValid(form = {}, excludeList = []) {
  if (form === null || form === undefined) {
    return false;
  }
  let isValid = true;
  const excludeSet = new Set(excludeList);

  for (const [key, value] of Object.entries(form)) {
    if (excludeSet.has(key)) {
      continue;
    }
    if (Array.isArray(value)) {
      if (!value.length) {
        isValid = false;
        break;
      }
    } else {
      const type = typeof value;
      if (type === 'object' && value !== null) {
        const isNull = Object.keys(value).length === 0;
        const isOk = isNull ? false : checkFormValid(value, excludeList);
        if (!isOk) {
          isValid = false;
          break;
        }
      } else {
        if (checkIsNull(value)) {
          isValid = false;
          break;
        }
      }
    }
  }
  return isValid;
}

/**
 * 校验值是否为空
 * @param {*} value 要校验的值
 * @returns {Boolean} true: 为空; false: 不为空
 */
export function checkIsNull(value) {
  return value === '' || value === null || value === undefined;
}
