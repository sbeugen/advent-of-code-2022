import { getInput } from '../../get-input';
import { identity } from 'ramda';

type Monkeys = Record<string, number | string>;

export const twentyFirst = async (puzzleIndex: string) => {
  const rawInputData = await getInput(21);
  const testData =
    'root: pppw + sjmn\n' +
    'dbpl: 5\n' +
    'cczh: sllz + lgvd\n' +
    'zczc: 2\n' +
    'ptdq: humn - dvpt\n' +
    'dvpt: 3\n' +
    'lfqf: 4\n' +
    'humn: 5\n' +
    'ljgn: 2\n' +
    'sjmn: drzm * dbpl\n' +
    'sllz: 4\n' +
    'pppw: cczh / lfqf\n' +
    'lgvd: ljgn * ptdq\n' +
    'drzm: hmdt - zczc\n' +
    'hmdt: 32';

  const data = rawInputData;
  // const data = testData;

  const preparedData: Monkeys = Object.fromEntries(
    data
      .split('\n')
      .filter(identity)
      .map((line, index) => {
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

const first = (inputData: Monkeys) => {
  let result = inputData['root'] as string;
  let matches: string[] | null = [''];

  while (matches.length > 0) {
    matches = (result as string).match(/inputData\['\w{4}']/g) ?? [];
    matches.forEach((match) => {
      result = result.replace(new RegExp(match.replace(/\[/g, '\\[')), eval(match));
    });
  }

  console.log(eval(result));
};

const second = (inputData: Monkeys) => {
  console.log('second');
};
