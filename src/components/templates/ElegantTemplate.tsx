"use client";

import { ResumeData, ResumeTheme } from "@/types/resume";
import QRCode from "react-qr-code";

const getThemeColors = (theme: ResumeTheme) => {
  switch (theme) {
    case "blue":
      return {
        text: "text-blue-600",
        border: "border-blue-600",
        fill: "fill-blue-600",
      };
    case "green":
      return {
        text: "text-green-600",
        border: "border-green-600",
        fill: "fill-green-600",
      };
    case "purple":
      return {
        text: "text-purple-600",
        border: "border-purple-600",
        fill: "fill-purple-600",
      };
    case "red":
      return {
        text: "text-red-600",
        border: "border-red-600",
        fill: "fill-red-600",
      };
    case "gray":
    default:
      return {
        text: "text-gray-900",
        border: "border-gray-900",
        fill: "fill-gray-900",
      };
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})$/);
  return match ? `${match[2]}-${match[1]}` : dateStr;
};

export function ElegantTemplate({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTheme;
}) {
  const colors = getThemeColors(theme);

  return (
    <div className="flex w-full min-h-full bg-[#FAFAFA] text-gray-900 font-sans p-12">
      {/* Left Column */}
      <div className="w-[40%] pr-8">
        {/* Name Block */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold leading-none tracking-tight mb-2 uppercase break-words">
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500">
            {data.personalInfo.jobTitle || "Job Title"}
          </h2>
        </div>

        {data.personalInfo.photoUrl && (
          <div className="w-32 h-32 mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.personalInfo.photoUrl}
              alt="Profile"
              className="w-full h-full object-cover rounded-sm grayscale"
            />
          </div>
        )}

        {/* About */}
        {data.summary && (
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-3 border-b-2 border-gray-900 pb-1 lowercase">
              About
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 text-justify">
              {data.summary}
            </p>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 border-b-2 border-gray-900 pb-1 lowercase">
              Education
            </h3>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div
                    className={`text-[10px] font-bold ${colors.text} mb-0.5`}
                  >
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                  <div className="font-bold text-sm leading-tight mb-1">
                    {edu.institution}
                  </div>
                  <div className="text-xs text-gray-600 leading-tight">
                    {edu.degree}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 border-b-2 border-gray-900 pb-1 lowercase">
              Skills
            </h3>
            <div className="flex flex-col gap-2">
              {data.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="text-xs font-semibold text-gray-800"
                >
                  {skill.name}{" "}
                  {skill.level && (
                    <span className="font-normal text-gray-500">
                      ({skill.level})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 border-b-2 border-gray-900 pb-1 lowercase">
              Languages
            </h3>
            <div className="flex flex-col gap-2">
              {data.languages.map((lang) => (
                <div
                  key={lang.id}
                  className="text-xs font-semibold text-gray-800"
                >
                  {lang.name}{" "}
                  {lang.proficiency && (
                    <span className="font-normal text-gray-500">
                      - {lang.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 border-b-2 border-gray-900 pb-1 lowercase">
              Certifications
            </h3>
            <div className="flex flex-col gap-3">
              {data.certifications.map((cert) => (
                <div key={cert.id}>
                  <div className="text-xs font-bold text-gray-800">
                    {cert.name}
                  </div>
                  <div className="text-[10px] text-gray-600">
                    {cert.organization}{" "}
                    {formatDate(cert.issueDate) &&
                      `(${formatDate(cert.issueDate)})`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="w-[60%] pl-8">
        {/* Contact Info Top Right */}
        <div className="flex flex-col items-end gap-1 text-[10px] text-gray-600 mb-12 mt-2">
          {data.personalInfo.phone && (
            <div>
              <span className="font-bold text-gray-900 mr-2">Phone</span>{" "}
              <a
                href={`tel:${data.personalInfo.phone.replace(/[^0-9+]/g, "")}`}
                className="hover:underline"
              >
                {data.personalInfo.phone}
              </a>
            </div>
          )}
          {data.personalInfo.email && (
            <div>
              <span className="font-bold text-gray-900 mr-2">Email</span>{" "}
              <a
                href={`mailto:${data.personalInfo.email}`}
                className="hover:underline"
              >
                {data.personalInfo.email}
              </a>
            </div>
          )}
          {data.personalInfo.location && (
            <div>
              <span className="font-bold text-gray-900 mr-2">Address</span>{" "}
              {data.personalInfo.location}
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div>
              <span className="font-bold text-gray-900 mr-2">LinkedIn</span>{" "}
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
            <div>
              <span className="font-bold text-gray-900 mr-2">Website</span>{" "}
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
            <div className="mt-4 flex flex-col items-end">
              <span className="font-bold text-gray-900 mb-1">Portfolio</span>
              <div className="bg-white p-1 rounded shadow-sm border border-gray-100">
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
                    size={60}
                    level="L"
                  />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Work Experience */}
        {data.experience.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-6 border-b-2 border-gray-900 pb-1 lowercase">
              Work Experience
            </h3>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-[1fr_2fr] gap-4">
                  <div>
                    <div className="font-bold text-sm leading-tight">
                      {exp.jobTitle}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {exp.company}
                    </div>
                    <div
                      className={`text-[10px] font-bold ${colors.text} mt-1`}
                    >
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    <ul className="list-disc list-outside ml-3 space-y-1">
                      {exp.description
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line, i) => (
                          <li key={i}>{line.replace(/^- /, "")}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-6 border-b-2 border-gray-900 pb-1 lowercase">
              Projects
            </h3>
            <div className="space-y-6">
              {data.projects.map((proj) => (
                <div key={proj.id} className="grid grid-cols-[1fr_2fr] gap-4">
                  <div>
                    <div className="font-bold text-sm leading-tight">
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
                      <div
                        className={`text-[10px] font-bold ${colors.text} mt-1`}
                      >
                        {proj.technologies}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    {proj.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-6 border-b-2 border-gray-900 pb-1 lowercase">
              Achievements
            </h3>
            <div className="space-y-6">
              {data.achievements.map((ach) => (
                <div key={ach.id} className="grid grid-cols-[1fr_2fr] gap-4">
                  <div>
                    <div className="font-bold text-sm leading-tight">
                      {ach.title}
                    </div>
                    {formatDate(ach.date) && (
                      <div
                        className={`text-[10px] font-bold ${colors.text} mt-1`}
                      >
                        {formatDate(ach.date)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    {ach.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {data.customSections.length > 0 && (
          <div className="space-y-10">
            {data.customSections.map((section) => (
              <div key={section.id}>
                <h3 className="text-lg font-bold mb-6 border-b-2 border-gray-900 pb-1 lowercase">
                  {section.title}
                </h3>
                <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
