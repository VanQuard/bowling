import React from "react";
import { reduceResult, getSum, analyzeTurn } from "../utils/utils";

/**
 *  Test dokumentation:
 *
 *  Der er lavet følgende analyse af forskellige bowling scenarier som skal testes.
 *
 *  Det antages at at der ikke kommer ulovlige bowling data ind, som fx:
 *  1. Negative tal
 *  2. Større tal som kan skabe overflow.
 *  3. generelt at summen på en tur [x,y], ikke overskrider 10, med mindre det er den sidste tur.
 *
 *  Cases som der skal tages højde for:
 *  1. Udregnes en Spare korrekt?
 *  En spare udregnes ved sum af sin egen tur + det næste rul.
 *  f.x ved data: [[3,7], [x,y]]
 *  Så er det kun x som skal medregnes i 3+7, uanset hvad resultatet for x er.
 *
 *  2. Udregnes en Strike korrekt?
 *  En strike udregnes ved sum af sin egen tur + de næste 2 rul.
 *  Her kan der opstå 2 scenarier:
 *      A. [[10,0], [10,0], [x, y]]
 *      B. [[10,0], [x,y]] (antagelse: x != 10)
 *  I scenarie A, hvor der laves 2 strikes i træk, skal vi hen til tredje runde før vi kan få værdien for rul nr 2.
 *  I Scenarie B, hvor der ikke laves 2 strikes i træk, behøver vi kun at indhente data fra anden runde, for at få værdien af de 2 rul, der skal medregnes i bonus,
 *  uanset om runde 2 evt. giver en spare, har det ikke påvirkning på beregningen af runde 1 der gav strike
 *
 *  3. Udregnes et normal slag korrekt?
 *  Det simpleste scenarie hvor der hverken slås strike eller spare, skal testes.
 *  Ifølge min implementation er der lavet 2 hjælpe metoder:
 *      A. getSum(turn: Array<number)
 *      B. analyzeTurn(turn: Array<number>)
 *  Metode A. getSum, kan med fordel testes individuelt, for at bekræfte at summerings metoden, og derved udregningen af et normalt slag, beregnes korrekt.
 *  Metode B. analyzeTurn, skal testes for at bekræfte at min algoritme påhviler korrekt udregning om en tur er strike eller spare.
 *
 *
 *  4. Udregnes strike på 10'ende og 11'ende tur korrekt ?
 *  Ifølge README'n udgivet fra det originale Repo, er der nogle antagelser angående strike på tur 10 og 11, som også skal testes.
 */

const spare_turns = [
  [3, 7],
  [2, 6],
];
const spare_sum_x = 3 + 7 + 2;
const spare_sum_y = spare_sum_x + 2 + 6;
const spare_sum = [spare_sum_x, spare_sum_y];

test("Udregnes en Spare korrekt", () => {
  expect(reduceResult(spare_turns)).toStrictEqual(spare_sum);
});

const strike_A_turns = [
  [10, 0],
  [10, 0],
  [6, 2],
];

const strike_A_sum_x = 10 + 10 + 6;
const strike_A_sum_y = strike_A_sum_x + 10 + 6 + 2;
const strike_A_sum_z = strike_A_sum_y + 6 + 2;

const strike_A_sum = [strike_A_sum_x, strike_A_sum_y, strike_A_sum_z];

test("Udregnes en Strike korrekt. Scenarie A", () => {
  expect(reduceResult(strike_A_turns)).toStrictEqual(strike_A_sum);
});

const strike_B_turns = [
  [10, 0],
  [6, 3],
];
const strike_B_sum_x = 10 + 6 + 3;
const strike_B_sum_y = strike_B_sum_x + 6 + 3;
const strike_B_sum = [strike_B_sum_x, strike_B_sum_y];

test("Udregnes en Strike korrekt. Scenarie B", () => {
  expect(reduceResult(strike_B_turns)).toStrictEqual(strike_B_sum);
});

test("Udregnes et normal slag korrekt", () => {
  expect(getSum([2, 3])).toBe(5);
});

test("analyzeTurn: isSpare", () => {
  expect(analyzeTurn([7, 3])).toStrictEqual([false, true]);
});

test("analyzeTurn: isStrike", () => {
  expect(analyzeTurn([10, 0])).toStrictEqual([true, false]);
});

test("analyzeTurn: normal", () => {
  expect(analyzeTurn([2, 3])).toStrictEqual([false, false]);
});

const strike_10_turns = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [10, 0],
  [10, 10],
];

const strike_10_sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 30];

test("Udregnes strike på 10'ende og 11'ende tur korrekt", () => {
  expect(reduceResult(strike_10_turns)).toStrictEqual(strike_10_sum);
});
