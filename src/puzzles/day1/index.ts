import { getInput } from '../../get-input';
import { sum } from 'ramda';

export const firstDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(1);

  const preparedData: number[] = rawInputData.split('\n\n').map((entry) => sum(entry.split('\n').map(Number)));

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

const first = (inputData: number[]) => {
  console.log(Math.max(...inputData));
};

const second = (inputData: number[]) => {
  console.log(sum(inputData.sort((a, b) => b - a).slice(0, 3)));
};
