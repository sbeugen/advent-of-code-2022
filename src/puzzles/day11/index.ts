import { getInput } from '../../get-input';

type Monkey = {
  id: string;
  items: number[];
  operation: (old: number) => number;
  getNextMonkeyId: (value: number) => string;
  testNumber: number;
};

export const eleventhDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(11);

  const monkeyData: string[][] = rawInputData.split('\n\n').map((monkeyEntry) => monkeyEntry.split('\n'));

  const monkeys: Monkey[] = monkeyData.map((monkeyEntry) => {
    const id = monkeyEntry[0].match(/\d+/)![0];
    const items = monkeyEntry[1]
      .match(/(,? \d+)+/)![0]
      .replace(/ /g, '')
      .split(',')
      .map(Number);
    const operation = (old: number) => eval(monkeyEntry[2].match(/old [*+] [\d/(old)]+/)![0]);
    const getNextMonkeyId = (value: number) =>
      eval(
        `value % ${Number(monkeyEntry[3].match(/\d+/)![0])} === 0 ? ${monkeyEntry[4].match(/\d+/)![0]} : ${
          monkeyEntry[5].match(/\d+/)![0]
        };`
      );
    const testNumber = Number(monkeyEntry[3].match(/\d+/)![0]);

    return {
      id,
      items,
      operation,
      getNextMonkeyId,
      testNumber,
    };
  });

  switch (puzzleIndex) {
    case '0':
      first(monkeys);
      break;
    case '1':
      second(monkeys);
      break;
    default:
      console.error('Provide 0 or 1 as puzzleArg like yarn start 1 0');
  }
};

const first = (inputData: Monkey[]) => {
  const monkeyBusinessLevels: number[] = Array.from(Array(inputData.length), () => 0);

  for (let i = 0; i < 20; i++) {
    inputData.forEach((monkey, index) => {
      monkeyBusinessLevels[index] = monkeyBusinessLevels[index] + monkey.items.length;
      monkey.items.forEach((item) => {
        const newWorryLevel = Math.floor(monkey.operation(item) / 3);
        const nextMonkeyId = monkey.getNextMonkeyId(newWorryLevel);
        inputData.find(({ id }) => id === nextMonkeyId.toString())!.items.push(newWorryLevel);
      });
      monkey.items = [];
    });
  }

  const highestBusinessLevels = monkeyBusinessLevels.sort((a, b) => b - a).slice(0, 2);

  console.log(highestBusinessLevels[0] * highestBusinessLevels[1]);
};

const second = (inputData: Monkey[]) => {
  const monkeyBusinessLevels: number[] = Array.from(Array(inputData.length), () => 0);
  const worryLevelReducer = inputData.reduce((acc, monkey) => acc * monkey.testNumber, 1);

  for (let i = 0; i < 10000; i++) {
    inputData.forEach((monkey, index) => {
      monkeyBusinessLevels[index] = monkeyBusinessLevels[index] + monkey.items.length;
      monkey.items.forEach((item) => {
        const newWorryLevel = monkey.operation(item) % worryLevelReducer;
        const nextMonkeyId = monkey.getNextMonkeyId(newWorryLevel);
        inputData.find(({ id }) => id === nextMonkeyId.toString())!.items.push(newWorryLevel);
      });
      monkey.items = [];
    });
  }

  const highestBusinessLevels = monkeyBusinessLevels.sort((a, b) => b - a).slice(0, 2);

  console.log(highestBusinessLevels[0] * highestBusinessLevels[1]);
};
