import { getInput } from '../../get-input';
import { identity } from 'ramda';

export const eighthDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(8);

  const preparedData: number[][] = rawInputData
    .split('\n')
    .filter(identity)
    .map((line) => line.split('').map((height) => Number(height)));

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

const isHighestTreeToEdge = (height: number, row: number, column: number, grid: number[][]) => {
  let isHighestTree = true;

  // to the top
  for (let i = row - 1; i >= 0; i--) {
    if (grid[i][column] >= height) {
      isHighestTree = false;
    }
  }
  if (isHighestTree) {
    return true;
  }

  isHighestTree = true;

  // to the bottom
  for (let i = row + 1; i < grid.length; i++) {
    if (grid[i][column] >= height) {
      isHighestTree = false;
    }
  }
  if (isHighestTree) {
    return true;
  }

  isHighestTree = true;

  // to the left
  for (let i = column - 1; i >= 0; i--) {
    if (grid[row][i] >= height) {
      isHighestTree = false;
    }
  }
  if (isHighestTree) {
    return true;
  }

  isHighestTree = true;

  // to the right
  for (let i = column + 1; i < grid[0].length; i++) {
    if (grid[row][i] >= height) {
      isHighestTree = false;
    }
  }

  return isHighestTree;
};

const getScenicScore = (height: number, row: number, column: number, grid: number[][]) => {
  let viewToTop = 0;
  let viewToBottom = 0;
  let viewToLeft = 0;
  let viewToRight = 0;

  // to the top
  for (let i = row - 1; i >= 0; i--) {
    viewToTop++;
    if (grid[i][column] >= height) {
      break;
    }
  }

  // to the bottom
  for (let i = row + 1; i < grid.length; i++) {
    viewToBottom++;
    if (grid[i][column] >= height) {
      break;
    }
  }

  // to the left
  for (let i = column - 1; i >= 0; i--) {
    viewToLeft++;
    if (grid[row][i] >= height) {
      break;
    }
  }

  // to the right
  for (let i = column + 1; i < grid[0].length; i++) {
    viewToRight++;
    if (grid[row][i] >= height) {
      break;
    }
  }

  return viewToTop * viewToBottom * viewToLeft * viewToRight;
};

const first = (inputData: number[][]) => {
  const visibleTreesCount = inputData
    .flatMap((line, lineIndex) =>
      line.map((treeHeight, columnIndex) => isHighestTreeToEdge(treeHeight, lineIndex, columnIndex, inputData))
    )
    .filter(identity).length;

  console.log(visibleTreesCount);
};

const second = (inputData: number[][]) => {
  const highestScenicScore = Math.max(
    ...inputData.flatMap((line, lineIndex) =>
      line.map((treeHeight, columnIndex) => getScenicScore(treeHeight, lineIndex, columnIndex, inputData))
    )
  );
  console.log(highestScenicScore);
};
