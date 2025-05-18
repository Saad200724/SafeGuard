import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { Child, BrowsingHistoryItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  Globe,
  Search,
  Filter,
  ChevronDown,
  ExternalLink
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const BrowsingHistoryPage = () => {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Fetch children data
  const { data: childrenData, isLoading: childrenLoading } = useQuery({
    queryKey: ["/api/children"],
    onSuccess: (data) => {
      if (data && data.length > 0 && !selectedChild) {
        setSelectedChild(data[0]);
      }
    },
  });

  // Fetch browsing history for the selected child
  const { data: browsingHistoryData, isLoading: historyLoading } = useQuery({
    queryKey: ["/api/browsing-history", selectedChild?.id],
    enabled: !!selectedChild,
  });

  // Sample browsing history data
  const browsingSampleData: BrowsingHistoryItem[] = [
    {
      id: 1,
      url: "https://www.google.com",
      title: "Google",
      timestamp: new Date(),
      duration: 5,
    },
    {
      id: 2,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "YouTube - Educational Video",
      timestamp: new Date(Date.now() - 30 * 60000),
      duration: 15,
    },
    {
      id: 3,
      url: "https://www.khanacademy.org/math",
      title: "Khan Academy - Math",
      timestamp: new Date(Date.now() - 60 * 60000),
      duration: 25,
    },
    {
      id: 4,
      url: "https://www.wikipedia.org",
      title: "Wikipedia - Encyclopedia",
      timestamp: new Date(Date.now() - 90 * 60000),
      duration: 10,
    },
  ];

  const history = browsingHistoryData || browsingSampleData;

  // Filter history based on search term and filter type
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.url.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "social") return matchesSearch && item.url.includes("social");
    if (filterType === "education") return matchesSearch && (item.url.includes("education") || item.url.includes("khan"));
    if (filterType === "entertainment") return matchesSearch && (item.url.includes("youtube") || item.url.includes("game"));
    
    return matchesSearch;
  });

  // Format time from timestamp
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format duration in minutes
  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  const handleClearHistory = () => {
    toast({
      title: "History cleared",
      description: "Browsing history has been cleared successfully.",
    });
  };

  return (
    <MainLayout title="Browsing History">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Web Browsing History</h2>
          <Button variant="destructive" onClick={handleClearHistory}>
            Clear History
          </Button>
        </div>

        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Browse Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search websites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter: {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterType("all")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("social")}>
                    Social Media
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("education")}>
                    Education
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("entertainment")}>
                    Entertainment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {historyLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                No browsing history found matching your criteria.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Website</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center mr-3">
                            <Globe className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {item.url}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          {formatTime(item.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDuration(item.duration)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BrowsingHistoryPage;
