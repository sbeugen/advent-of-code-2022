import { getInput } from '../../get-input';
import { identity, sum } from 'ramda';

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

const first = (input: string[]) => {
  console.log(
    sum(
      input.map((pairString) => {
        const splitPair = pairString.split(',');
        const mappedPair = splitPair.map((entry) => {
          const [min, max] = entry.split('-').map(Number);
          return { min, max };
        });

        if (
          (mappedPair[1].min >= mappedPair[0].min && mappedPair[1].max <= mappedPair[0].max) ||
          (mappedPair[0].min >= mappedPair[1].min && mappedPair[0].max <= mappedPair[1].max)
        ) {
          return 1;
        } else {
          return 0;
        }
      })
    )
  );
};

const second = (input: string[]) => {
  console.log(
    sum(
      input.map((pairString) => {
        const splitPair = pairString.split(',');
        const mappedPair = splitPair.map((entry) => {
          const [min, max] = entry.split('-').map(Number);
          return { min, max };
        });

        if (
          (mappedPair[1].min >= mappedPair[0].min && mappedPair[1].min <= mappedPair[0].max) ||
          (mappedPair[1].max <= mappedPair[0].max && mappedPair[1].max >= mappedPair[0].min) ||
          (mappedPair[0].min >= mappedPair[1].min && mappedPair[0].min <= mappedPair[1].max) ||
          (mappedPair[0].max <= mappedPair[1].max && mappedPair[0].max >= mappedPair[1].min)
        ) {
          return 1;
        } else {
          return 0;
        }
      })
    )
  );
};
