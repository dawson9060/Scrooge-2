import { RecurringExpense, UniqueExpense } from "@/types/app";
import { atom } from "jotai";

export const showRemindersAtom = atom(false);
export const surplusAtom = atom(0);
export const selectedUniqueExpenseAtom = atom<UniqueExpense | null>();
export const selectedRecurringExpenseAtom = atom<RecurringExpense | null>();
