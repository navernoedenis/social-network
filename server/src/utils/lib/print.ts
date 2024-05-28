import chalk, { ForegroundColor, BackgroundColor } from 'chalk';

type TData = string | number | boolean;

export const print = {
  default: console.log,
  error: (...data: TData[]) => console.log(chalk.red(...data)),
  info: (...data: TData[]) => console.log(chalk.blue(...data)),
  success: (...data: TData[]) => console.log(chalk.green(...data)),
  warn: (...data: TData[]) => console.log(chalk.yellow(...data)),
};

type ColorKey = string | number;
type ColorValue = typeof ForegroundColor | typeof BackgroundColor;
type ColorTuple = [ColorKey, ColorValue];

export const colorWord = {
  one: (word: ColorKey, color: ColorValue) => chalk[color](word),
  many: (words: ColorTuple[]) => {
    return words.map(([key, color]) => chalk[color](key)).join('');
  },
};