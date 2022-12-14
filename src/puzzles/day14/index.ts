import { getInput } from '../../get-input';
import { findLastIndex, identity, range, sum } from 'ramda';

export const fourteenthDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(14);

  const cave = Array.from(Array(1000), () => Array.from(Array(1000), () => false));
  const rockData = rawInputData
    .split('\n')
    .filter(identity)
    .map((line) =>
      line.split(' -> ').map((point) => {
        const [x, y] = point.split(',');
        return { x: Number(x), y: Number(y) };
      })
    );

  rockData.forEach((formation) => {
    formation.forEach((start, index) => {
      if (index < formation.length - 1) {
        const end = formation[index + 1];
        let rockLine = [];

        if (start.x === end.x) {
          rockLine = range(Math.min(start.y, end.y), Math.max(start.y, end.y) + 1).map((y) => ({ x: start.x, y }));
        } else if (start.y === end.y) {
          rockLine = range(Math.min(start.x, end.x), Math.max(start.x, end.x) + 1).map((x) => ({ x, y: start.y }));
        } else {
          throw Error('Input data is not a straight line.');
        }

        rockLine.forEach((rock) => {
          cave[rock.y][rock.x] = true;
        });
      }
    });
  });

  switch (puzzleIndex) {
    case '0':
      first(cave);
      break;
    case '1':
      second(cave);
      break;
    default:
      console.error('Provide 0 or 1 as puzzleArg like yarn start 1 0');
  }
};

const getNumberOfRestingSandUnits = (cave: boolean[][]): number => {
  const floorIndex = findLastIndex((line) => line.some(identity), cave);
  let numberOfRestingSandUnits = 0;
  let reachedVoid = false;

  while (!reachedVoid) {
    let location = { x: 500, y: 0 };
    while (true) {
      if (location.y === floorIndex) {
        reachedVoid = true;
        break;
      } else if (!cave[location.y + 1][location.x]) {
        location.y++;
      } else if (!cave[location.y + 1][location.x - 1]) {
        location.x--;
        location.y++;
      } else if (!cave[location.y + 1][location.x + 1]) {
        location.x++;
        location.y++;
      } else {
        cave[location.y][location.x] = true;
        numberOfRestingSandUnits++;
        break;
      }
    }
  }

  return numberOfRestingSandUnits;
};

const first = (cave: boolean[][]) => {
  console.log(getNumberOfRestingSandUnits(cave));
};

const getNumberOfRestingSandUnitsTwo = (cave: boolean[][]): number => {
  const floorIndex = findLastIndex((line) => line.some(identity), cave);
  const floorLine = range(0, 1000).map((x) => ({ x, y: floorIndex + 2 }));
  floorLine.forEach((rock) => {
    cave[rock.y][rock.x] = true;
  });

  let numberOfRestingSandUnits = 0;

  while (!cave[0][500]) {
    let location = { x: 500, y: 0 };
    while (true) {
      if (!cave[location.y + 1][location.x]) {
        location.y++;
      } else if (!cave[location.y + 1][location.x - 1]) {
        location.x--;
        location.y++;
      } else if (!cave[location.y + 1][location.x + 1]) {
        location.x++;
        location.y++;
      } else {
        cave[location.y][location.x] = true;
        numberOfRestingSandUnits++;
        break;
      }
    }
  }

  return numberOfRestingSandUnits;
};
const second = (cave: boolean[][]) => {
  console.log(getNumberOfRestingSandUnitsTwo(cave));
};
