import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function SearchBar({
  placeholder = "Search items, branches, codes...", onSearch, }) {
  const [query, setQuery] = useState("");

  return (
    <div className = "navbar-search">
      <Search size={18} color = "var(--muted)" strokeWidth={1.5} />
      <input
        type = "text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch?.(e.target.value);
        }}
        aria-label = "Search"
      />
      <motion.button
        className = "icon-btn"
        style={{ width: 30, height: 30 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label = "Filters"
      >
        <SlidersHorizontal size={15} color = "var(--gold)" strokeWidth={1.5} />
      </motion.button>
    </div>
  );
}