// app/account/locales/dictionary-hook.ts
"use client";

import { useContext } from "react";
import { DictionaryContext } from "./DictionaryProvider";

export default function useDictionary() {
  const dictionary = useContext(DictionaryContext);

  if (!dictionary) {
    throw new Error(
      "useDictionary hook must be used within DictionaryProvider"
    );
  }

  return dictionary;
}
