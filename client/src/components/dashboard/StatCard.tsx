import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { StatCardData } from "@/types";
import { Link } from "wouter";

const StatCard: React.FC<StatCardData> = ({
  title,
  value,
  change,
  icon,
  color,
  linkText,
  linkHref,
}) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary";
      case "secondary":
        return "bg-secondary";
      case "warning":
        return "bg-warning";
      case "indigo":
        return "bg-indigo-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <Card className="overflow-hidden shadow">
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div
            className={`flex-shrink-0 ${getColorClass(
              color
            )} rounded-md p-3 text-white`}
          >
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {change && (
                <div
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    change.type === "increase"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {change.type === "increase" ? (
                    <ArrowUp className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                  ) : (
                    <ArrowDown className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                  )}
                  <span className="sr-only">
                    {change.type === "increase" ? "Increased by" : "Decreased by"}
                  </span>
                  {change.value}
                </div>
              )}
            </dd>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <Link
            href={linkHref}
            className="font-medium text-primary hover:text-blue-700"
          >
            {linkText}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StatCard;
