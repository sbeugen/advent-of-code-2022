import { firstDay } from './src/puzzles/day1';
import * as dotenv from 'dotenv';
import { secondDay } from './src/puzzles/day2';

dotenv.config();

const [dayArg, puzzleArg] = process.argv.slice(2);

switch (dayArg) {
  case '1':
    await firstDay(puzzleArg);
    break;
  case '2':
    await secondDay(puzzleArg);
    break;
  default:
    console.error('Provide valid day argument like yarn start 1');
}
