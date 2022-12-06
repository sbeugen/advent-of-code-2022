/**
 * Usage: yarn start DAY PUZZLE_INDEX
 * DAY has to be between 1 and 25
 * PUZZLE_INDEX is 0 or 1
 * e.g. yarn start 1 0
 */

import { firstDay } from './src/puzzles/day1';
import * as dotenv from 'dotenv';
import { secondDay } from './src/puzzles/day2';
import { thirdDay } from './src/puzzles/day3';
import { fourthDay } from './src/puzzles/day4';
import { fifthDay } from './src/puzzles/day5';
import { sixthDay } from './src/puzzles/day6';

dotenv.config();

const [dayArg, puzzleArg] = process.argv.slice(2);

switch (dayArg) {
  case '1':
    await firstDay(puzzleArg);
    break;
  case '2':
    await secondDay(puzzleArg);
    break;
  case '3':
    await thirdDay(puzzleArg);
    break;
  case '4':
    await fourthDay(puzzleArg);
    break;
  case '5':
    await fifthDay(puzzleArg);
    break;
  case '6':
    await sixthDay(puzzleArg);
    break;
  default:
    console.error('Provide valid day argument like yarn start 1');
}
