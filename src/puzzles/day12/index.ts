import { getInput } from '../../get-input';
import { identity } from 'ramda';

type Coords = {
  x: number;
  y: number;
};

type Location = {
  heightIndicator: string;
  reachedInNumberOfSteps: number;
  isEnd: boolean;
};

type HeightMap = {
  grid: Location[][];
  startCoords: Coords;
};

export const twelfthDay = async (puzzleIndex: string) => {
  console.time('a');
  const rawInputData = await getInput(12);

  const grid = rawInputData
    .split('\n')
    .filter(identity)
    .map((line) =>
      line.split('').map((point) => ({
        reachedInNumberOfSteps: 0,
        heightIndicator: point,
        isEnd: false,
      }))
    );
  let startCoords = { x: 0, y: 0 };

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x].heightIndicator === 'S') {
        grid[y][x].heightIndicator = 'a';
        startCoords = { x, y };
      }
      if (grid[y][x].heightIndicator === 'E') {
        grid[y][x].heightIndicator = 'z';
        grid[y][x].isEnd = true;
      }
    }
  }

  const preparedData: HeightMap = {
    grid,
    startCoords,
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

const getCharCode = (char: string) => char.charCodeAt(0);

const getNextPossibleSteps = (grid: Location[][], currentPosition: Coords, numberOfSteps: number): Coords[] => {
  const possibleNextSteps = [];
  const currentCharCode = getCharCode(grid[currentPosition.y][currentPosition.x].heightIndicator);

  // up
  if (
    currentPosition.y - 1 >= 0 &&
    getCharCode(grid[currentPosition.y - 1][currentPosition.x].heightIndicator) <= currentCharCode + 1 &&
    (grid[currentPosition.y - 1][currentPosition.x].reachedInNumberOfSteps === 0 ||
      numberOfSteps < grid[currentPosition.y - 1][currentPosition.x].reachedInNumberOfSteps)
  ) {
    grid[currentPosition.y - 1][currentPosition.x].reachedInNumberOfSteps = numberOfSteps;
    possibleNextSteps.push({ x: currentPosition.x, y: currentPosition.y - 1 });
  }

  // down
  if (
    currentPosition.y + 1 < grid.length &&
    getCharCode(grid[currentPosition.y + 1][currentPosition.x].heightIndicator) <= currentCharCode + 1 &&
    (grid[currentPosition.y + 1][currentPosition.x].reachedInNumberOfSteps === 0 ||
      numberOfSteps < grid[currentPosition.y + 1][currentPosition.x].reachedInNumberOfSteps)
  ) {
    grid[currentPosition.y + 1][currentPosition.x].reachedInNumberOfSteps = numberOfSteps;
    possibleNextSteps.push({ x: currentPosition.x, y: currentPosition.y + 1 });
  }

  // left
  if (
    currentPosition.x - 1 >= 0 &&
    getCharCode(grid[currentPosition.y][currentPosition.x - 1].heightIndicator) <= currentCharCode + 1 &&
    (grid[currentPosition.y][currentPosition.x - 1].reachedInNumberOfSteps === 0 ||
      numberOfSteps < grid[currentPosition.y][currentPosition.x - 1].reachedInNumberOfSteps)
  ) {
    grid[currentPosition.y][currentPosition.x - 1].reachedInNumberOfSteps = numberOfSteps;
    possibleNextSteps.push({ x: currentPosition.x - 1, y: currentPosition.y });
  }

  // right
  if (
    currentPosition.x + 1 < grid[0].length &&
    getCharCode(grid[currentPosition.y][currentPosition.x + 1].heightIndicator) <= currentCharCode + 1 &&
    (grid[currentPosition.y][currentPosition.x + 1].reachedInNumberOfSteps === 0 ||
      numberOfSteps < grid[currentPosition.y][currentPosition.x + 1].reachedInNumberOfSteps)
  ) {
    grid[currentPosition.y][currentPosition.x + 1].reachedInNumberOfSteps = numberOfSteps;
    possibleNextSteps.push({ x: currentPosition.x + 1, y: currentPosition.y });
  }

  return possibleNextSteps;
};

const getStepsCountIfEndIsReachable = (
  grid: Location[][],
  currentPosition: Coords,
  possibleNextSteps: Coords[],
  stepsDone: number
): (number | null)[] => {
  return possibleNextSteps.flatMap((nextStep) => {
    if (grid[nextStep.y][nextStep.x].isEnd) {
      return stepsDone + 1;
    }

    const furtherSteps = getNextPossibleSteps(grid, nextStep, stepsDone + 1);
    if (furtherSteps.length === 0) {
      return null;
    }
    return getStepsCountIfEndIsReachable(grid, nextStep, furtherSteps, stepsDone + 1);
  });
};

const first = (inputData: HeightMap) => {
  const result = getStepsCountIfEndIsReachable(
    inputData.grid,
    inputData.startCoords,
    getNextPossibleSteps(inputData.grid, inputData.startCoords, 1),
    0
  );
  console.log('shortest path', result.filter(identity).sort((a, b) => a! - b!)[0]);
  console.timeEnd('a');
};

const second = (inputData: HeightMap) => {
  const startingPoints: Coords[] = [];

  inputData.grid.forEach((line, y) =>
    line.forEach((entry, x) => {
      if (entry.heightIndicator === 'a') {
        startingPoints.push({ x, y });
      }
    })
  );

  const result = startingPoints.flatMap((start) => {
    const copiedGrid = inputData.grid.map((line) => line.map((entry) => ({ ...entry })));
    return getStepsCountIfEndIsReachable(copiedGrid, start, getNextPossibleSteps(copiedGrid, start, 1), 0);
  });

  console.log('shortest path', result.filter(identity).sort((a, b) => a! - b!)[0]);
  console.timeEnd('a');
};
