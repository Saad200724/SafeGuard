import { ChevronDown } from "lucide-react";
import { useState } from "react";

type Child = {
  id: string;
  name: string;
  device: string;
};

type ChildSelectorProps = {
  children: Child[];
  onChange?: (child: Child) => void;
};

const ChildSelector = ({ children, onChange }: ChildSelectorProps) => {
  const [selectedChild, setSelectedChild] = useState<Child>(children[0]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = children.find(child => `${child.name} (${child.device})` === e.target.value);
    if (selected) {
      setSelectedChild(selected);
      if (onChange) {
        onChange(selected);
      }
    }
  };

  return (
    <div className="relative">
      <select 
        className="appearance-none bg-white border border-slate-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        value={`${selectedChild.name} (${selectedChild.device})`}
        onChange={handleChange}
      >
        {children.map(child => (
          <option key={child.id} value={`${child.name} (${child.device})`}>
            {child.name} ({child.device})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
};

export default ChildSelector;
