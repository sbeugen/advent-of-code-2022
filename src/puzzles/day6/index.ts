import { getInput } from '../../get-input';
import { uniq } from 'ramda';

export const sixthDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(6);

  const preparedData = rawInputData.split('');

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

const first = (inputData: string[]) => {
  console.log(findMarkerPosition(inputData, 4));
};

const second = (inputData: string[]) => {
  console.log(findMarkerPosition(inputData, 14));
};

const findMarkerPosition = (inputBuffer: string[], messageLength: number) => {
  const lastLetters: string[] = [];
  let charsProcessed = 0;

  for (const index in inputBuffer) {
    lastLetters.push(inputBuffer[index]);
    charsProcessed++;

    if (lastLetters.length === messageLength && uniq(lastLetters).length === lastLetters.length) {
      return charsProcessed;
    }

    if (lastLetters.length === messageLength) {
      lastLetters.shift();
    }
  }
};
