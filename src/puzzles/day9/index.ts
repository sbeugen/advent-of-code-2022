import { getInput } from '../../get-input';
import { identity, last, uniq } from 'ramda';

type Command = {
  direction: string;
  steps: number;
};

type Knot = {
  x: number;
  y: number;
};

export const ninthDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(9);

  const preparedData: Command[] = rawInputData
    .split('\n')
    .filter(identity)
    .map((line) => {
      const [direction, steps] = line.split(' ');
      return {
        direction,
        steps: Number(steps),
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

const moveKnot2 = (knot1: Knot, knot2: Knot) => {
  //up
  if (knot2.x === knot1.x && knot1.y - knot2.y === 2) {
    knot2.y++;
  }
  //down
  if (knot2.x === knot1.x && knot2.y - knot1.y === 2) {
    knot2.y--;
  }

  //left
  if (knot2.y === knot1.y && knot2.x - knot1.x === 2) {
    knot2.x--;
  }

  //right
  if (knot2.y === knot1.y && knot1.x - knot2.x === 2) {
    knot2.x++;
  }

  //top right
  if ((knot1.y - knot2.y === 2 && knot1.x - knot2.x > 0) || (knot1.y - knot2.y > 0 && knot1.x - knot2.x === 2)) {
    knot2.x++;
    knot2.y++;
  }

  //top left
  if ((knot1.y - knot2.y === 2 && knot2.x - knot1.x > 0) || (knot1.y - knot2.y > 0 && knot2.x - knot1.x === 2)) {
    knot2.x--;
    knot2.y++;
  }

  //bottom right
  if ((knot2.y - knot1.y === 2 && knot1.x - knot2.x > 0) || (knot2.y - knot1.y > 0 && knot1.x - knot2.x === 2)) {
    knot2.x++;
    knot2.y--;
  }

  //bottom left
  if ((knot2.y - knot1.y === 2 && knot2.x - knot1.x > 0) || (knot2.y - knot1.y > 0 && knot2.x - knot1.x === 2)) {
    knot2.x--;
    knot2.y--;
  }
};

const makeStep = (knot1: Knot, direction: string) => {
  switch (direction) {
    case 'U':
      knot1.y++;
      break;
    case 'R':
      knot1.x++;
      break;
    case 'D':
      knot1.y--;
      break;
    case 'L':
      knot1.x--;
      break;
  }
};

const first = (inputData: Command[]) => {
  const head: Knot = {
    x: 1000000,
    y: 1000000,
  };
  const tail: Knot = {
    x: 1000000,
    y: 1000000,
  };
  const positionsVisitedByTail = ['1000000,1000000'];

  inputData.forEach((command) => {
    for (let i = 0; i < command.steps; i++) {
      makeStep(head, command.direction);
      moveKnot2(head, tail);

      positionsVisitedByTail.push(`${tail.x},${tail.y}`);
    }
  });

  console.log(uniq(positionsVisitedByTail).length);
};

const second = (inputData: Command[]) => {
  const knots = Array.from(Array(10)).map(() => ({
    x: 1000000,
    y: 1000000,
  }));

  const positionsVisitedByTail = ['1000000,1000000'];

  inputData.forEach((command) => {
    for (let i = 0; i < command.steps; i++) {
      makeStep(knots[0], command.direction);
      for (let k = 0; k < knots.length - 1; k++) {
        moveKnot2(knots[k], knots[k + 1]);
      }
      positionsVisitedByTail.push(`${last(knots)!.x},${last(knots)!.y}`);
    }
  });

  console.log(uniq(positionsVisitedByTail).length);
};
