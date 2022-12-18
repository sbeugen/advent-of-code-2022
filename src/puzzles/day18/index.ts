import { getInput } from '../../get-input';
import { identity } from 'ramda';

type Coords = {
  x: number;
  y: number;
  z: number;
};
export const eighteenthDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(18);

  const preparedData: Coords[] = rawInputData
    .split('\n')
    .filter(identity)
    .map((entry) => {
      const [x, y, z] = entry.split(',');
      return {
        x: +x,
        y: +y,
        z: +z,
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

const getNeighboringCoordStrings = (coord: Coords) => [
  `${coord.x},${coord.y},${coord.z + 1}`,
  `${coord.x},${coord.y},${coord.z - 1}`,
  `${coord.x + 1},${coord.y},${coord.z}`,
  `${coord.x - 1},${coord.y},${coord.z}`,
  `${coord.x},${coord.y + 1},${coord.z}`,
  `${coord.x},${coord.y - 1},${coord.z}`,
];

const first = (inputData: Coords[]) => {
  console.time();
  const coordsSet = new Set(inputData.map((coord) => `${coord.x},${coord.y},${coord.z}`));

  const totalArea = inputData.reduce((acc, coord) => {
    let maxOpenSides = 6;
    const neighboringCoordStrings = getNeighboringCoordStrings(coord);

    neighboringCoordStrings.forEach((neighbor) => {
      if (coordsSet.has(neighbor)) {
        maxOpenSides--;
      }
    });

    acc = acc + maxOpenSides;

    return acc;
  }, 0);

  console.timeEnd();
  console.log(totalArea);
};

const second = (inputData: Coords[]) => {
  console.time();
  const placedCoordsSet = new Set<string>();
  let openCoords: string[] = [];
  const minX = Math.min(...inputData.map((coord) => coord.x));
  const maxX = Math.max(...inputData.map((coord) => coord.x));
  const minY = Math.min(...inputData.map((coord) => coord.y));
  const maxY = Math.max(...inputData.map((coord) => coord.y));
  const minZ = Math.min(...inputData.map((coord) => coord.z));
  const maxZ = Math.max(...inputData.map((coord) => coord.z));

  const maxDistance = Math.max(maxX - minX, maxY - minY, maxZ - minZ);

  inputData.forEach((coord) => {
    const coordString = `${coord.x},${coord.y},${coord.z}`;
    const neighboringCoordStrings = getNeighboringCoordStrings(coord);

    placedCoordsSet.add(coordString);

    openCoords = openCoords.filter((coord) => coord !== coordString);

    neighboringCoordStrings.forEach((neighbor) => {
      if (!placedCoordsSet.has(neighbor)) {
        openCoords.push(neighbor);
      }
    });
  });

  const openCoordsAsCoords = openCoords.map((entry) => {
    const [x, y, z] = entry.split(',');
    return {
      x: +x,
      y: +y,
      z: +z,
    };
  });

  const outerOpenCoords = openCoordsAsCoords.filter(({ x, y, z }) => {
    let hasRightNeighbor = false;
    let hasLeftNeighbor = false;
    let hasFrontNeighbor = false;
    let hasBackNeighbor = false;
    let hasUpperNeighbor = false;
    let hasLowerNeighbor = false;

    for (let i = 1; i <= maxDistance; i++) {
      if (inputData.find((coord) => coord.x === x + i && coord.y === y && coord.z === z)) {
        hasRightNeighbor = true;
        break;
      }
    }

    for (let i = 1; i <= maxDistance; i++) {
      if (inputData.find((coord) => coord.x === x - i && coord.y === y && coord.z === z)) {
        hasLeftNeighbor = true;
        break;
      }
    }

    if (!hasRightNeighbor || !hasLeftNeighbor) {
      return true;
    }

    for (let i = 1; i <= maxDistance; i++) {
      if (inputData.find((coord) => coord.x === x && coord.y === y + i && coord.z === z)) {
        hasFrontNeighbor = true;
        break;
      }
    }

    for (let i = 1; i <= maxDistance; i++) {
      if (inputData.find((coord) => coord.x === x && coord.y === y - i && coord.z === z)) {
        hasBackNeighbor = true;
        break;
      }
    }

    if (!hasFrontNeighbor || !hasBackNeighbor) {
      return true;
    }

    for (let i = 1; i <= maxDistance; i++) {
      if (inputData.find((coord) => coord.x === x && coord.y === y && coord.z === z + i)) {
        hasUpperNeighbor = true;
        break;
      }
    }

    for (let i = 1; i <= maxDistance; i++) {
      if (inputData.find((coord) => coord.x === x && coord.y === y && coord.z === z - i)) {
        hasLowerNeighbor = true;
        break;
      }
    }

    return !hasUpperNeighbor || !hasLowerNeighbor;
  });

  console.timeEnd();
  console.log(outerOpenCoords.length);
};
