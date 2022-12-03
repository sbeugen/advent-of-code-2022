import { getInput } from '../../get-input';
import { concat, countBy, identity, last, sum, uniq } from 'ramda';

export const thirdDay = async (puzzleIndex: string) => {
  const rawInputData = await getInput(3);
  const preparedInputData = rawInputData.split('\n').filter(identity);

  switch (puzzleIndex) {
    case '0':
      first(preparedInputData);
      break;
    case '1':
      second(preparedInputData);
      break;
    default:
      console.error('Provide 0 or 1 as puzzleArg like yarn start 1 0');
  }
};

const first = (input: string[]) => {
  console.log(
    sum(
      input.map((content) => {
        const contentByCompartments = [content.slice(0, content.length / 2), content.slice(content.length / 2)];
        const uniqueContentsByCompartments = contentByCompartments.map((contentInCompartment) =>
          uniq(contentInCompartment.split(''))
        );
        const countPerItem = countBy(
          identity,
          concat(uniqueContentsByCompartments[0], uniqueContentsByCompartments[1])
        );
        return sum(
          Object.entries(countPerItem)
            .filter(([_, value]) => value > 1)
            .map(([key]) => getItemValue(key))
        );
      })
    )
  );
};

const second = (input: string[]) => {
  const uniqueItemsInput = input.map((content) => uniq(content.split('')).join(''));

  const groupedBackpackContents = uniqueItemsInput.reduce<string[][]>(
    (acc, content) => {
      const lastChunk = last(acc)!;

      if (lastChunk.length < 3) {
        lastChunk.push(content);
        return acc;
      }

      return [...acc, [content]];
    },
    [[]]
  );

  console.log(
    sum(
      groupedBackpackContents.map((group) => {
        const countPerItem = countBy(identity, (group[0] + group[1] + group[2]).split(''));
        return getItemValue(Object.entries(countPerItem).find(([_, value]) => value === 3)![0]);
      })
    )
  );
};

const getItemValue = (itemName: string): number => {
  const charCode = itemName.charCodeAt(0);

  if (charCode >= 65 && charCode <= 90) {
    return charCode - 38;
  } else if (charCode >= 97 && charCode <= 122) {
    return charCode - 96;
  }

  throw Error(`itemName ${itemName} is not a letter`);
};
