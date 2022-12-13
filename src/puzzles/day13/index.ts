import { getInput } from '../../get-input';
import { sum } from 'ramda';

export const thirteenthDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(13);

  const preparedData: any[] = rawInputData.split('\n\n').map((pair) => {
    const [left, right] = pair.split('\n');
    return {
      left: JSON.parse(left),
      right: JSON.parse(right),
    };
  });

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

const isRightOrder = (left: any[], right: any[]): boolean | null => {
  const maxIterations = Math.max(left.length, right.length);
  let result = null;

  const isNumber = (input: number | number[]) => typeof input === 'number';

  for (let i = 0; i < maxIterations; i++) {
    // check if one of the sides is empty and the other not
    if (left[i] === undefined && right[i] !== undefined) {
      result = true;
    } else if (left[i] !== undefined && right[i] === undefined) {
      result = false;
    }

    // handle if only one side is an integer and the other an array
    else if (isNumber(left[i]) && !isNumber(right[i])) {
      result = isRightOrder([left[i]], right[i]);
    } else if (!isNumber(left[i]) && isNumber(right[i])) {
      result = isRightOrder(left[i], [right[i]]);
    }

    // handle both sides are not integers
    else if (!isNumber(left[i]) && !isNumber(right[i])) {
      result = isRightOrder(left[i], right[i]);
    } else if (!isNumber(left[i]) && !isNumber(right[i])) {
      result = isRightOrder(left[i], right[i]);
    }
    // handle both sides are not integers
    else if (left[i] !== right[i]) {
      result = left[i] < right[i];
    }

    if (result !== null) {
      break;
    }
  }
  return result;
};

const first = (inputData: any[]) => {
  const indicesInRightOrder = inputData.reduce((acc, pair, index) => {
    if (isRightOrder(pair.left, pair.right)) {
      acc.push(index + 1);
    }
    return acc;
  }, []);
  console.log(sum(indicesInRightOrder));
};

const second = (inputData: any[]) => {
  const firstDivider = [[2]];
  const secondDivider = [[6]];

  const allPackets = inputData.reduce(
    (acc, pair) => {
      acc.push(pair.left);
      acc.push(pair.right);

      return acc;
    },
    [firstDivider, secondDivider]
  );

  const sortedPackets = allPackets.sort((first: any[], second: any[]) => (isRightOrder(first, second) ? -1 : 1));

  const firstDividerIndex = sortedPackets.findIndex((packet: any[]) => packet === firstDivider) + 1;
  const secondDividerIndex = sortedPackets.findIndex((packet: any[]) => packet === secondDivider) + 1;

  console.log(firstDividerIndex * secondDividerIndex);
};
