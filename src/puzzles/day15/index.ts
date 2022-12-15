import { getInput } from '../../get-input';
import { identity, range, uniq } from 'ramda';

type Point = {
  x: number;
  y: number;
};

type SensorData = {
  sensorPosition: Point;
  beaconPosition: Point;
};

export const fifteenthDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(15);

  const preparedData: SensorData[] = rawInputData
    .split('\n')
    .filter(identity)
    .map((line) => {
      const [sensorX, beaconX] = line.match(/x=-?\d+/g)!.map((match) => Number(match.replace('x=', '')));
      const [sensorY, beaconY] = line.match(/y=-?\d+/g)!.map((match) => Number(match.replace('y=', '')));

      return {
        sensorPosition: {
          x: sensorX,
          y: sensorY,
        },
        beaconPosition: {
          x: beaconX,
          y: beaconY,
        },
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

const first = (inputData: SensorData[]) => {
  const searchLine = 2000000;

  const foundBeaconX: number[] = [];
  let foundX: number[] = [];

  inputData.forEach((sensorData) => {
    const { sensorPosition, beaconPosition } = sensorData;

    if (beaconPosition.y === searchLine) {
      foundBeaconX.push(beaconPosition.x);
    }

    const xDistance =
      Math.max(sensorPosition.x, beaconPosition.x) -
      Math.min(sensorPosition.x, beaconPosition.x) +
      Math.max(sensorPosition.y, beaconPosition.y) -
      Math.min(sensorPosition.y, beaconPosition.y);
    const xRange = range(sensorPosition.x - xDistance, sensorPosition.x + xDistance + 1);

    const yDistance =
      Math.max(sensorPosition.y, beaconPosition.y) -
      Math.min(sensorPosition.y, beaconPosition.y) +
      Math.max(sensorPosition.x, beaconPosition.x) -
      Math.min(sensorPosition.x, beaconPosition.x);

    if (sensorPosition.y + yDistance > searchLine && sensorPosition.y - yDistance < searchLine) {
      const yDistanceToSearchLine = Math.max(sensorPosition.y, searchLine) - Math.min(sensorPosition.y, searchLine);
      const remainingX = xRange.slice(yDistanceToSearchLine, -yDistanceToSearchLine);
      foundX = [...foundX, ...remainingX];
    }
  });

  console.log(uniq(foundX).length - uniq(foundBeaconX).length);
};

type Range = {
  min: number;
  max: number;
};

const second = (inputData: SensorData[]) => {
  const maxXY = 4000000;
  const lines: Range[][] = Array.from(Array(maxXY + 1), () => []);

  inputData.forEach((sensorData, index) => {
    const { sensorPosition, beaconPosition } = sensorData;

    const xDistance =
      Math.max(sensorPosition.x, beaconPosition.x) -
      Math.min(sensorPosition.x, beaconPosition.x) +
      Math.max(sensorPosition.y, beaconPosition.y) -
      Math.min(sensorPosition.y, beaconPosition.y);
    const xRange = [sensorPosition.x - xDistance, sensorPosition.x + xDistance];
    let yOffset = 0;

    while (xRange[0] <= xRange[1]) {
      console.log(index + 1, '/', inputData.length, '|', xRange[0], ':', xRange[1]);
      const yUp = sensorPosition.y - yOffset;
      const yDown = sensorPosition.y + yOffset;

      const validXRange: Range = { min: Math.max(xRange[0], 0), max: Math.min(xRange[1], maxXY) };
      if (yUp >= 0 && yUp <= maxXY) {
        lines[yUp].push(validXRange);
      }
      if (yUp !== yDown && yDown >= 0 && yDown <= maxXY) {
        lines[yDown].push(validXRange);
      }

      yOffset++;
      xRange[0]++;
      xRange[1]--;
    }
  });

  for (let i = 0; i <= maxXY; i++) {
    console.log(i, '/', maxXY, '|', lines[i].length);

    const sortedRanges = lines[i].sort((a, b) => a.min - b.min);

    let currentMax = sortedRanges[0].max;

    for (let k = 1; k < sortedRanges.length; k++) {
      if (sortedRanges[k].min > currentMax) {
        const x = sortedRanges[k].min - 1;
        console.log(x, i, x * 4000000 + i);
        return;
      } else {
        currentMax = Math.max(currentMax, sortedRanges[k].max);
      }
    }
  }
};
