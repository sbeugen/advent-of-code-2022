import { getInput } from '../../get-input';
import { identity, uniq } from 'ramda';

type Valve = {
  rate: number;
  connectedTo: string[];
};

type ValveSystem = Record<string, Valve>;
export const sixteenthDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(16);
  const testData =
    'Valve AA has flow rate=0; tunnels lead to valves DD, II, BB\n' +
    'Valve BB has flow rate=13; tunnels lead to valves CC, AA\n' +
    'Valve CC has flow rate=2; tunnels lead to valves DD, BB\n' +
    'Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE\n' +
    'Valve EE has flow rate=3; tunnels lead to valves FF, DD\n' +
    'Valve FF has flow rate=0; tunnels lead to valves EE, GG\n' +
    'Valve GG has flow rate=0; tunnels lead to valves FF, HH\n' +
    'Valve HH has flow rate=22; tunnel leads to valve GG\n' +
    'Valve II has flow rate=0; tunnels lead to valves AA, JJ\n' +
    'Valve JJ has flow rate=21; tunnel leads to valve II';

  const inputData = testData;
  // const inputData = rawInputData;

  const preparedData: ValveSystem = Object.fromEntries(
    inputData
      .split('\n')
      .filter(identity)
      .map((line) => {
        const id = line.match(/Valve \w+/)![0].replace('Valve ', '');
        const rate = Number(line.match(/\d+/)![0]);
        const connectedTo = line
          .match(/valve.*/)![0]
          .replace(/ /g, '')
          .replace('valves', '')
          .replace('valve', '')
          .split(',');
        return [id, { rate, connectedTo }];
      })
  );

  const startValve = inputData
    .split('\n')[0]
    .match(/Valve \w+/)![0]
    .replace('Valve ', '');

  switch (puzzleIndex) {
    case '0':
      first(preparedData, startValve);
      break;
    case '1':
      second(preparedData);
      break;
    default:
      console.error('Provide 0 or 1 as puzzleArg like yarn start 1 0');
  }
};

const getMaxPressureRelease = (
  valveSystem: ValveSystem,
  currentValveId: string,
  test: (usedValves: Set<string>, minutesLeft: number, pressureSum: number, currentValve: string) => boolean,
  minutesLeft = 30,
  openValves = new Set<string>(),
  pressureSum = 0
): number => {
  if (minutesLeft <= 0 || !test(openValves, minutesLeft, pressureSum, currentValveId)) {
    // console.log(pressureSum, [...openValves].join(','));
    return pressureSum;
  }

  const newPressureSums =
    !openValves.has(currentValveId) && valveSystem[currentValveId].rate > 0
      ? [pressureSum, pressureSum + valveSystem[currentValveId].rate * (minutesLeft - 1)]
      : [pressureSum];

  return Math.max(
    ...valveSystem[currentValveId].connectedTo.flatMap((id) =>
      newPressureSums.map((sum, index) =>
        getMaxPressureRelease(
          valveSystem,
          id,
          test,
          minutesLeft - (index + 1),
          index > 0 ? new Set([...openValves, currentValveId]) : openValves,
          sum
        )
      )
    )
  );
};

const getDistancesToNonZeroValves = (valveSystem: ValveSystem, startId: string): Record<string, number> => {
  let visited: string[] = [];
  let distances: Record<string, number> = {};
  let currentId = startId;
  let nextIds = valveSystem[currentId].connectedTo;
  let stepsDone = 0;

  while (visited.length < Object.keys(valveSystem).length) {
    distances = {
      ...distances,
      ...Object.fromEntries(
        nextIds
          .filter((key) => valveSystem[key].rate > 0 && !visited.includes(key))
          .map((key) => {
            return [key, stepsDone + 1];
          })
      ),
    };

    visited = uniq([...visited, ...nextIds, currentId]);
    stepsDone++;

    nextIds = nextIds.flatMap((key) => valveSystem[key].connectedTo);
  }

  return distances;
};

const first = (inputData: ValveSystem, startValve: string) => {
  const totalCountOfNonZeroValves = Object.values(inputData).filter(({ rate }) => rate > 0).length;
  const cache: Record<string, { minutesLeft: number; sum: number }> = {};
  const distances = Object.fromEntries(
    Object.keys(inputData).map((key) => [key, getDistancesToNonZeroValves(inputData, key)])
  );
  const testFunction = (
    usedValves: Set<string>,
    minutesLeft: number,
    pressureSum: number,
    currentValve: string
  ): boolean => {
    const usedValvesCombinedKey = [...usedValves].join('');

    if (
      (cache[usedValvesCombinedKey] === undefined ||
        (pressureSum >= cache[usedValvesCombinedKey].sum && minutesLeft > cache[usedValvesCombinedKey].minutesLeft)) &&
      usedValves.size > 0
    ) {
      cache[usedValvesCombinedKey] = {
        sum: pressureSum,
        minutesLeft,
      };
      return true;
    }

    const shortestUnusedValveDistance = Object.entries(distances[currentValve])
      .filter(([key]) => !usedValves.has(key))
      .sort((a, b) => a[1] - b[1])?.[0]?.[1];

    if (shortestUnusedValveDistance === undefined) {
      return false;
    }

    return (
      (usedValves.size === 0 && minutesLeft > 28) ||
      // (usedValves.size > 0 && pressureSum >= (cache[usedValvesCombinedKey]?.sum ?? 0) && minutesLeft > shortestUnusedValveDistance)
      (usedValves.size > 0 && minutesLeft >= (cache[usedValvesCombinedKey]?.minutesLeft ?? 30) - 6)
    );
  };

  const result = getMaxPressureRelease(inputData, startValve, testFunction);
  console.log(result);
};

const second = (inputData: ValveSystem) => {
  console.log('second');
};
