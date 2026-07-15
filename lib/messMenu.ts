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
    snacks: 'Dhokla and Imly Chutney, Fruits, Tea & Coffee',
    dinner: 'Dal Makhani, Jeera Rice, Baigan Kaala Masala, Cabbage Dry, Chapati, Salad, Pickle, Shrikhand',
  },
  Tuesday: {
    breakfast: 'Idli Wada Sambar, Tomato Spicy Chutney, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Rajasthani Bhindi, Dum Aloo, Dal Fry, Steam Rice, Chapati, Salad, Papad, Pickle, Curd, Sambhar',
    snacks: 'Vada Pav, Green Chutney, Red Chutney, Deep Fried Green Chilli, Tea & Coffee',
    dinner: 'Rajasthani Dahi, Sev Tamatar, Steam Rice, Chapati, Salad, Pickle, Sevayi Kheer',
  },
  Wednesday: {
    breakfast: 'Onion Uttapam, Tomato Spicy Chutney, Upma Sev, Bread, Jam, Butter, Tea & Coffee',
    lunch: 'Poori, Pindi Chole Masala, Green Peas Pulao, Lassi, Chopped Onions, Pickle',
    snacks: 'Veg Maggi, Tea & Coffee',
    dinner: 'Egg Masala, Kadhai Paneer, Dal Tadka, Jeera Rice, Chapati, Salad, Pickle, Jalebi',
  },
  Thursday: {
    breakfast: 'Misal Pav, Upma Sev, Bread, Jam, Butter, Tea & Coffee',
    lunch: 'Kadhi Pakoda, Black Chana, Dal Tadka, Chapati, Rasam, Chopped Onions, Papad, Buttermilk',
    snacks: 'Masala Idli, Coconut Chutney, Fruit, Tea & Coffee',
    dinner: 'Aloo Gobhi, Steam Rice, Dal Kolhapuri, Chapati, Salad, Pickle, Gulab Jamun',
  },
  Friday: {
    breakfast: 'Chole Kulche, Sabudana Khichdi, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Soyabean, Paneer Kadai, Spicy Chapati, Jeera Rice, Dal Fry, Rasam, Chopped Onions, Papad, Rasna',
    snacks: 'Veg Sandwich, Tea & Coffee',
    dinner: 'Tomato Rice, Aloo Sabji Dry, Masoor Dal, Chapati, Salad, Onion, Raita, Rice Kheer',
  },
  Saturday: {
    breakfast: 'Aloo Sabji, Poori, Poha, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Lobia, Cabbage Sookha, Dal Fry, Chapati, Jeera Rice, Sambhar, Nimbu Paani, Chopped Onions, Papad',
    snacks: 'Kachori Chaat (Imly Chutney), Tea & Coffee',
    dinner: 'Fried Rice, Egg Fried Rice, Manchurian Semi Gravy, Chopped Onion, Ice Cream',
  },
  Sunday: {
    breakfast: 'Poha, Tea & Coffee, Boiled Egg, Banana',
    lunch: 'Chole Bhature, Veg Pulao, Methi Dal, Chopped Onion, Papad, Pickle, Lassi',
    snacks: 'White Sauce Pasta, Fruits, Tea & Coffee',
    dinner: 'Paneer Bhurji, Soyabean Spicy Biryani, Chapati, Salad, Raita & Gulab Jamun',
  },
}

export const WEEK_2: Record<string, DayMenu> = {
  Monday: {
    breakfast: 'Paneer Paratha, Curd, Pickle, Upma Sev, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Baigan Masala, Soyabean Dry, Dal Kolhapuri, Steam Rice, Papad, Chapati, Rasam, Masala Chhach',
    snacks: 'Dabeli, Green and Imly Chutney, Tea & Coffee',
    dinner: 'Babycorn Capsicum Masala, Gobi Aloo Dry, Steam Rice, Chapati, Dal Fry, Salad, Pickle, Shrikhand',
  },
  Tuesday: {
    breakfast: 'Idli Wada Sambar, Coconut Chutney, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Kadhi Pakoda, Akka Masoor Masala, Steam Rice, Chapati, Salad, Papad & Pickle, Nimbu Paani, Sambhar',
    snacks: 'Corn Chaat, Fruits, Tea & Coffee',
    dinner: 'Paneer Butter Masala, Egg Masala, Dal Tadka, Jeera Rice, Chapati, Salad, Pickle, Moong Dal Halwa',
  },
  Wednesday: {
    breakfast: 'Thepla, Tomato Chutney, Upma Sev, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Palak Poori, Aloo-Chole Masala, Jeera Rice, Dal Lasuni, Lassi, Chopped Onions, Papad',
    snacks: 'Veg Maggi, Tea & Coffee',
    dinner: 'Veg Kolhapuri, Aloo Jeera, Dal Fry, Steam Rice, Chapati, Salad, Pickle, Dry Fruit Sheera',
  },
  Thursday: {
    breakfast: 'Onion Uttapam, Tomato Chutney, Vermicelli, Tea & Coffee',
    lunch: 'Pumpkin, Dum Aloo, Dal Tadka, Steam Rice, Chapati, Salad, Papad, Pickle, Curd, Sambhar',
    snacks: 'White Bread Cutlet with Chutney, Tea & Coffee',
    dinner: 'Paneer Bhurji, Steam Rice, Dal Kolhapuri, Chapati, Salad, Pickle, Lauki Halwa',
  },
  Friday: {
    breakfast: 'Misal Pav, Upma Sev, Bread, Jam, Butter, Tea & Coffee',
    lunch: 'Kadhi Pakoda, Dal Fry, Lobia Masala, Steam Rice, Rasam, Chapati, Salad, Pickle, Rasna',
    snacks: 'Pani Puri with Hot Ragda, Tea & Coffee',
    dinner: 'Anda Masala Fry, Sev Bhaji, Chapati, Dal Tadka, Jeera Rice, Salad, Pickle, Ice Cream',
  },
  Saturday: {
    breakfast: 'Idli Wada Sambar, Tomato Spicy Chutney, Bread, Butter, Jam, Tea & Coffee',
    lunch: 'Rajma Masala, Soyabean, Dal Fry, Jeera Rice, Sambhar, Chapati, Salad, Papad, Curd',
    snacks: 'Veg Sandwich, Chutney, Fruits, Tea & Coffee',
    dinner: 'Pav Bhaji, Paneer Handi Biryani Spicy, Chopped Onion, Raita, Fruit Custard',
  },
  Sunday: {
    breakfast: 'Poha, Coconut Chutney, Banana, Tea & Coffee, Boiled Egg',
    lunch: 'Chole Bhature, Veg Pulao, Methi Dal, Chopped Onion, Papad, Pickle, Lassi',
    snacks: 'Bread Pakoda, Chutney, Tea & Coffee',
    dinner: 'Paneer Bhurji, Steam Rice, Dal Kolhapuri, Chapati, Salad, Pickle & Gulab Jamun',
  },
}

// Anchor: Monday, July 13, 2026 is a confirmed Week 1 Monday.
const ANCHOR_MONDAY = new Date(2026, 6, 13) // month is 0-indexed: 6 = July

function getMondayOf(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday
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

  return { status: 'done', meal: null, label: null, timeLabel: null }
}
