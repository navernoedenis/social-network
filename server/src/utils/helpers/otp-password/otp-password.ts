const numbers = '1234567890';

export const createOtpPassword = (len: number = 6) => {
  const getRandomIndex = () => Math.floor(Math.random() * numbers.length);
  const array: string[] = [];

  for (let index = 0; index < len; index++) {
    let num = numbers[getRandomIndex()];

    while (index === 0 && num === '0') {
      num = numbers[getRandomIndex()];
    }

    array.push(num);
  }

  return +array.join('');
};
