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
import { seventhDay } from './src/puzzles/day7';
import { eighthDay } from './src/puzzles/day8';
import { ninthDay } from './src/puzzles/day9';
import { tenthDay } from './src/puzzles/day10';
import { eleventhDay } from './src/puzzles/day11';
import { twelfthDay } from './src/puzzles/day12';
import { thirteenthDay } from './src/puzzles/day13';
import { fourteenthDay } from './src/puzzles/day14';
import { fifteenthDay } from './src/puzzles/day15';
import { sixteenthDay } from './src/puzzles/day16';
import { eighteenthDay } from './src/puzzles/day18';

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
  case '7':
    await seventhDay(puzzleArg);
    break;
  case '8':
    await eighthDay(puzzleArg);
    break;
  case '9':
    await ninthDay(puzzleArg);
    break;
  case '10':
    await tenthDay(puzzleArg);
    break;
  case '11':
    await eleventhDay(puzzleArg);
    break;
  case '12':
    await twelfthDay(puzzleArg);
    break;
  case '13':
    await thirteenthDay(puzzleArg);
    break;
  case '14':
    await fourteenthDay(puzzleArg);
    break;
  case '15':
    await fifteenthDay(puzzleArg);
    break;
  case '16':
    await sixteenthDay(puzzleArg);
    break;
  case '18':
    await eighteenthDay(puzzleArg);
    break;
  default:
    console.error('Provide valid day argument like yarn start 1');
}
