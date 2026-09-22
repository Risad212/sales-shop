"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductFilterProps {
  onCategory: (category: string) => void;
  onAge: (ageGroup: string) => void;
  onSearch: (searchText: string) => void;
  onClear: () => void;
}

const CATEGORIES = ["all", "men's clothing", "women's clothing", "jewelery", "electronics", "kids", "toys"];
const LABELS: Record<string, string> = {
  all: "All",
  "men's clothing": "Men",
  "women's clothing": "Women",
  jewelery: "Jewelery",
  electronics: "Electronic",
  kids: "Kids",
  toys: "Toys",
};

const AGES = ["all", "kids", "teens", "adults", "seniors"];
const AGE_LABELS: Record<string, string> = {
  all: "All ages",
  kids: "Kids",
  teens: "Teens",
  adults: "Adults",
  seniors: "Seniors",
};

export default function ProductFilter({ onCategory, onAge, onSearch, onClear }: ProductFilterProps) {
  const [input, setInput] = useState("");
  const [active, setActive] = useState("all");
  const [activeAge, setActiveAge] = useState("all");

  const handleCategory = (category: string) => {
    setActive(category);
    onCategory(category);
  };

  const handleAge = (age: string) => {
    setActiveAge(age);
    onAge(age);
  };

  const handleClear = () => {
    setInput("");
    setActive("all");
    setActiveAge("all");
    onClear();
  };

  return (
    <div className="rounded-lg border bg-white p-5">
      <Input
        type="text"
        placeholder="Search"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          onSearch(e.target.value.toLowerCase());
        }}
        className="mb-[25px]"
      />
      <h4 className="my-[15px] text-[20px] font-semibold">Category</h4>
      <ul>
        {CATEGORIES.map((category) => (
          <li
            key={category}
            onClick={() => handleCategory(category)}
            className={`mb-[10px] cursor-pointer text-[16px] transition hover:text-[#6BB42F] ${
              active === category ? "font-semibold text-[#6BB42F]" : ""
            }`}
          >
            {LABELS[category]}
          </li>
        ))}
      </ul>
      <h4 className="my-[15px] text-[20px] font-semibold">Shop by Age</h4>
      <div className="flex flex-wrap gap-2">
        {AGES.map((age) => (
          <button
            key={age}
            onClick={() => handleAge(age)}
            className={`rounded-full border px-3 py-1 text-[13px] font-medium transition ${
              activeAge === age
                ? "border-[#6BB42F] bg-[#6BB42F] text-white"
                : "border-neutral-300 text-neutral-600 hover:border-[#6BB42F] hover:text-[#6BB42F]"
            }`}
          >
            {AGE_LABELS[age]}
          </button>
        ))}
      </div>
      <Button variant="brand" size="sm" className="mt-[15px]" onClick={handleClear}>
        CLEAR FILTERS
      </Button>
    </div>
  );
}
