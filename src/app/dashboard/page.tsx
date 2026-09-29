import { ResumeGrid } from "@/components/dashboard/ResumeGrid";

export const metadata = {
  title: "Dashboard | Resume Builder",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-gray-900 dark:text-white">
            My Resumes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            Manage and create your professional resumes.
          </p>
        </div>
      </div>
      <ResumeGrid />
    </div>
  );
}
