
import { Chore } from './types';

export const INITIAL_KIDS = [
  { 
    id: '1', 
    name: 'Bryson', 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=goblin&skinColor=9e5622,763901&hair=long01&hairColor=2c1b18', 
    totalPoints: 0 
  },
  { 
    id: '2', 
    name: 'Remy', 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=cowboy&hat=cowboy&hatColor=4e342e', 
    totalPoints: 0 
  }
];

export const CHORE_LIBRARY: Chore[] = [
  { id: 'c1', title: 'Make Bed', points: 5, icon: '🛏️', category: 'Daily' },
  { id: 'c2', title: 'Unload Dishwasher', points: 15, icon: '🍽️', category: 'Kitchen' },
  { id: 'c3', title: 'Clean Room', points: 20, icon: '🧹', category: 'Bedroom' },
  { id: 'c4', title: 'Feed & Potty Dog', points: 10, icon: '🐕', category: 'Pets' },
  { id: 'c5', title: 'Good School Day', points: 5, icon: '🏫', category: 'Education' },
  { id: 'c6', title: 'Laundry', points: 15, icon: '👕', category: 'Chores' },
  { id: 'c7', title: 'Improve Skill', points: 5, icon: '🎯', category: 'Education' },
  { id: 'c8', title: 'Learn New Skill', points: 20, icon: '💡', category: 'Education' },
  { id: 'c9', title: 'Cat Litter', points: 10, icon: '🐈', category: 'Pets' },
  { id: 'c10', title: 'Feed Charlotte', points: 10, icon: '🥗', category: 'Pets' },
  { id: 'c11', title: 'Vacuum Part of House', points: 10, icon: '🌀', category: 'Chores' }
];

export const CATEGORIES = ['All', 'Daily', 'Kitchen', 'Bedroom', 'Pets', 'Education', 'Chores'];
