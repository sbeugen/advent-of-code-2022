import { getInput } from '../../get-input';
import { identity, init, last, reverse, values } from 'ramda';

type InputData = {
  stackInfo: Record<string, string[]>;
  instructions: {
    amount: number;
    from: string;
    to: string;
  }[];
};
export const fifthDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(5);
  const [stacksData, instructionsData] = rawInputData.split('\n\n');

  const stackNumbers = last(stacksData.split('\n'))!.replace(/\s/g, '').split('');
  const boxLines = init(stacksData.split('\n')).map((line) =>
    line
      .split('')
      .filter((_, i) => (i + 1) % 4 != 0)
      .join('')
      .match(/.{3}/g)!
      .map((entry) => entry.replace(/[[\]\s]/g, ''))
  );

  const stackInfo = stackNumbers.reduce<Record<string, string[]>>((acc, stackNumber, index) => {
    acc[stackNumber] = reverse(boxLines.map((line) => line[index])).filter(identity);
    return acc;
  }, {});

  const instructions = init(instructionsData.split('\n')).map((instructionLine) => {
    const match = instructionLine.match(/\d+/g)!;
    return {
      amount: Number(match[0]),
      from: match[1],
      to: match[2],
    };
  });

  const preparedData = {
    stackInfo,
    instructions,
  };

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

const first = (inputData: InputData) => {
  inputData.instructions.forEach((instruction) => {
    inputData.stackInfo[instruction.to].push(
      ...reverse(inputData.stackInfo[instruction.from].splice(-instruction.amount))
    );
  });

  console.log(values(inputData.stackInfo).map(last).join(''));
};

const second = (inputData: InputData) => {
  inputData.instructions.forEach((instruction) => {
    inputData.stackInfo[instruction.to].push(...inputData.stackInfo[instruction.from].splice(-instruction.amount));
  });

  console.log(values(inputData.stackInfo).map(last).join(''));
};
