"use client";

import { useState } from "react";
import { useResume } from "@/hooks/useResume";
import { Resume, Certification } from "@/types/resume";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export function CertificationForm({ resume }: { resume: Resume }) {
  const { addCertification, updateCertification, deleteCertification, updateResume } = useResume();
  const certifications = resume.data.certifications;
  const [expandedId, setExpandedId] = useState<string | null>(certifications[0]?.id || null);

  const handleAdd = () => {
    const newCert: Certification = {
      id: crypto.randomUUID(),
      name: "",
      organization: "",
      issueDate: "",
      credentialId: "",
      credentialUrl: "",
    };
    addCertification(resume.id, newCert);
    setExpandedId(newCert.id);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...certifications];
    [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    updateResume(resume.id, { data: { ...resume.data, certifications: newArr } });
  };

  const moveDown = (index: number) => {
    if (index === certifications.length - 1) return;
    const newArr = [...certifications];
    [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
    updateResume(resume.id, { data: { ...resume.data, certifications: newArr } });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-800 mb-4">
        <h2 className="text-xl font-bold">Certifications</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <p>No certifications added yet.</p>
          <button onClick={handleAdd} className="mt-2 text-blue-600 dark:text-blue-500 hover:underline text-sm font-medium">
            + Add your first certification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert, index) => {
            const isExpanded = expandedId === cert.id;

            return (
              <div key={cert.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-all">
                {/* Header */}
                <div 
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors ${isExpanded ? 'border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80' : ''}`}
                  onClick={() => setExpandedId(isExpanded ? null : cert.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => moveUp(index)} disabled={index === 0} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => moveDown(index)} disabled={index === certifications.length - 1} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {cert.name || "(Unnamed Certification)"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cert.organization || "(Organization not specified)"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteCertification(resume.id, cert.id); }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {/* Form Body */}
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Certification Name</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateCertification(resume.id, cert.id, { name: e.target.value })}
                          placeholder="e.g. AWS Certified Solutions Architect"
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Issuing Organization</label>
                        <input
                          type="text"
                          value={cert.organization}
                          onChange={(e) => updateCertification(resume.id, cert.id, { organization: e.target.value })}
                          placeholder="e.g. Amazon Web Services"
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Issue Date</label>
                        <input
                          type="month"
                          value={cert.issueDate}
                          onChange={(e) => updateCertification(resume.id, cert.id, { issueDate: e.target.value })}
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Credential ID (Optional)</label>
                        <input
                          type="text"
                          value={cert.credentialId}
                          onChange={(e) => updateCertification(resume.id, cert.id, { credentialId: e.target.value })}
                          placeholder="e.g. AWS-12345678"
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Credential URL (Optional)</label>
                        <input
                          type="url"
                          value={cert.credentialUrl}
                          onChange={(e) => updateCertification(resume.id, cert.id, { credentialUrl: e.target.value })}
                          placeholder="https://credly.com/..."
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
