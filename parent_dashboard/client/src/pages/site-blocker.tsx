import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Child, BlockedSite } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import {
  Ban,
  Search,
  Plus,
  Trash2,
  Globe,
  AlertTriangle,
} from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const urlSchema = z.object({
  url: z.union([
    z.string().url("Please enter a valid URL"),
    z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, "Please enter a valid domain name")
  ]).refine(val => val.length > 0, {
    message: "URL is required"
  }),
});

type UrlFormValues = z.infer<typeof urlSchema>;

const SiteBlockerPage = () => {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch children data
  const { data: childrenData, isLoading: childrenLoading } = useQuery<Child[]>({
    queryKey: ["/api/children"],
  });
  
  // Set the first child as selected when data is loaded
  useEffect(() => {
    if (childrenData && childrenData.length > 0 && !selectedChild) {
      setSelectedChild(childrenData[0]);
    }
  }, [childrenData, selectedChild]);

  // Fetch blocked sites for the selected child
  const { data: blockedSitesData, isLoading: sitesLoading } = useQuery<BlockedSite[]>({
    queryKey: ["/api/blocked-sites", selectedChild?.id],
    enabled: !!selectedChild,
  });

  // Add blocked site mutation
  const addSiteMutation = useMutation({
    mutationFn: (url: string) =>
      apiRequest("POST", `/api/blocked-sites/${selectedChild?.id}`, { url }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/blocked-sites", selectedChild?.id],
      });
      toast({
        title: "Site blocked",
        description: "The website has been added to the blocked list.",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to block site",
        description: "There was a problem adding this site to the blocked list.",
        variant: "destructive",
      });
    },
  });

  // Toggle site status mutation
  const toggleSiteMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      apiRequest("PATCH", `/api/blocked-sites/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/blocked-sites", selectedChild?.id],
      });
    },
  });

  // Delete site mutation
  const deleteSiteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/blocked-sites/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/blocked-sites", selectedChild?.id],
      });
      toast({
        title: "Site removed",
        description: "The website has been removed from the blocked list.",
      });
    },
  });

  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (data: UrlFormValues) => {
    let formattedUrl = data.url;
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }
    addSiteMutation.mutate(formattedUrl);
  };

  const handleToggleSite = (id: number, currentStatus: boolean) => {
    toggleSiteMutation.mutate({ id, isActive: !currentStatus });
  };

  const handleDeleteSite = (id: number) => {
    deleteSiteMutation.mutate(id);
  };

  // Sample blocked sites data
  const sampleBlockedSites: BlockedSite[] = [
    {
      id: 1,
      url: "https://www.socialmedia.com",
      isActive: true,
    },
    {
      id: 2,
      url: "https://www.games.com",
      isActive: true,
    },
    {
      id: 3,
      url: "https://www.adultcontent.com",
      isActive: true,
    },
    {
      id: 4,
      url: "https://www.gambling.com",
      isActive: false,
    },
  ];

  const blockedSites = blockedSitesData || sampleBlockedSites;

  // Filter blocked sites based on search term
  const filteredSites = blockedSites.filter((site) =>
    site.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout title="Site Blocker">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Website Blocking</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="inline-flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Block New Site
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Block Website</DialogTitle>
                <DialogDescription>
                  Enter the URL of the website you want to block.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 pt-4"
                >
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="example.com"
                            {...field}
                            autoComplete="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={addSiteMutation.isPending}
                    >
                      {addSiteMutation.isPending ? "Adding..." : "Add Site"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center">
              <Ban className="mr-2 h-5 w-5" />
              Blocked Websites
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search blocked sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {sitesLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredSites.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                No blocked sites found matching your criteria.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Website</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded bg-red-100 flex items-center justify-center mr-3">
                            <Globe className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="truncate max-w-xs">{site.url}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={site.isActive}
                            onCheckedChange={() =>
                              handleToggleSite(site.id, site.isActive)
                            }
                          />
                          <span
                            className={`text-sm ${
                              site.isActive
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {site.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSite(site.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="mt-6 flex items-start space-x-3 p-4 bg-amber-50 rounded-md border border-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Important Note</p>
                <p className="mt-1">
                  Blocked websites will be inaccessible on the child's devices.
                  This feature works best when used alongside the SafeGuard
                  mobile app. Some sophisticated users may find ways to bypass
                  these restrictions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SiteBlockerPage;
