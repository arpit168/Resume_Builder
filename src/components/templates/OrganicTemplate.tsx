"use client";

import { ResumeData, ResumeTheme } from "@/types/resume";
import QRCode from "react-qr-code";

const getThemeColors = (theme: ResumeTheme) => {
  switch (theme) {
    case "blue":
      return {
        text: "text-blue-900",
        bg: "bg-blue-100",
        accent: "text-blue-600",
        blob: "bg-blue-800",
      };
    case "green":
      return {
        text: "text-green-900",
        bg: "bg-green-100",
        accent: "text-green-600",
        blob: "bg-green-800",
      };
    case "purple":
      return {
        text: "text-purple-900",
        bg: "bg-purple-100",
        accent: "text-purple-600",
        blob: "bg-purple-800",
      };
    case "red":
      return {
        text: "text-red-900",
        bg: "bg-red-100",
        accent: "text-red-600",
        blob: "bg-red-800",
      };
    case "gray":
    default:
      return {
        text: "text-slate-900",
        bg: "bg-slate-100",
        accent: "text-slate-600",
        blob: "bg-slate-800",
      };
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})$/);
  return match ? `${match[2]}-${match[1]}` : dateStr;
};

export function OrganicTemplate({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTheme;
}) {
  const colors = getThemeColors(theme);

  return (
    <div
      className={`relative flex flex-col w-full min-h-full ${colors.bg} text-gray-900 font-sans p-12 overflow-hidden`}
    >
      {/* Decorative Blobs */}
      <div
        className={`absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-10 ${colors.blob}`}
        style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
      ></div>
      <div
        className={`absolute top-20 -right-20 w-64 h-64 rounded-full opacity-90 ${colors.blob}`}
        style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
      ></div>
      <div
        className={`absolute -bottom-20 left-1/4 w-80 h-40 rounded-full opacity-80 ${colors.blob}`}
        style={{ borderRadius: "30% 70% 50% 50% / 30% 30% 70% 70%" }}
      ></div>

      {/* Header Container */}
      <div className="relative z-10 flex justify-between items-start mb-8">
        <div className="max-w-[60%]">
          <h1
            className={`text-5xl font-extrabold leading-none tracking-tight mb-2 ${colors.text}`}
          >
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <h2 className={`text-xl font-bold tracking-wide ${colors.accent}`}>
            {data.personalInfo.jobTitle || "Job Title"}
          </h2>
        </div>

        {data.personalInfo.photoUrl && (
          <div className="w-32 h-32 mr-4 shrink-0 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.personalInfo.photoUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="relative z-10 mb-8 text-sm text-gray-700 leading-relaxed font-medium">
          {data.summary}
        </div>
      )}

      {/* 2-Column Layout */}
      <div className="relative z-10 flex gap-8">
        {/* Left Main Column */}
        <div className="w-[65%] flex flex-col gap-6">
          {/* Experience */}
          {data.experience.length > 0 && (
            <section>
              <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                Employment History
              </h3>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="font-bold text-sm text-gray-900">
                      {exp.jobTitle} at {exp.company}
                    </div>
                    <div
                      className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${colors.accent}`}
                    >
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}{" "}
                      {exp.location && `| ${exp.location}`}
                    </div>
                    <ul className="list-disc list-outside ml-4 text-xs text-gray-700 leading-relaxed space-y-1">
                      {exp.description
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line, i) => (
                          <li key={i}>{line.replace(/^- /, "")}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                Education
              </h3>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-sm text-gray-900">
                      {edu.degree}, {edu.institution}
                    </div>
                    <div
                      className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${colors.accent}`}
                    >
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}{" "}
                      {edu.location && `| ${edu.location}`}
                    </div>
                    {edu.description && (
                      <div className="text-xs text-gray-700 mt-1">
                        {edu.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {data.customSections.length > 0 && (
            <div className="flex flex-col gap-6">
              {data.customSections.map((section) => (
                <section key={section.id}>
                  <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                    {section.title}
                  </h3>
                  <div className="text-xs text-gray-700 mt-1 whitespace-pre-wrap">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar Column */}
        <div className="w-[35%] flex flex-col gap-6">
          {/* Details (Contact) */}
          <section>
            <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>Details</h3>
            <div className="text-xs text-gray-700 space-y-1 font-medium">
              {data.personalInfo.location && (
                <div>{data.personalInfo.location}</div>
              )}
              {data.personalInfo.phone && (
                <div>
                  <a
                    href={`tel:${data.personalInfo.phone.replace(/[^0-9+]/g, "")}`}
                    className="hover:underline"
                  >
                    {data.personalInfo.phone}
                  </a>
                </div>
              )}
              {data.personalInfo.email && (
                <div className="break-all">
                  <a
                    href={`mailto:${data.personalInfo.email}`}
                    className="hover:underline"
                  >
                    {data.personalInfo.email}
                  </a>
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="break-all">
                  <a
                    href={
                      data.personalInfo.linkedin.startsWith("http")
                        ? data.personalInfo.linkedin
                        : `https://${data.personalInfo.linkedin}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {data.personalInfo.linkedin}
                  </a>
                </div>
              )}
              {data.personalInfo.website && (
                <div className="break-all">
                  <a
                    href={
                      data.personalInfo.website.startsWith("http")
                        ? data.personalInfo.website
                        : `https://${data.personalInfo.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {data.personalInfo.website}
                  </a>
                </div>
              )}
              {data.personalInfo.portfolio && (
                <div className="pt-2 flex flex-col items-start">
                  <div className="bg-white p-1 rounded border border-gray-200">
                    <a
                      href={
                        data.personalInfo.portfolio.startsWith("http")
                          ? data.personalInfo.portfolio
                          : `https://${data.personalInfo.portfolio}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <QRCode
                        value={data.personalInfo.portfolio}
                        size={64}
                        level="L"
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                Skills
              </h3>
              <div className="flex flex-col gap-2">
                {data.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="text-xs font-semibold text-gray-800 flex justify-between border-b border-gray-300/50 pb-1"
                  >
                    {skill.name}{" "}
                    {skill.level && (
                      <span className={`font-normal ${colors.accent}`}>
                        {skill.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <section>
              <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                Languages
              </h3>
              <div className="flex flex-col gap-2">
                {data.languages.map((lang) => (
                  <div
                    key={lang.id}
                    className="text-xs font-semibold text-gray-800 flex justify-between border-b border-gray-300/50 pb-1"
                  >
                    {lang.name}{" "}
                    {lang.proficiency && (
                      <span className={`font-normal ${colors.accent}`}>
                        {lang.proficiency}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section>
              <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                Certifications
              </h3>
              <div className="flex flex-col gap-2">
                {data.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="text-xs font-semibold text-gray-800 flex justify-between border-b border-gray-300/50 pb-1"
                  >
                    <span>
                      {cert.name}{" "}
                      <span className="font-normal text-gray-500 block text-[10px]">
                        {cert.organization}
                      </span>
                    </span>
                    {formatDate(cert.issueDate) && (
                      <span className={`font-normal ${colors.accent}`}>
                        {formatDate(cert.issueDate)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {data.achievements.length > 0 && (
            <section>
              <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                Achievements
              </h3>
              <div className="flex flex-col gap-2">
                {data.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="text-xs font-semibold text-gray-800 flex flex-col border-b border-gray-300/50 pb-1"
                  >
                    <div className="flex justify-between">
                      <span>{ach.title}</span>
                      {formatDate(ach.date) && (
                        <span className={`font-normal ${colors.accent}`}>
                          {formatDate(ach.date)}
                        </span>
                      )}
                    </div>
                    {ach.description && (
                      <span className="font-normal text-gray-500 text-[10px] mt-1">
                        {ach.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section>
              <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
                Projects
              </h3>
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="font-bold text-gray-900">
                      {proj.projectUrl ? (
                        <a
                          href={
                            proj.projectUrl.startsWith("http")
                              ? proj.projectUrl
                              : `https://${proj.projectUrl}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {proj.name}
                        </a>
                      ) : (
                        proj.name
                      )}
                    </div>
                    {proj.technologies && (
                      <div className={`${colors.accent} text-[10px]`}>
                        {proj.technologies}
                      </div>
                    )}
                    <div className="text-gray-700 mt-1">{proj.description}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
