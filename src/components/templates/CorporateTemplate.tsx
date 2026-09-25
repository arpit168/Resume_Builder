"use client";

import { ResumeData, ResumeTheme } from "@/types/resume";
import QRCode from "react-qr-code";

const getThemeColors = (theme: ResumeTheme) => {
  switch (theme) {
    case "blue":
      return {
        border: "border-blue-600",
        bg: "bg-blue-600",
        text: "text-blue-600",
      };
    case "green":
      return {
        border: "border-green-600",
        bg: "bg-green-600",
        text: "text-green-600",
      };
    case "purple":
      return {
        border: "border-purple-600",
        bg: "bg-purple-600",
        text: "text-purple-600",
      };
    case "red":
      return {
        border: "border-red-600",
        bg: "bg-red-600",
        text: "text-red-600",
      };
    case "gray":
    default:
      return {
        border: "border-gray-800",
        bg: "bg-gray-800",
        text: "text-gray-800",
      };
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})$/);
  return match ? `${match[2]}-${match[1]}` : dateStr;
};

export function CorporateTemplate({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTheme;
}) {
  const colors = getThemeColors(theme);

  return (
    <div
      className={`relative flex flex-col w-full min-h-full bg-white font-serif border-[16px] ${colors.border}`}
    >
      {/* Header */}
      <div className="pt-12 pb-6 px-12 text-center">
        <h1
          className={`text-4xl font-extrabold uppercase tracking-wide mb-6 ${colors.text}`}
        >
          {data.personalInfo.fullName || "Your Name"}
        </h1>

        {/* Contact Bar */}
        <div className="bg-gray-900 text-white py-2 px-4 flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[11px] font-sans tracking-wide">
          {data.personalInfo.location && (
            <span>{data.personalInfo.location}</span>
          )}
          {data.personalInfo.location && data.personalInfo.phone && (
            <span className="text-gray-500">|</span>
          )}
          {data.personalInfo.phone && (
            <span>
              <a
                href={`tel:${data.personalInfo.phone.replace(/[^0-9+]/g, "")}`}
                className="hover:underline"
              >
                {data.personalInfo.phone}
              </a>
            </span>
          )}
          {data.personalInfo.phone && data.personalInfo.email && (
            <span className="text-gray-500">|</span>
          )}
          {data.personalInfo.email && (
            <span>
              <a
                href={`mailto:${data.personalInfo.email}`}
                className="hover:underline"
              >
                {data.personalInfo.email}
              </a>
            </span>
          )}
          {data.personalInfo.email && data.personalInfo.linkedin && (
            <span className="text-gray-500">|</span>
          )}
          {data.personalInfo.linkedin && (
            <span>
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
            </span>
          )}
        </div>
        {data.personalInfo.portfolio && (
          <div className="absolute top-8 right-8 flex flex-col items-center">
            <div
              className="p-1 border border-gray-300 bg-white"
            >
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

      <div className="px-12 pb-12 flex flex-col gap-6">
        {/* Summary / Headline */}
        {data.summary && (
          <div className="text-center mb-2">
            <h2
              className={`text-sm font-bold uppercase tracking-widest mb-3 ${colors.text}`}
            >
              Focus Headline
            </h2>
            <p className="text-sm text-gray-800 italic leading-relaxed max-w-3xl mx-auto">
              &quot;{data.summary}&quot;
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h3
              className={`text-sm font-bold uppercase tracking-widest border-y-2 border-gray-900 py-1.5 mb-4 text-center bg-gray-50 text-gray-900`}
            >
              Professional Highlights
            </h3>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-end mb-1">
                    <div className="font-bold text-gray-900 text-sm uppercase">
                      {exp.company}{" "}
                      <span className="text-gray-500 font-normal capitalize">
                        {" "}
                        – {exp.location}
                      </span>
                    </div>
                    <div className="font-bold text-gray-900 text-xs">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  <div
                    className={`font-bold text-sm uppercase tracking-wide mb-2 ${colors.text}`}
                  >
                    {exp.jobTitle}
                  </div>
                  <ul className="list-[square] list-inside text-xs text-gray-800 leading-relaxed space-y-1.5 ml-1">
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
            <h3
              className={`text-sm font-bold uppercase tracking-widest border-y-2 border-gray-900 py-1.5 mb-4 text-center bg-gray-50 text-gray-900`}
            >
              Education & Credentials
            </h3>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      {edu.degree}
                    </div>
                    <div className="text-xs text-gray-700">
                      {edu.institution}, {edu.location}
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 text-xs">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two-Column Bottom for Skills & Tech */}
        <div className="grid grid-cols-2 gap-8 mt-2">
          {data.skills.length > 0 && (
            <section>
              <h3
                className={`text-sm font-bold uppercase tracking-widest border-y-2 border-gray-900 py-1.5 mb-4 text-center bg-gray-50 text-gray-900`}
              >
                Core Competencies
              </h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 list-disc list-inside text-xs text-gray-800">
                {data.skills.map((skill) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
              </ul>
            </section>
          )}

          {data.projects.length > 0 && (
            <section>
              <h3
                className={`text-sm font-bold uppercase tracking-widest border-y-2 border-gray-900 py-1.5 mb-4 text-center bg-gray-50 text-gray-900`}
              >
                Key Projects
              </h3>
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="text-xs text-gray-800">
                    <span className="font-bold text-gray-900">
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
                    </span>
                    {proj.technologies && (
                      <span className={`italic ${colors.text}`}>
                        {" "}
                        - {proj.technologies}
                      </span>
                    )}
                    <div className="mt-0.5 leading-relaxed">
                      {proj.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Languages */}
        {data.languages.length > 0 && (
          <section>
            <h3
              className={`text-sm font-bold uppercase tracking-widest border-y-2 border-gray-900 py-1.5 mb-4 text-center bg-gray-50 text-gray-900`}
            >
              Languages
            </h3>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 list-none text-xs text-gray-800">
              {data.languages.map((lang) => (
                <li key={lang.id} className="font-semibold">
                  {lang.name}{" "}
                  <span className="font-normal italic text-gray-600">
                    {lang.proficiency && `(${lang.proficiency})`}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section>
            <h3
              className={`text-sm font-bold uppercase tracking-widest border-y-2 border-gray-900 py-1.5 mb-4 text-center bg-gray-50 text-gray-900`}
            >
              Certifications
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="text-xs text-gray-800">
                  <span className="font-bold text-gray-900">{cert.name}</span>
                  <div className="mt-0.5">
                    {cert.organization}{" "}
                    {formatDate(cert.issueDate) && (
                      <span className={`italic ${colors.text}`}>
                        - {formatDate(cert.issueDate)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <section>
            <h3
              className={`text-sm font-bold uppercase tracking-widest border-y-2 border-gray-900 py-1.5 mb-4 text-center bg-gray-50 text-gray-900`}
            >
              Achievements
            </h3>
            <div className="space-y-3">
              {data.achievements.map((ach) => (
                <div key={ach.id} className="text-xs text-gray-800">
                  <span className="font-bold text-gray-900">{ach.title}</span>
                  {formatDate(ach.date) && (
                    <span className={`italic ${colors.text}`}>
                      {" "}
                      - {formatDate(ach.date)}
                    </span>
                  )}
                  <div className="mt-0.5 leading-relaxed">
                    {ach.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {data.customSections.length > 0 &&
          data.customSections.map((section) => (
            <section key={section.id}>
              <h3
                className={`text-sm font-bold uppercase tracking-widest border-y-2 border-gray-900 py-1.5 mb-4 text-center bg-gray-50 text-gray-900`}
              >
                {section.title}
              </h3>
              <div className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                {section.content}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
