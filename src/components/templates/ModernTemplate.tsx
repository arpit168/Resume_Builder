"use client";

import { ResumeData, ResumeTheme } from "@/types/resume";
import QRCode from "react-qr-code";
import { Mail, Phone, MapPin, Globe, Link } from "lucide-react";

const getThemeColors = (theme: ResumeTheme) => {
  switch (theme) {
    case "blue":
      return {
        text: "text-blue-600",
        bg: "bg-blue-600",
        border: "border-blue-600",
        lightBg: "bg-blue-50",
      };
    case "green":
      return {
        text: "text-green-600",
        bg: "bg-green-600",
        border: "border-green-600",
        lightBg: "bg-green-50",
      };
    case "purple":
      return {
        text: "text-purple-600",
        bg: "bg-purple-600",
        border: "border-purple-600",
        lightBg: "bg-purple-50",
      };
    case "red":
      return {
        text: "text-red-600",
        bg: "bg-red-600",
        border: "border-red-600",
        lightBg: "bg-red-50",
      };
    case "gray":
    default:
      return {
        text: "text-gray-800",
        bg: "bg-gray-800",
        border: "border-gray-800",
        lightBg: "bg-gray-100",
      };
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})$/);
  return match ? `${match[2]}-${match[1]}` : dateStr;
};

export function ModernTemplate({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTheme;
}) {
  const colors = getThemeColors(theme);

  return (
    <div className="flex flex-col w-full min-h-full bg-white text-gray-800 font-sans">
      {/* Header */}
      <div
        className={`p-8 ${colors.bg} text-white flex justify-between items-center`}
      >
        <div className="flex-1">
          <h1 className="text-4xl font-bold uppercase tracking-wider break-words">
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <h2 className="text-xl mt-2 font-medium opacity-90 tracking-wide">
            {data.personalInfo.jobTitle || "Your Title"}
          </h2>
        </div>
        <div className="flex flex-col gap-1.5 text-sm text-right opacity-90 shrink-0">
          {data.personalInfo.email && (
            <div className="flex items-center justify-end gap-2">
              <Mail className="w-4 h-4" />{" "}
              <a
                href={`mailto:${data.personalInfo.email}`}
                className="hover:underline"
              >
                {data.personalInfo.email}
              </a>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center justify-end gap-2">
              <Phone className="w-4 h-4" />{" "}
              <a
                href={`tel:${data.personalInfo.phone.replace(/[^0-9+]/g, "")}`}
                className="hover:underline"
              >
                {data.personalInfo.phone}
              </a>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center justify-end gap-2">
              <MapPin className="w-4 h-4" /> {data.personalInfo.location}
            </div>
          )}
          {data.personalInfo.website && (
            <div className="flex items-center justify-end gap-2">
              <Globe className="w-4 h-4" />{" "}
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
          {data.personalInfo.linkedin && (
            <div className="flex items-center justify-end gap-2">
              <Link className="w-4 h-4" />{" "}
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
          {data.personalInfo.github && (
            <div className="flex items-center justify-end gap-2">
              <Link className="w-4 h-4" /> {data.personalInfo.github}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 p-8 gap-8">
        {/* Main Content (Left, 2/3) */}
        <div className="w-2/3 flex flex-col gap-6">
          {data.summary && (
            <section>
              <h3
                className={`text-xl font-bold uppercase tracking-wider border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}
              >
                Summary
              </h3>
              <p className="text-sm leading-relaxed">{data.summary}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section>
              <h3
                className={`text-xl font-bold uppercase tracking-wider border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}
              >
                Experience
              </h3>
              <div className="flex flex-col gap-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-gray-900 text-lg">
                        {exp.jobTitle}
                      </h4>
                      <span className={`text-sm font-semibold ${colors.text}`}>
                        {formatDate(exp.startDate)}{" "}
                        {formatDate(exp.startDate) &&
                        (exp.current || formatDate(exp.endDate))
                          ? "-"
                          : ""}{" "}
                        {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      {exp.company} {exp.location && `| ${exp.location}`}
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects.length > 0 && (
            <section>
              <h3
                className={`text-xl font-bold uppercase tracking-wider border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}
              >
                Projects
              </h3>
              <div className="flex flex-col gap-4">
                {data.projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-gray-900 text-lg">
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
                      </h4>
                    </div>
                    {proj.technologies && (
                      <div
                        className={`text-xs font-semibold mb-2 ${colors.text}`}
                      >
                        {proj.technologies}
                      </div>
                    )}
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <h3
                className={`text-xl font-bold uppercase tracking-wider border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}
              >
                Education
              </h3>
              <div className="flex flex-col gap-4">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-gray-900 text-lg">
                        {edu.degree}
                      </h4>
                      <span className={`text-sm font-semibold ${colors.text}`}>
                        {formatDate(edu.startDate)}{" "}
                        {formatDate(edu.startDate) && formatDate(edu.endDate)
                          ? "-"
                          : ""}{" "}
                        {formatDate(edu.endDate)}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      {edu.institution} {edu.location && `| ${edu.location}`}
                    </div>
                    {edu.description && (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Content (Right, 1/3) */}
        <div className="w-1/3 flex flex-col gap-6">
          {data.personalInfo.portfolio && (
            <section className="flex flex-col items-center mb-2">
              <a
                href={data.personalInfo.portfolio}
                target="_blank"
                rel="noreferrer"
                className="bg-white p-1 rounded shadow-sm border border-gray-200"
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
                    size={80}
                    level="L"
                  />
                </a>
              </a>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h3
                className={`text-xl font-bold uppercase tracking-wider border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}
              >
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className={`text-xs px-2 py-1 rounded-md ${colors.lightBg} ${colors.text} font-medium border border-gray-100`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.languages.length > 0 && (
            <section>
              <h3
                className={`text-xl font-bold uppercase tracking-wider border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}
              >
                Languages
              </h3>
              <div className="flex flex-col gap-2">
                {data.languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-800">
                      {lang.name}
                    </span>
                    {lang.proficiency && (
                      <span className="text-gray-500">{lang.proficiency}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.certifications.length > 0 && (
            <section>
              <h3
                className={`text-xl font-bold uppercase tracking-wider border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}
              >
                Certifications
              </h3>
              <div className="flex flex-col gap-3">
                {data.certifications.map((cert) => (
                  <div key={cert.id} className="text-sm">
                    <div className="font-bold text-gray-900">{cert.name}</div>
                    <div className="text-gray-600">{cert.organization}</div>
                    {formatDate(cert.issueDate) && (
                      <div className="text-gray-500 text-xs">
                        {formatDate(cert.issueDate)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.achievements.length > 0 && (
            <section>
              <h3
                className={`text-xl font-bold uppercase tracking-wider border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}
              >
                Achievements
              </h3>
              <div className="flex flex-col gap-3">
                {data.achievements.map((ach) => (
                  <div key={ach.id} className="text-sm">
                    <div className="font-bold text-gray-900">{ach.title}</div>
                    {formatDate(ach.date) && (
                      <div className={`text-xs font-semibold ${colors.text}`}>
                        {formatDate(ach.date)}
                      </div>
                    )}
                    <div className="text-gray-700 mt-1">{ach.description}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.customSections.length > 0 && (
            <div className="flex flex-col gap-6">
              {data.customSections.map((section) => (
                <section key={section.id}>
                  <h3
                    className={`text-xl font-bold uppercase tracking-wider border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}
                  >
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
