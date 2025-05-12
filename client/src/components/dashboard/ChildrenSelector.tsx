import React from "react";
import { Child } from "@/types";
import { Plus } from "lucide-react";
import { Link } from "wouter";

interface ChildrenSelectorProps {
  children: Child[];
  selectedChild: Child | null;
  onSelectChild: (child: Child) => void;
}

const ChildrenSelector: React.FC<ChildrenSelectorProps> = ({
  children,
  selectedChild,
  onSelectChild,
}) => {
  return (
    <div className="mt-5 border-b border-gray-200">
      <div className="sm:flex sm:items-baseline">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Children</h3>
        <div className="mt-2 sm:mt-0 sm:ml-4">
          <nav className="-mb-px flex space-x-4">
            {children.map((child) => (
              <a
                key={child.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectChild(child);
                }}
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                  selectedChild?.id === child.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {child.name} ({child.age})
              </a>
            ))}
            <button className="text-primary ml-2 hover:text-primary-dark">
              <Plus className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ChildrenSelector;
