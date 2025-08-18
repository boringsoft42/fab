"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { JobApplicationForm } from "./components/JobApplicationForm";
import { JobApplicationDetails } from "./components/JobApplicationDetails";
import { getAuthHeaders } from "@/lib/api";

interface JobApplication {
  id: string;
  jobOfferId: string;
  applicantId: string;
  status: string;
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: string;
  updatedAt: string;
  jobOffer?: {
    id: string;
    title: string;
    company?: {
      name: string;
    };
  };
  applicant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

interface JobApplicationsResponse {
  jobApplications: JobApplication[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function JobApplicationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch job applications
  const { data, isLoading, error } = useQuery<JobApplicationsResponse>({
    queryKey: ["admin-job-applications", page, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`http://localhost:3001/api/jobapplication?${params}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch job applications");
      }
      const applications = await response.json();
      
      // Transform the response to match our expected structure
      return {
        jobApplications: Array.isArray(applications) ? applications : [],
        pagination: {
          page: page,
          limit: 10,
          total: Array.isArray(applications) ? applications.length : 0,
          totalPages: 1
        }
      };
    },
  });

  // Delete job application mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`http://localhost:3001/api/jobapplication/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to delete job application");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-job-applications"] });
      toast.success("Job application deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete job application");
      console.error("Delete error:", error);
    },
  });

  // Create job application mutation
  const createMutation = useMutation({
    mutationFn: async (applicationData: any) => {
      const response = await fetch("http://localhost:3001/api/jobapplication", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(applicationData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create job application");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-job-applications"] });
      toast.success("Job application created successfully");
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create job application");
    },
  });

  // Update job application mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`http://localhost:3001/api/jobapplication/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update job application");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-job-applications"] });
      toast.success("Job application updated successfully");
      setIsEditDialogOpen(false);
      setEditingApplication(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update job application");
    },
  });

  const handleDelete = (application: JobApplication) => {
    deleteMutation.mutate(application.id);
  };

  const handleCreate = (applicationData: any) => {
    createMutation.mutate(applicationData);
  };

  const handleUpdate = (applicationData: any) => {
    if (editingApplication) {
      updateMutation.mutate({ id: editingApplication.id, data: applicationData });
    }
  };

  const handleEdit = (application: JobApplication) => {
    setEditingApplication(application);
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsDetailsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: "outline" as const, label: "Pending" },
      REVIEWING: { variant: "secondary" as const, label: "Reviewing" },
      INTERVIEWED: { variant: "default" as const, label: "Interviewed" },
      ACCEPTED: { variant: "default" as const, label: "Accepted" },
      REJECTED: { variant: "destructive" as const, label: "Rejected" },
      WITHDRAWN: { variant: "outline" as const, label: "Withdrawn" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getApplicantName = (application: JobApplication) => {
    if (application.applicant) {
      return `${application.applicant.firstName} ${application.applicant.lastName}`;
    }
    return "N/A";
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading job applications. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidates Management</h1>
          <p className="text-muted-foreground">
            Manage all job applications and candidates in the platform
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Application</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new job application.
              </DialogDescription>
            </DialogHeader>
            <JobApplicationForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search candidates or job titles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWING">Reviewing</SelectItem>
                <SelectItem value="INTERVIEWED">Interviewed</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading job applications...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Job Position</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.jobApplications?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No job applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.jobApplications?.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-semibold">{getApplicantName(application)}</div>
                              <div className="text-sm text-muted-foreground">
                                {application.applicant?.email || "N/A"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {application.jobOffer?.title || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {application.jobOffer?.company?.name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{formatDate(application.appliedAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(application.updatedAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(application)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(application)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Job Application</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this application? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(application)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 ? (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{" "}
                    {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{" "}
                    {data.pagination.total} results
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      {/* Job Application Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <JobApplicationDetails application={selectedApplication} />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Job Application Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Application</DialogTitle>
            <DialogDescription>
              Update the job application details.
            </DialogDescription>
          </DialogHeader>
          {editingApplication && (
            <JobApplicationForm 
              application={editingApplication} 
              onSubmit={handleUpdate}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
