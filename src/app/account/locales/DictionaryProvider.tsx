"use client";

import { createContext } from "react";

export const DictionaryContext = createContext<any>(null);

export default function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: any;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}
