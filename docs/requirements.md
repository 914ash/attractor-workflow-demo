# Habit Tracker Requirements

## Overview
A web-based tracker designed for user convenience and privacy. It tracks daily routines, calculates consistency, and acts as a digital ledger for self-improvement.

## Core Features
1. **Local-first Architecture**:
   - All habit data MUST be stored in the browser's `localStorage`.
   - No backend servers, databases, or accounts needed. Total privacy.
2. **Daily Check-ins**:
   - Ability to mark a habit as "Complete" or "Incomplete" for the *current day*.
   - A visual representation (e.g., checkboxes, toggle buttons) for quick actions.
3. **Habit Management**:
   - Add new habits by name.
   - Delete existing habits.
   - Edit habit names (optional, good to have).
4. **Progress & Streaks**:
   - Calculate and display the *Current Streak* (number of consecutive days completed).
   - Calculate and display the *Highest Streak* (all-time best consistency).
5. **Intuitive UI**:
   - Clean, modern interface (using Tailwind CSS).
   - Mobile-responsive design for on-the-go tracking.

## Technical Stack
- **Framework**: React (using Vite for fast building).
- **Styling**: Tailwind CSS.
- **State Management**: React Context or simple component state (lifted up).
- **Storage**: Browser `localStorage` API.

## Data Model (Suggested)
```typescript
interface Habit {
  id: string; // UUID or unique timestamp
  name: string;
  createdAt: number; // timestamp
  completedDates: string[]; // Array of date strings (e.g., 'YYYY-MM-DD')
  currentStreak: number;
  longestStreak: number;
}
```
