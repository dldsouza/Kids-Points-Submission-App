
import { Chore } from './types';

export const INITIAL_KIDS = [
  { 
    id: '1', 
    name: 'Bryson', 
    avatar: 'https://img.icons8.com/color/512/batman-old.png', 
    totalPoints: 0 
  },
  { 
    id: '2', 
    name: 'Remy', 
    avatar: 'https://img.icons8.com/color/512/spiderman-old.png', 
    totalPoints: 0 
  }
];

export const CHORE_LIBRARY: Chore[] = [
  { id: 'c1', title: 'Make Bed', points: 5, icon: '🛏️', category: 'Daily' },
  { id: 'c18', title: 'Shower', points: 20, icon: '🚿', category: 'Daily' },
  { id: 'c2', title: 'Unload Dishwasher', points: 15, icon: '🍽️', category: 'Kitchen' },
  { id: 'c21', title: 'Load Dishwasher', points: 20, icon: '🧼', category: 'Kitchen' },
  { id: 'c3', title: 'Clean Room', points: 20, icon: '🧹', category: 'Bedroom' },
  { id: 'c4', title: 'Feed & Potty Dog', points: 10, icon: '🐕', category: 'Pets' },
  { id: 'c10', title: 'Feed Charlotte', points: 20, icon: '🥗', category: 'Pets' },
  { id: 'c19', title: 'Vacuum one room in house', points: 25, icon: '🌪️', category: 'Chores' },
  { id: 'c20', title: 'Helpful with a task', points: 10, icon: '🛍️', category: 'Chores' },
  { id: 'c22', title: 'Take out Trash', points: 10, icon: '🗑️', category: 'Chores' },
  { id: 'c23', title: 'Take out Recycling', points: 10, icon: '♻️', category: 'Chores' },
  { id: 'c9', title: 'Cat Litter', points: 15, icon: '🐈', category: 'Pets' },
  { id: 'c5', title: 'Good School Day', points: 5, icon: '🏫', category: 'Education' },
  { id: 'c6', title: 'Laundry', points: 15, icon: '👕', category: 'Chores' },
  { id: 'c11', title: 'Wash Sheets', points: 15, icon: '🧺', category: 'Chores' },
  { id: 'c12', title: 'Finished Puzzle', points: 20, icon: '🧩', category: 'Fun' },
  { id: 'c13', title: 'Finished Craft', points: 10, icon: '🎨', category: 'Fun' },
  { id: 'c14', title: 'Kind Act', points: 10, icon: '❤️', category: 'Social' },
  { id: 'c15', title: 'Disengage', points: 3, icon: '🧘', category: 'Social' },
  { id: 'c16', title: 'Deescalate', points: 10, icon: '🤝', category: 'Social' },
  { id: 'c17', title: 'Accountability', points: 15, icon: '💡', category: 'Social' },
];

export const QUICK_PURCHASES = [
  { id: 'p1', title: 'Internet Change', points: -3, icon: '🌐' },
  { id: 'p2', title: 'Treat at Store', points: -10, icon: '🍭' },
  { id: 'p3', title: 'Game Currency', points: -60, icon: '🎮' },
  { id: 'p4', title: 'Yelling', points: -10, icon: '📣' },
  { id: 'p5', title: 'Whining', points: -5, icon: '😫' },
  { id: 'p6', title: 'Disrespect', points: -20, icon: '🤐' },
  { id: 'p7', title: 'Leaving Mess', points: -10, icon: '🏚️' },
  { id: 'd1', title: 'Rough Play', points: -15, icon: '🚫' },
];

export const CATEGORIES = ['All', 'Daily', 'Kitchen', 'Bedroom', 'Pets', 'Education', 'Chores', 'Fun', 'Social'];
