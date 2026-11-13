import { TagColor } from "../constants/colors.js";

export interface Task {
  id?: string;
  examId: string;
  name: string;
  completed: boolean;
  date: Date;
  color: TagColor;
  examTitle?: string;
}
