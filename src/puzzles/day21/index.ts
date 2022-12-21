import { getInput } from '../../get-input';
import { identity } from 'ramda';

type Monkeys = Record<string, number | string>;

export const twentyFirst = async (puzzleIndex: string) => {
  const rawInputData = await getInput(21);

  const preparedData: Monkeys = Object.fromEntries(
    rawInputData
      .split('\n')
      .filter(identity)
      .map((line) => {
        const [name, job] = line.split(':');
        const jobWithoutBlanks = job.replace(/ /g, '');

        const parsedJob = (() => {
          if (isNaN(Number(jobWithoutBlanks))) {
            const [first, second] = jobWithoutBlanks.match(/\w{4}/g)!;

            return `(${jobWithoutBlanks
              .replace(first, `inputData['${first}']`)
              .replace(second, `inputData['${second}']`)})`;
          }

          return Number(jobWithoutBlanks);
        })();

        return [name, parsedJob];
      })
  );

  switch (puzzleIndex) {
    case '0':
      first(preparedData);
      break;
    case '1':
      second(preparedData);
      break;
    default:
      console.error('Provide 0 or 1 as puzzleArg like yarn start 1 0');
  }
};

const resolve = (inputData: Monkeys): string => {
  let result = inputData['root'] as string;
  let matches: string[] | null = [''];

  while (matches.length > 0) {
    matches = (result as string).match(/inputData\['\w{4}']/g) ?? [];
    matches.forEach((match) => {
      result = result.replace(new RegExp(match.replace(/\[/g, '\\[')), eval(match));
    });
  }

  return result;
};
const first = (inputData: Monkeys) => {
  console.log(eval(resolve(inputData)));
};

const second = (inputData: Monkeys) => {
  inputData['humn'] = 'eugen';
  const [rootOperation] = (inputData['root'] as string).match(/[*+-/]/)!;
  inputData['root'] = (inputData['root'] as string).replace(rootOperation, '===');

  const result = resolve(inputData);

  // found by manually bisecting the result and reducing the +/- to/from myNumber
  let myNumber = 3378273371000;

  while (true) {
    const [left, right] = result.split('===');
    const leftResult = eval(left.replace(/eugen/g, myNumber.toString()) + ')');
    const rightResult = eval('(' + right);

    if (leftResult === rightResult) {
      console.log('result:', myNumber);
      break;
    } else if (leftResult > rightResult) {
      myNumber = myNumber + 1;
    } else {
      myNumber = myNumber - 1;
    }
  }
};
