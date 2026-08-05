export interface DayMenu {
  breakfast: string
  lunch: string
  snacks: string
  dinner: string
}

export const MEAL_TIMES = {
  breakfast: { label: '8:00 - 9:30 AM', start: '08:00', end: '09:30' },
  lunch: { label: '12:30 - 2:30 PM', start: '12:30', end: '14:30' },
  snacks: { label: '5:30 - 6:30 PM', start: '17:30', end: '18:30' },
  dinner: { label: '8:00 - 9:30 PM', start: '20:00', end: '21:30' },
}

export const WEEK_1: Record<string, DayMenu> = {
  Monday: {
    breakfast: 'Aloo Paratha, Curd, Pickle, Vermicelli, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Black Chana Masala Fry, Palak Paneer, Chapati, Steam Rice, Dal Tadka, Rasam, Buttermilk, Salad, Papad & Pickle',
    snacks: 'Dhokla, Tea & Coffee, Fruits',
    dinner: 'Dal Makhani, Jeera Rice, Methi Aloo Sabzi, Chapati, Salad, Pickle, Jalebi',
  },
  Tuesday: {
    breakfast: 'Idli Wada Sambar, Tomato Spicy Chutney, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Soyabean, Dum Aloo, Dal Fry, Steam Rice, Chapati, Salad, Papad, Pickle, Boondi Raita, Sambhar',
    snacks: 'Vada Pav, Green Chutney, Red Chutney, Deep Fried Green Chilli, Tea & Coffee',
    dinner: 'Corn Capsicum Masala, Chana Dal, Jeera Rice, Chapati, Salad, Sevai Kheer',
  },
  Wednesday: {
    breakfast: 'Aloo Sabji, Poori, Poha, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Cabbage Matar Dry, Kadhi Pakoda, Dal Fry, Chapati, Jeera Rice, Sambhar, Nimbu Paani, Chopped Onions, Papad',
    snacks: 'Masala Maggi, Tea & Coffee',
    dinner: 'Egg Masala, Kadhai Paneer, Dal Tadka, Steam Rice, Chapati, Salad, Pickle, Besan Barfi',
  },
  Thursday: {
    breakfast: 'Misal Pav, Upma, Farsan, Bread, Jam, Butter, Tea & Coffee',
    lunch: 'Poori, Pindi Chole Masala, Green Peas Pulao, Lassi, Chopped Onions, Papad',
    snacks: 'Hakka Noodles, Tea & Coffee',
    dinner: 'Rajasthani Dahi, Sev Tamatar, Steam Rice, Chapati, Salad, Pickle, Dahi Vada',
  },
  Friday: {
    breakfast: 'Idli Wada Sambar, Tomato Spicy Chutney, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Aloo Gobhi, Steam Rice, Dal Makhani, Chapati, Salad, Pickle, Rasam, Papad, Nimbu Paani',
    snacks: 'White Bread Cutlet, Green Chutney, Fruits, Tea & Coffee',
    dinner: 'Tomato Rice, Matki Gravy, Veg Kolhapuri, Chapati, Salad, Onion Raita, Shahi Tukda',
  },
  Saturday: {
    breakfast: 'Thepla, Upma Sev, Bread, Jam, Butter, Tea & Coffee',
    lunch: 'Rajma Masala, Rajasthani Bhindi, Dal Masoor, Jeera Rice, Sambhar, Chapati, Salad, Papad, Curd',
    snacks: 'Macaroni, Tea & Coffee',
    dinner: 'Fried Rice, Egg Fried Rice, Manchurian Semi Gravy, Chopped Onion, Ice Cream',
  },
  Sunday: {
    breakfast: 'Tarri Poha, Chopped Onions, Tea & Coffee, Boiled Egg, Banana, Bread Butter Jam',
    lunch: 'Aloo Puri, Veg Pulao, Methi Dal, Chopped Onion, Papad, Pickle, Lassi',
    snacks: 'Kachori Chaat (Imly Chutney), Tea & Coffee',
    dinner: 'Paneer Do Payaza, Soyabean Spicy Biryani, Chopped Onion, Raita, Fruit Custard, Roti',
  },
}

