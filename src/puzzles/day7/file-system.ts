import { sum } from 'ramda';

export class Directory {
  childDirectories: Directory[] = [];
  files: File[] = [];

  constructor(public name: string, public parentDirectory: Directory | null) {}

  addDirectory = (directoryName: string) => {
    const directory = new Directory(directoryName, this);
    this.childDirectories.push(directory);
  };

  addFile = (fileName: string, size: number) => {
    const file = new File(fileName, size);
    this.files.push(file);
  };

  getTotalSize = (): number => {
    const totalSizeOfOwnFiles = sum(this.files.map((file) => file.size));

    return totalSizeOfOwnFiles + sum(this.childDirectories.map((directory) => directory.getTotalSize()));
  };

  findChildDirectory = (directoryName: string) =>
    this.childDirectories.find((directory) => directory.name === directoryName);

  findFile = (fileName: string) => this.files.find((file) => file.name === fileName);

  getAllChildDirectories = (): Directory[] => {
    return this.childDirectories.flatMap((childDirectory) => [
      childDirectory,
      ...childDirectory.getAllChildDirectories(),
    ]);
  };
}

export class File {
  constructor(public name: string, public size: number) {}
}

const rootDirectory = new Directory('/', null);

export class FileSystem {
  constructor(public currentDirectory: Directory = rootDirectory) {}

  changeDirectory = (directoryName: string) => {
    if (directoryName === '/') {
      this.currentDirectory = rootDirectory;
    } else if (directoryName === '..') {
      if (!this.currentDirectory.parentDirectory) {
        throw Error(`${this.currentDirectory.name} does not have a parent directory`);
      }
      this.currentDirectory = this.currentDirectory.parentDirectory;
    } else {
      const childDirectory = this.currentDirectory.findChildDirectory(directoryName);
      if (!childDirectory) {
        throw Error(`${directoryName} is not a valid child directory of ${this.currentDirectory.name}`);
      }
      this.currentDirectory = childDirectory;
    }
  };

  addChildDirectoryIfNotExists = (directoryName: string) => {
    const childDirectory = this.currentDirectory.findChildDirectory(directoryName);
    if (!childDirectory) {
      this.currentDirectory.addDirectory(directoryName);
    }
  };

  addFileIfNotExists(fileName: string, size: number) {
    const file = this.currentDirectory.findFile(fileName);
    if (!file) {
      this.currentDirectory.addFile(fileName, size);
    }
  }
}
