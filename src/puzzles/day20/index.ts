import { getInput } from '../../get-input';
import { identity, range } from 'ramda';

export const twentiethDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(20);
  const testInput = '1\n' + '2\n' + '-3\n' + '3\n' + '-2\n' + '0\n' + '4';

  const input = rawInputData;
  // const input = testInput;

  const preparedData: number[] = input.split('\n').filter(identity).map(Number);

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

const findNthValueAfterZero = (values: number[], n: number): number => {
  let index = values.findIndex((v) => v === 0);

  let counter = n;

  while (counter > 0) {
    if (index + 1 === values.length) {
      index = 0;
    } else {
      index++;
    }

    counter--;
  }

  return values[index];
};

const mix = (values: number[], times = 1) => {
  const valuesWithIds = values.map((value, index) => ({ value, id: index }));
  const ids = values.map((_, index) => index);

  range(0, times).forEach((round) => {
    console.log(round);
    valuesWithIds.forEach(({ value, id }) => {
      const currentIndex = ids.findIndex((i) => i === id);
      let newIndex = currentIndex + value;

      if (newIndex >= 0) {
        while (newIndex >= ids.length) {
          newIndex = newIndex - ids.length;
        }
      } else if (newIndex < 0) {
        while (Math.abs(newIndex) >= ids.length) {
          newIndex = newIndex + ids.length;
        }
      }

      const isEndIndexSmallerThanCurrentIndex =
        (newIndex >= 0 && newIndex <= currentIndex) || (newIndex < 0 && ids.length + newIndex < currentIndex);

      ids.splice(newIndex > 0 ? newIndex + 1 : newIndex, 0, id);
      ids.splice(isEndIndexSmallerThanCurrentIndex ? currentIndex + 1 : currentIndex, 1);
    });
  });

  const endValues = ids.map((id) => valuesWithIds.find((entry) => entry.id === id)!.value);

  const firstValue = findNthValueAfterZero(endValues, 1000);
  const secondValue = findNthValueAfterZero(endValues, 2000);
  const thirdValue = findNthValueAfterZero(endValues, 3000);

  return firstValue + secondValue + thirdValue;
};

const first = (inputData: number[]) => {
  console.log(mix(inputData));
};

const second = (inputData: number[]) => {
  console.log(
    mix(
      inputData.map((v) => v * 811589153),
      10
    )
  );
};