export const WEEK_2: Record<string, DayMenu> = {
  Monday: {
    breakfast: 'Paneer Paratha, Curd, Pickle, Upma Sev, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Kadhi Pakoda, Masoor Dal Dry, Steam Rice, Chapati, Salad, Papad & Pickle, Nimbu Paani, Sambhar',
    snacks: 'Dabeli, Green and Imly Chutney, Tea & Coffee',
    dinner: 'Aloo Masala, Lauki Dal, Steam Rice, Chapati, Dal Makhani, Salad, Pickle, Shrikhand',
  },
  Tuesday: {
    breakfast: 'Idli Wada Sambar, Chutney, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Baigan Masala, Mix Veg, Dal Kolhapuri, Steam Rice, Papad, Chapati, Rasam, Masala Chhach',
    snacks: 'Masala Maggi, Tea & Coffee',
    dinner: 'Tomato Bharta, Tawa Vegetable, Dal Tadka, Steam Rice, Chapati, Salad, Pickle, Dry Fruit Sheera',
  },
  Wednesday: {
    breakfast: 'Methi Paratha, Coconut Chutney, Upma Sev, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Palak Poori, Aloo-Chole Masala, Jeera Rice, Dal Lasuni, Lassi, Chopped Onions, Papad',
    snacks: 'Masala Idli, Fruits, Tea & Coffee',
    dinner: 'Paneer Lababdar, Egg Masala, Dal Tadka, Steam Rice, Chapati, Salad, Pickle, Moong Dal Halwa',
  },
  Thursday: {
    breakfast: 'Uttapam, Aloo Curry, Tomato Chutney, Vermicelli, Tea & Coffee',
    lunch: 'Black Chana Masala, Dum Aloo, Dal Tadka, Steam Rice, Chapati, Salad, Papad, Pickle, Curd, Sambhar',
    snacks: 'Ragda Patties, Chutney, Tea & Coffee',
    dinner: 'Sev Bhaji, Aloo Gobi Fry, Steam Rice, Dal Kolhapuri, Chapati, Salad, Pickle & Gulab Jamun',
  },
  Friday: {
    breakfast: 'Misal Pav, Aloo Sabudana Khichdi, Farsan, Bread, Jam, Butter, Tea & Coffee',
    lunch: 'Rajma Masala, Rajasthani Bhindi, Chapati, Jeera Rice, Dal Fry, Rasam, Chopped Onions, Papad, Nimbu Paani',
    snacks: 'Pani Puri, Hot Ragda, Tea & Coffee',
    dinner: 'Palak Paneer, Steam Rice, Dal Kolhapuri, Chapati, Salad, Pickle, Lauki Halwa',
  },
  Saturday: {
    breakfast: 'Idli Wada Sambar, Chutney, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Paneer Butter Masala, Lobia Masala, Chapati, Jeera Rice, Dal Fry, Rasam, Chopped Onions, Papad, Buttermilk',
    snacks: 'Bhel Puri, Fruits, Tea & Coffee',
    dinner: 'Fried Rice, Egg Fried Rice, Manchurian Semi Gravy, Chopped Onion, Ice Cream',
  },
  Sunday: {
    breakfast: 'Poha, Coconut Chutney, Banana, Tea & Coffee, Boiled Egg, Bread Butter Jam',
    lunch: 'Chole Bhature, Veg Pulao, Methi Dal, Chopped Onion, Papad, Pickle, Lassi',
    snacks: 'Singaporean Noodles, Tea & Coffee',
    dinner: 'Pav Bhaji, Paneer Handi Biryani Spicy, Chopped Onion, Mix Vegetable Raita, Fruit Custard',
  },
}

// Anchor: Monday, August 3, 2026 is the confirmed start of "1st Week Aug 2026" (Week 1)
const ANCHOR_MONDAY = new Date(2026, 7, 3) // month is 0-indexed: 7 = August

function getMondayOf(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diffToMonday)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getActiveWeekNumber(date: Date = new Date()): 1 | 2 {
  const thisMonday = getMondayOf(date)
  const diffMs = thisMonday.getTime() - ANCHOR_MONDAY.getTime()
  const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000))
  const isEven = ((diffWeeks % 2) + 2) % 2 === 0
  return isEven ? 1 : 2
}

export function getMenuForWeek(weekNumber: 1 | 2): Record<string, DayMenu> {
  return weekNumber === 1 ? WEEK_1 : WEEK_2
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function getTodayMenu(date: Date = new Date()): DayMenu {
  const weekNumber = getActiveWeekNumber(date)
  const menu = getMenuForWeek(weekNumber)
  const dayName = DAY_NAMES[date.getDay()]
  return menu[dayName]
}

type MealKey = 'breakfast' | 'lunch' | 'snacks' | 'dinner'

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function getCurrentOrNextMeal(date: Date = new Date()): {
  status: 'current' | 'next' | 'done'
  meal: MealKey | null
  label: string | null
  timeLabel: string | null
} {
  const nowMinutes = date.getHours() * 60 + date.getMinutes()
  const order: MealKey[] = ['breakfast', 'lunch', 'snacks', 'dinner']

  for (const meal of order) {
    const t = MEAL_TIMES[meal]
    const start = timeToMinutes(t.start)
    const end = timeToMinutes(t.end)
    if (nowMinutes >= start && nowMinutes <= end) {
      return { status: 'current', meal, label: meal, timeLabel: t.label }
    }
  }

  for (const meal of order) {
    const t = MEAL_TIMES[meal]
    const start = timeToMinutes(t.start)
    if (nowMinutes < start) {
      return { status: 'next', meal, label: meal, timeLabel: t.label }
    }
  }

  return { status: 'next', meal: 'breakfast', label: 'breakfast', timeLabel: MEAL_TIMES.breakfast.label + ' (tomorrow)' }
}
