import { ResumeGrid } from "@/components/dashboard/ResumeGrid";

export const metadata = {
  title: "Dashboard | Resume Builder",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and create your professional resumes.
        </p>
      </div>
      <ResumeGrid />
    </div>
  );
}
