import axios from "axios";

const ENDPOINT = "http://13.74.31.101/api/points";

export const fetchRandomResult = async () => {
  return await axios.get(ENDPOINT);
};

export const submitResult = async (token: string, sum: Array<number>) => {
  const data = { token, points: sum };
  return await axios.post(ENDPOINT, data);
};

export const analyzeTurn = (turn: Array<number>): [boolean, boolean] => {
  const isStrike = turn[0] === 10;
  const isSpare = turn[0] + turn[1] === 10 && !isStrike;
  return [isStrike, isSpare];
};

export const reduceResult = (points: Array<Array<number>>): Array<number> => {
  return points.reduce((accumulator, current, index, source): Array<number> => {
    if (index > 9) return accumulator;
    const score = accumulator[index - 1] ?? 0;

    const [isStrike, isSpare] = analyzeTurn(current);
    const next = source[index + 1];

    if (isStrike) {
      if (!next) {
        return [...accumulator, score + getSum(current) + 10];
      } else if (next[0] === 10) {
        // 2 strikes in a row
        const nextNext = getNextNext(source, index);
        return [
          ...accumulator,
          score + getSum(current) + next[0] + nextNext[0],
        ];
      } else {
        return [...accumulator, score + getSum(current) + getSum(next)];
      }
    } else if (isSpare) {
      if (!next) {
        return [...accumulator, score + getSum(current)];
      } else {
        return [...accumulator, score + getSum(current) + next[0]];
      }
    } else {
      if (index === 0) {
        return [getSum(current)];
      } else {
        return [...accumulator, score + getSum(current)];
      }
    }
  }, []);
};

export const getSum = (turn: Array<number>) => {
  return turn[0] + turn[1];
};

const getNextNext = (source: Array<Array<number>>, index: number) => {
  if (index === 9) {
    // This is to account for strike in the last round
    const next = source[index + 1];
    return [next[1], 0];
  } else {
    return source[index + 2];
  }
};
