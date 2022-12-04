import { getInput } from '../../get-input';
import { identity, pipe, sum } from 'ramda';

export const fourthDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(4);
  const preparedInputData = rawInputData.split('\n').filter(identity);

  switch (puzzleIndex) {
    case '0':
      first(preparedInputData);
      break;
    case '1':
      second(preparedInputData);
      break;
    default:
      console.error('Provide 0 or 1 as puzzleArg like yarn start 1 0');
  }
};

const splitPairs = (pairString: string): string[] => pairString.split(',');

const toMinMaxTuple = (pairs: string[]): { min: number; max: number }[] =>
  pairs.map((entry) => {
    const [min, max] = entry.split('-').map(Number);
    return { min, max };
  });

const isCompletelyOverlapping = (minMaxTuple: { min: number; max: number }[]): boolean =>
  (minMaxTuple[1].min >= minMaxTuple[0].min && minMaxTuple[1].max <= minMaxTuple[0].max) ||
  (minMaxTuple[0].min >= minMaxTuple[1].min && minMaxTuple[0].max <= minMaxTuple[1].max);

const isOverlapping = (minMaxTuple: { min: number; max: number }[]): boolean =>
  (minMaxTuple[1].min >= minMaxTuple[0].min && minMaxTuple[1].min <= minMaxTuple[0].max) ||
  (minMaxTuple[1].max <= minMaxTuple[0].max && minMaxTuple[1].max >= minMaxTuple[0].min) ||
  (minMaxTuple[0].min >= minMaxTuple[1].min && minMaxTuple[0].min <= minMaxTuple[1].max) ||
  (minMaxTuple[0].max <= minMaxTuple[1].max && minMaxTuple[0].max >= minMaxTuple[1].min);
const toNumber = (isCompletelyOverlapping: boolean): number => Number(isCompletelyOverlapping);

const first = (input: string[]) => {
  console.log(sum(input.map(pipe(splitPairs, toMinMaxTuple, isCompletelyOverlapping, toNumber))));
};

const second = (input: string[]) => {
  console.log(sum(input.map(pipe(splitPairs, toMinMaxTuple, isOverlapping, toNumber))));
};
