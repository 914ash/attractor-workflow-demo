const STORAGE_KEY = 'minimal_habits';

function getHabits() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveHabits(habits) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function initHabits() {
    return getHabits();
}

function addHabit(name) {
    const habits = getHabits();
    const newHabit = {
        id: Date.now().toString(),
        name: name,
        completedDates: [],
        createdAt: new Date().toISOString()
    };
    habits.push(newHabit);
    saveHabits(habits);
    return newHabit;
}

function toggleHabitCompletion(id, dateStr) {
    const habits = getHabits();
    const habitIndex = habits.findIndex(h => h.id === id);
    if (habitIndex > -1) {
        const habit = habits[habitIndex];
        const dateIndex = habit.completedDates.indexOf(dateStr);

        if (dateIndex > -1) {
            // Uncheck
            habit.completedDates.splice(dateIndex, 1);
        } else {
            // Check
            habit.completedDates.push(dateStr);
        }

        habits[habitIndex] = habit;
        saveHabits(habits);
    }
}

function calculateStreak(habit) {
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;
    
    // Sort dates chronological
    const sorted = [...habit.completedDates].sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
    
    let current = 1;
    let longest = 1;
    let streak = 1;
    
    for (let i = 1; i < sorted.length; i++) {
        const prevDate = new Date(sorted[i-1]);
        const currDate = new Date(sorted[i]);
        const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            streak++;
            longest = Math.max(longest, streak);
        } else if (diffDays > 1) {
            streak = 1;
        }
    }

    // Check if current streak is still active (completed today or yesterday)
    const today = new Date();
    today.setHours(0,0,0,0);
    const lastCompleted = new Date(sorted[sorted.length - 1]);
    lastCompleted.setHours(0,0,0,0);
    
    const diffTime = Math.abs(today.getTime() - lastCompleted.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    current = diffDays <= 1 ? Math.max(streak, current) : 0;
    
    return current;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initHabits, addHabit, getHabits, toggleHabitCompletion, calculateStreak };
}

// --- DOM LOGIC ---
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('add-habit-form');
        const input = document.getElementById('habit-input');
        const list = document.getElementById('habits-list');

        function render() {
            const habits = getHabits();
            list.innerHTML = ''; // Clear list

            if (habits.length === 0) {
                list.innerHTML = '<li style="text-align: center; color: var(--text-muted); padding: 2rem;">No habits yet. Start small!</li>';
                return;
            }

            const todayStr = new Date().toISOString().split('T')[0];

            habits.forEach(habit => {
                const isCompletedToday = habit.completedDates.includes(todayStr);
                const streak = calculateStreak(habit);

                const li = document.createElement('li');
                li.className = 'habit-item';

                li.innerHTML = `
          <div class="habit-info">
            <span class="habit-name">${escapeHTML(habit.name)}</span>
            <span class="habit-streak">
              <svg class="streak-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.5 12.5L20 9l-4-3-1 4-5-3-2 10h12l-2.5-4.5zM4 22h16v-2H4v2z"/></svg>
              ${streak} Day Streak
            </span>
          </div>
          <button class="check-btn ${isCompletedToday ? 'completed' : ''}" aria-label="Mark completed" data-id="${habit.id}">
            <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        `;

                // Attach event listener
                const btn = li.querySelector('.check-btn');
                btn.addEventListener('click', () => {
                    toggleHabitCompletion(habit.id, todayStr);
                    render(); // Re-render to update UI and streak
                });

                list.appendChild(li);
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = input.value.trim();
            if (val) {
                addHabit(val);
                input.value = '';
                render();
            }
        });

        // Initial render
        initHabits();
        render();
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

