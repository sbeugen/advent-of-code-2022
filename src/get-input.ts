import axios from 'axios';
export const getInput = async (day: number): Promise<string> => {
  const sessionCookieValue = `session=${process.env.AUTH_TOKEN}`;
  const response = await axios.get(`https://adventofcode.com/2022/day/${day}/input`, {
    headers: {
      cookie: sessionCookieValue,
    },
  });

  return response.data;
};
