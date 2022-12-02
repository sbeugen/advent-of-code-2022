import { getInput } from '../../get-input';
import { identity, sum } from 'ramda';

const gameResultMap: Record<string, number> = {
  AX: 3,
  AY: 6,
  AZ: 0,
  BX: 0,
  BY: 3,
  BZ: 6,
  CX: 6,
  CY: 0,
  CZ: 3,
};

const pointsPerShape: Record<string, number> = {
  X: 1,
  Y: 2,
  Z: 3,
};

const suggestedGameForResult: Record<string, string> = {
  AX: 'AZ',
  AY: 'AX',
  AZ: 'AY',
  BX: 'BX',
  BY: 'BY',
  BZ: 'BZ',
  CX: 'CY',
  CY: 'CZ',
  CZ: 'CX',
};

export const secondDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(2);

  const preparedData = rawInputData
    .split('\n')
    .map((entry) => entry.replace(' ', ''))
    .filter(identity);

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
  console.log(
    sum(
      inputData.map((game) => {
        const gameResult = gameResultMap[game];
        const pointsForShape = pointsPerShape[game[1]];

        return gameResult + pointsForShape;
      })
    )
  );
};

const second = (inputData: string[]) => {
  console.log(
    sum(
      inputData.map((suggestedResult) => {
        const suggestedGame = suggestedGameForResult[suggestedResult];
        const gameResult = gameResultMap[suggestedGame];
        const pointsForShape = pointsPerShape[suggestedGame[1]];

        return gameResult + pointsForShape;
      })
    )
  );
};
