import { createContext, useContext, useState } from "react";
import {
  branches as seedBranches,
  users as seedUsers,
  itemGroups as seedItemGroups,
  categories as seedCategories,
  items as seedItems,
} from "../data/mockData";

// Central in-memory store for the prototype. Every management screen reads
// and writes through this context, so a category added on the Categories
// page immediately appears in every Add Item dropdown, edits to a branch
// show up on dashboards, and so on.
const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  const [branches, setBranches] = useState(seedBranches);
  const [users, setUsers] = useState(seedUsers);
  const [itemGroups, setItemGroups] = useState(seedItemGroups);
  const [categories, setCategories] = useState(seedCategories);
  const [items, setItems] = useState(seedItems);

  return (
    <DataContext.Provider
      value={{
        branches,
        setBranches,
        users,
        setUsers,
        itemGroups,
        setItemGroups,
        categories,
        setCategories,
        items,
        setItems,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
