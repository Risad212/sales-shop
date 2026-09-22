export interface Rating {
  rate: number;
  count: number;
}

export type AgeGroup = "kids" | "teens" | "adults" | "seniors" | "all";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  ageGroup: AgeGroup;
  rating: Rating;
}

export interface BlogPost {
  img: string;
  date: string;
  title: string;
}

export interface Category {
  category: string;
  title: string;
  img: string;
}

export interface CartTotal {
  amount: number;
  sign: "plus" | "minus" | null;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
