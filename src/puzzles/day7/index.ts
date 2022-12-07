import { getInput } from '../../get-input';
import { FileSystem } from './file-system';
import { identity, sum } from 'ramda';

export const seventhDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(7);

  const fileSystem = new FileSystem();

  rawInputData
    .split('\n')
    .filter(identity)
    .forEach((line) => {
      if (line.startsWith('$ cd')) {
        const directoryName = line.replace('$ cd ', '');
        fileSystem.changeDirectory(directoryName);
      } else if (line.startsWith('dir')) {
        const directoryName = line.replace('dir ', '');
        fileSystem.addChildDirectoryIfNotExists(directoryName);
      } else if (!isNaN(Number(line[0]))) {
        const [size, fileName] = line.split(' ');
        fileSystem.addFileIfNotExists(fileName, Number(size));
      }
    });

  fileSystem.changeDirectory('/');

  switch (puzzleIndex) {
    case '0':
      first(fileSystem);
      break;
    case '1':
      second(fileSystem);
      break;
    default:
      console.error('Provide 0 or 1 as puzzleArg like yarn start 1 0');
  }
};

const first = (fileSystem: FileSystem) => {
  const thresholdSize = 100000;
  const sizeOfRootDirectoryIfLowerOrEqualToThresholdSize =
    fileSystem.currentDirectory.getTotalSize() <= thresholdSize ? fileSystem.currentDirectory.getTotalSize() : 0;
  const sumOfAllChildDirectoriesLowerOrEqualToThresholdSize = sum(
    fileSystem.currentDirectory
      .getAllChildDirectories()
      .map((directory) => directory.getTotalSize())
      .filter((size) => size <= thresholdSize)
  );

  console.log(sizeOfRootDirectoryIfLowerOrEqualToThresholdSize + sumOfAllChildDirectoriesLowerOrEqualToThresholdSize);
};

const second = (fileSystem: FileSystem) => {
  const totalSpace = 70000000;
  const neededSpace = 30000000;
  const unusedSpace = totalSpace - fileSystem.currentDirectory.getTotalSize();

  const allDirectorySizes = [
    fileSystem.currentDirectory.getTotalSize(),
    ...fileSystem.currentDirectory.getAllChildDirectories().map((directory) => directory.getTotalSize()),
  ];

  console.log(allDirectorySizes.sort((a, b) => a - b).find((size) => unusedSpace + size >= neededSpace));
};
