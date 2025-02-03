import { describe, expect, test } from 'vitest';
import { calculateTimeSpent, ParentType } from './timeCalculations';

describe('Time Calculations - Core Functionality', () => {
  test('returns empty array for no children', () => {
    const result = calculateTimeSpent(1990, [], ParentType.FullTimeWork);
    expect(result).toEqual([]);
  });

  test('returns zero hours before child is born', () => {
    const result = calculateTimeSpent(1990, [
      { birthYear: 2024, daycareUsed: false }
    ], ParentType.FullTimeWork);

    const preChildYear = result.find(d => d.year === 2023);
    expect(preChildYear?.weekdayHours).toBe("0");
    expect(preChildYear?.weekendHours).toBe("0");
  });

  test('returns non-zero hours after child is born', () => {
    const result = calculateTimeSpent(1990, [
      { birthYear: 2020, daycareUsed: false }
    ], ParentType.FullTimeWork);

    const postChildYear = result.find(d => d.year === 2021);
    expect(parseFloat(postChildYear?.weekdayHours || "0")).toBeGreaterThan(0);
    expect(parseFloat(postChildYear?.weekendHours || "0")).toBeGreaterThan(0);
  });

  test('returns zero hours when child reaches 18', () => {
    const result = calculateTimeSpent(1990, [
      { birthYear: 2000, daycareUsed: false }
    ], ParentType.FullTimeWork);

    const adultYear = result.find(d => d.year === 2018);
    expect(parseFloat(adultYear?.weekdayHours || "1")).toBe(0);
    expect(parseFloat(adultYear?.weekendHours || "1")).toBe(0);
  });

  test('weekend hours are generally higher than weekday hours for working parents', () => {
    const result = calculateTimeSpent(1990, [
      { birthYear: 2020, daycareUsed: false }
    ], ParentType.FullTimeWork);

    const year2021 = result.find(d => d.year === 2021);
    expect(parseFloat(year2021?.weekendHours || "0")).toBeGreaterThan(parseFloat(year2021?.weekdayHours || "0"));
  });

  test('handles multiple children', () => {
    const result = calculateTimeSpent(1990, [
      { birthYear: 2020, daycareUsed: false },
      { birthYear: 2022, daycareUsed: false }
    ], ParentType.FullTimeWork);

    // Just verify we get data for both children's birth years
    expect(result.some(d => d.year === 2020)).toBe(true);
    expect(result.some(d => d.year === 2022)).toBe(true);
  });
}); 