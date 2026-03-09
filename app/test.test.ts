import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initHabits, addHabit, getHabits, toggleHabitCompletion, calculateStreak } from './script.js';

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock as any;

describe('Habit Tracker Logic', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should initialize with an empty array if storage is empty', () => {
        const initial = initHabits();
        expect(initial).toEqual([]);
    });

    it('should add a habit correctly', () => {
        const newHabit = addHabit("Read 10 pages");
        expect(newHabit.name).toBe("Read 10 pages");
        expect(newHabit.completedDates).toEqual([]);
        expect(newHabit.id).toBeDefined();
    });

    it('should retrieve added habits', () => {
        addHabit("Read 10 pages");
        const habitsList = getHabits();
        expect(habitsList.length).toBe(1);
        expect(habitsList[0].name).toBe("Read 10 pages");
    });

    it('should toggle habit completion for today', () => {
        const newHabit = addHabit("Read 10 pages");
        const today = new Date().toISOString().split('T')[0];
        
        toggleHabitCompletion(newHabit.id, today);
        let updatedHabits = getHabits();
        expect(updatedHabits[0].completedDates.includes(today)).toBe(true);
        
        // Toggle again should uncheck it
        toggleHabitCompletion(newHabit.id, today);
        updatedHabits = getHabits();
        expect(updatedHabits[0].completedDates.includes(today)).toBe(false);
    });

    it('should calculate consecutive streak accurately', () => {
        const newHabit = addHabit("Read 10 pages");
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const dayBefore = new Date();
        dayBefore.setDate(dayBefore.getDate() - 2);
        const dayBeforeStr = dayBefore.toISOString().split('T')[0];

        toggleHabitCompletion(newHabit.id, todayStr);
        toggleHabitCompletion(newHabit.id, yesterdayStr);
        toggleHabitCompletion(newHabit.id, dayBeforeStr);

        const finalHabits = getHabits();
        const streak = calculateStreak(finalHabits[0]);
        expect(streak).toBe(3);
    });
});
