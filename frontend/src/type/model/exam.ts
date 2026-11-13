export interface Exam {
  id?: string
  userId?: string
  title: string
  deadline?: string
  tagColor: TagColor
  note: string | null
}

export interface Category {
  examId: string
  color: string
  icon?: string
  title: string
  date: Date
}

export enum TagColor {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
  VIOLET = 'violet',
  ORANGE = 'orange',
  BROWN = 'brown',
  WHITE = 'white',
  BLACK = 'black',
}

export interface LegendItem {
  color: string
  titles: string[]
}
