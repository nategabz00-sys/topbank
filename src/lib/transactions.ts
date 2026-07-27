import type { ReactNode } from "react";

export type Transaction = {
  id: number;
  name: string;
  cat: string;
  description: string;
  time: string;
  amount: number;
  in: boolean;
};

export const transactions: Transaction[] = [
  {
    id: 1,
    name: "Starbucks Reserve",
    cat: "Coffee & Snacks",
    description: "Morning latte and pastry",
    time: "Today · 9:12 AM",
    amount: -285,
    in: false,
  },
  {
    id: 2,
    name: "Salary — Acme Corp",
    cat: "Income",
    description: "Monthly payroll deposit",
    time: "Yesterday · 6:00 PM",
    amount: 52000,
    in: true,
  },
  {
    id: 3,
    name: "Grab Ride",
    cat: "Transport",
    description: "Ride to the office",
    time: "Yesterday · 10:24 AM",
    amount: -142,
    in: false,
  },
  {
    id: 4,
    name: "Round-Up Savings",
    cat: "Auto-save",
    description: "Small automatic save",
    time: "Mon · 8:01 PM",
    amount: -18,
    in: false,
  },
  {
    id: 5,
    name: "Cash In via Maya",
    cat: "Cash In",
    description: "Fund transfer from e-wallet",
    time: "Sun · 5:24 PM",
    amount: 5000,
    in: true,
  },
  {
    id: 6,
    name: "Meralco Payment",
    cat: "Bills Payment",
    description: "Electricity bill settlement",
    time: "Sun · 3:40 PM",
    amount: -1250,
    in: false,
  },
  {
    id: 7,
    name: "Refund — Shopee",
    cat: "Refund",
    description: "Returned purchase credit",
    time: "Sat · 2:15 PM",
    amount: 350,
    in: true,
  },
  {
    id: 8,
    name: "ATM Withdrawal",
    cat: "Withdrawal",
    description: "Cash withdrawal from ATM",
    time: "Fri · 4:05 PM",
    amount: -2000,
    in: false,
  },
  {
    id: 9,
    name: "E-wallet Transfer",
    cat: "E-wallet Transfer",
    description: "Payment to digital wallet",
    time: "Thu · 1:12 PM",
    amount: -500,
    in: false,
  },
];

export type WeeklySpending = {
  day: string;
  short: string;
  amount: number;
};

export const weeklySpending: WeeklySpending[] = [
  { day: "Monday", short: "M", amount: 780 },
  { day: "Tuesday", short: "T", amount: 1450 },
  { day: "Wednesday", short: "W", amount: 920 },
  { day: "Thursday", short: "T", amount: 610 },
  { day: "Friday", short: "F", amount: 1310 },
  { day: "Saturday", short: "S", amount: 1780 },
  { day: "Sunday", short: "S", amount: 1040 },
];
