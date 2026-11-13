import { TagColor } from "../constants/colors.js";

export interface Exam {
  id?: string;
  userId: string;
  title: string;
  deadline?: Date;
  tagColor: TagColor;
  note?: String;
}
