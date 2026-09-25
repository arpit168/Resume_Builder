"use client";

import { ResumeData, ResumeTheme } from "@/types/resume";
import QRCode from "react-qr-code";

const getThemeColors = (theme: ResumeTheme) => {
  switch (theme) {
    case "blue":
      return {
        text: "text-blue-600",
        bg: "bg-blue-600",
        lightBg: "bg-blue-100",
      };
    case "green":
      return {
        text: "text-green-600",
        bg: "bg-green-600",
        lightBg: "bg-green-100",
      };
    case "purple":
      return {
        text: "text-purple-600",
        bg: "bg-purple-600",
        lightBg: "bg-purple-100",
      };
    case "red":
      return { text: "text-red-600", bg: "bg-red-600", lightBg: "bg-red-100" };
    case "gray":
    default:
      return {
        text: "text-gray-900",
        bg: "bg-gray-800",
        lightBg: "bg-gray-200",
      };
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})$/);
  return match ? `${match[2]}-${match[1]}` : dateStr;
};

export function StandardTemplate({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTheme;
}) {
  const colors = getThemeColors(theme);

  return (
    <div className="flex flex-col w-full min-h-full bg-white text-gray-900 font-serif p-12">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-1">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <h2 className="text-sm font-bold text-gray-800">
          {data.personalInfo.jobTitle || "Job Title"}
        </h2>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col text-xs text-gray-800 mb-6">
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
          <div>
            <a
              href={`mailto:${data.personalInfo.email}`}
              className="hover:underline"
            >
              {data.personalInfo.email}
            </a>
          </div>
        )}
        {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
        {data.personalInfo.linkedin && (
          <div>
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
      </div>

      {/* Portfolio QR Code */}
      {data.personalInfo.portfolio && (
        <div className="flex flex-col items-end absolute top-12 right-12 text-center">
          <a
            href={data.personalInfo.portfolio}
            target="_blank"
            rel="noreferrer"
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
              <QRCode value={data.personalInfo.portfolio} size={64} level="L" />
            </a>
          </a>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Summary */}
        {data.summary && (
          <section>
            <h3
              className={`w-full ${colors.lightBg} py-1 text-center font-bold text-sm mb-3`}
            >
              Summary
            </h3>
            <p className="text-xs leading-relaxed text-gray-800 text-justify">
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h3
              className={`w-full ${colors.lightBg} py-1 text-center font-bold text-sm mb-4`}
            >
              Work Experience
            </h3>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="font-bold text-sm">{exp.jobTitle}</div>
                  <div className="text-xs text-gray-700">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </div>
                  <div className={`text-xs font-semibold ${colors.text} mb-2`}>
                    {formatDate(exp.startDate)} -{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </div>
                  <ul className="list-disc list-outside ml-4 text-xs text-gray-800 leading-relaxed space-y-1">
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
              className={`w-full ${colors.lightBg} py-1 text-center font-bold text-sm mb-4`}
            >
              Education
            </h3>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-sm">{edu.degree}</div>
                  <div className="text-xs text-gray-700">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </div>
                  <div className={`text-xs font-semibold ${colors.text} mb-1`}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                  {edu.description && (
                    <div className="text-xs text-gray-800">
                      {edu.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section>
            <h3
              className={`w-full ${colors.lightBg} py-1 text-center font-bold text-sm mb-4`}
            >
              Projects
            </h3>
            <div className="space-y-4">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="font-bold text-sm">
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
                      className={`text-xs font-semibold ${colors.text} mb-1`}
                    >
                      {proj.technologies}
                    </div>
                  )}
                  <div className="text-xs text-gray-800">
                    {proj.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h3
              className={`w-full ${colors.lightBg} py-1 text-center font-bold text-sm mb-4`}
            >
              Skills
            </h3>
            <ul className="list-disc list-inside text-xs text-gray-800 ml-2 space-y-1">
              {data.skills.map((skill) => (
                <li key={skill.id}>
                  {skill.name}{" "}
                  {skill.level && (
                    <span className="text-gray-500">- {skill.level}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <section>
            <h3
              className={`w-full ${colors.lightBg} py-1 text-center font-bold text-sm mb-4`}
            >
              Languages
            </h3>
            <ul className="list-disc list-inside text-xs text-gray-800 ml-2 space-y-1">
              {data.languages.map((lang) => (
                <li key={lang.id}>
                  {lang.name}{" "}
                  {lang.proficiency && (
                    <span className="text-gray-500">- {lang.proficiency}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section>
            <h3
              className={`w-full ${colors.lightBg} py-1 text-center font-bold text-sm mb-4`}
            >
              Certifications
            </h3>
            <ul className="list-disc list-inside text-xs text-gray-800 ml-2 space-y-1">
              {data.certifications.map((cert) => (
                <li key={cert.id}>
                  {cert.name} - {cert.organization}{" "}
                  {formatDate(cert.issueDate) && (
                    <span className="text-gray-500">
                      ({formatDate(cert.issueDate)})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <section>
            <h3
              className={`w-full ${colors.lightBg} py-1 text-center font-bold text-sm mb-4`}
            >
              Achievements
            </h3>
            <div className="space-y-3">
              {data.achievements.map((ach) => (
                <div key={ach.id}>
                  <div className="font-bold text-sm">{ach.title}</div>
                  {formatDate(ach.date) && (
                    <div
                      className={`text-xs font-semibold ${colors.text} mb-1`}
                    >
                      {formatDate(ach.date)}
                    </div>
                  )}
                  <div className="text-xs text-gray-800">{ach.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {data.customSections.length > 0 && (
          <div className="space-y-6">
            {data.customSections.map((section) => (
              <section key={section.id}>
                <h3
                  className={`w-full ${colors.lightBg} py-1 text-center font-bold text-sm mb-4`}
                >
                  {section.title}
                </h3>
                <div className="text-xs text-gray-800 whitespace-pre-wrap">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
