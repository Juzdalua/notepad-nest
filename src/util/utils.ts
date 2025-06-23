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
