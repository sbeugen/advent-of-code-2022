import { getInput } from '../../get-input';
import { identity, last, sum } from 'ramda';

type Command = {
  cycles: number;
  registerChangeValue?: number;
};
export const tenthDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(10);

  const preparedData: Command[] = rawInputData
    .split('\n')
    .filter(identity)
    .map((line) => {
      if (line.startsWith('noop')) {
        return { cycles: 1 };
      }

      const [_, registerChangeValue] = line.split(' ');
      return {
        cycles: 2,
        registerChangeValue: Number(registerChangeValue),
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

const first = (inputData: Command[]) => {
  const relevantCycles = [20, 60, 100, 140, 180, 220];

  const signalStrengths = relevantCycles.map((relevantCycle) => {
    let cycle = 1;
    let registerValue = 1;

    for (let i = 0; i < inputData.length; i++) {
      cycle = cycle + inputData[i].cycles;
      if (cycle <= relevantCycle) {
        registerValue = registerValue + (inputData[i].registerChangeValue ?? 0);
      } else {
        break;
      }
    }

    return registerValue * relevantCycle;
  });

  console.log(sum(signalStrengths));
};

const second = (inputData: Command[]) => {
  let registerValue = 1;
  let totalCycles = 1;

  const lines = Array.from(Array(6), () => Array.from(Array(40), () => '.'));

  const commandsWithRegisterValuesAndTotalCycles = inputData.map((command) => {
    const commandWithRegisterValueAndTotalCycles = { ...command, registerValue, totalCycles };
    registerValue = registerValue + (command.registerChangeValue ?? 0);
    totalCycles = totalCycles + command.cycles;

    return commandWithRegisterValueAndTotalCycles;
  });

  lines.forEach((line, index) => {
    for (let i = 0; i < line.length; i++) {
      const currentRegisterValue = last(
        commandsWithRegisterValuesAndTotalCycles.filter((c) => c.totalCycles <= i + index * line.length + 1)
      )?.registerValue!;
      if (i >= currentRegisterValue - 1 && i <= currentRegisterValue + 1) {
        line[i] = '#';
      }
    }
  });

  lines.forEach((line) => console.log(line.join(' ')));
};
