"use client";

import { ResumeData, ResumeTheme } from "@/types/resume";
import QRCode from "react-qr-code";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})$/);
  return match ? `${match[2]}-${match[1]}` : dateStr;
};

const getThemeColors = (theme: ResumeTheme) => {
  switch (theme) {
    case "blue":
      return { text: "text-[#1e3a8a]", border: "border-[#1e3a8a]" }; // Dark navy
    case "green":
      return { text: "text-[#14532d]", border: "border-[#14532d]" }; // Dark green
    case "purple":
      return { text: "text-[#4c1d95]", border: "border-[#4c1d95]" }; // Dark purple
    case "red":
      return { text: "text-[#7f1d1d]", border: "border-[#7f1d1d]" }; // Dark red
    case "gray":
    default:
      return { text: "text-[#1f2937]", border: "border-[#1f2937]" }; // Dark charcoal
  }
};

export function ProfessionalTemplate({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTheme;
}) {
  const colors = getThemeColors(theme);

  const contactItems = [];
  if (data.personalInfo.location) contactItems.push(data.personalInfo.location);
  if (data.personalInfo.email)
    contactItems.push(
      <a href={`mailto:${data.personalInfo.email}`} className="hover:underline">
        {data.personalInfo.email}
      </a>,
    );
  if (data.personalInfo.phone)
    contactItems.push(
      <a
        href={`tel:${data.personalInfo.phone.replace(/[^0-9+]/g, "")}`}
        className="hover:underline"
      >
        {data.personalInfo.phone}
      </a>,
    );
  if (data.personalInfo.linkedin)
    contactItems.push(
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
        {data.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
      </a>,
    );
  if (data.personalInfo.github)
    contactItems.push(
      <a
        href={
          data.personalInfo.github.startsWith("http")
            ? data.personalInfo.github
            : `https://${data.personalInfo.github}`
        }
        target="_blank"
        rel="noreferrer"
        className="hover:underline"
      >
        {data.personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
      </a>,
    );
  if (data.personalInfo.website)
    contactItems.push(
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
        {data.personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}
      </a>,
    );

  const qrUrl =
    data.personalInfo.portfolio ||
    data.personalInfo.linkedin ||
    data.personalInfo.github ||
    data.personalInfo.website;

  // Group skills by level (acts as category if user typed Frontend, Backend etc)
  const groupedSkills = data.skills.reduce(
    (acc, skill) => {
      const level = skill.level ? skill.level.trim() : "Other";
      if (!acc[level]) acc[level] = [];
      acc[level].push(skill.name);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  // Helper to render descriptions nicely with bullet points
  const renderDescription = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    if (lines.length === 1)
      return (
        <p className="text-[13px] text-gray-800 leading-snug mt-0.5">{text}</p>
      );

    return (
      <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0">
        {lines.map((line, i) => {
          const cleanLine = line.replace(/^[-•*]\s*/, "");
          return (
            <li key={i} className="text-[13px] text-gray-800 leading-snug pl-1">
              {cleanLine}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div
      className="relative flex flex-col w-full min-h-full bg-white text-gray-900 p-8"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* Header */}
      <div className="text-center mb-3 relative">
        <h1
          className={`text-3xl font-bold uppercase tracking-wide mb-1 ${colors.text}`}
        >
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        {data.personalInfo.jobTitle && (
          <div className="text-[15px] text-gray-700 mb-0.5">
            {data.personalInfo.jobTitle}
          </div>
        )}
        <div className="text-[12px] text-gray-600 flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
          {contactItems.map((item, index) => (
            <span key={index} className="flex items-center whitespace-nowrap">
              {item}
              {index < contactItems.length - 1 && (
                <span className="mx-2 text-gray-400">|</span>
              )}
            </span>
          ))}
        </div>

        {qrUrl && (
          <div className="absolute top-0 right-0 p-1 border border-gray-200 bg-white shadow-sm">
            <a
              href={qrUrl.startsWith("http") ? qrUrl : `https://${qrUrl}`}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <QRCode value={qrUrl} size={55} level="L" />
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[10px]">
        {/* PROFESSIONAL SUMMARY */}
        {data.summary && (
          <section>
            <h2
              className={`text-[14px] font-bold uppercase border-b-[1.5px] ${colors.border} pb-[2px] mb-1.5 ${colors.text}`}
            >
              Professional Summary
            </h2>
            <div className="text-[13px] text-gray-800 leading-snug text-justify">
              {data.summary}
            </div>
          </section>
        )}

        {/* TECHNICAL SKILLS */}
        {data.skills.length > 0 && (
          <section>
            <h2
              className={`text-[14px] font-bold uppercase border-b-[1.5px] ${colors.border} pb-[2px] mb-1.5 ${colors.text}`}
            >
              Technical Skills
            </h2>
            <ul className="list-disc list-outside ml-4 space-y-0">
              {Object.entries(groupedSkills).map(([level, skills]) => (
                <li
                  key={level}
                  className="text-[13px] text-gray-800 leading-snug pl-1"
                >
                  {level !== "Other" && (
                    <span className="font-medium text-gray-900">{level}: </span>
                  )}
                  {skills.join(", ")}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* PROJECTS */}
        {data.projects.length > 0 && (
          <section>
            <h2
              className={`text-[14px] font-bold uppercase border-b-[1.5px] ${colors.border} pb-[2px] mb-1.5 ${colors.text}`}
            >
              Projects
            </h2>
            <div className="flex flex-col gap-2">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="font-bold text-[13px] text-gray-900">
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
                    <div className="text-[12px] italic text-gray-600">
                      {proj.technologies}
                    </div>
                  )}
                  {renderDescription(proj.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {data.experience.length > 0 && (
          <section>
            <h2
              className={`text-[14px] font-bold uppercase border-b-[1.5px] ${colors.border} pb-[2px] mb-1.5 ${colors.text}`}
            >
              Experience
            </h2>
            <div className="flex flex-col gap-2">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-[13px] text-gray-900">
                      {exp.company}
                    </div>
                    <div className="text-[12px] italic text-gray-600 whitespace-nowrap">
                      {formatDate(exp.startDate)}{" "}
                      {formatDate(exp.startDate) &&
                      (exp.current || formatDate(exp.endDate))
                        ? "–"
                        : ""}{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  <div className="text-[13px] italic text-gray-800 mb-0.5">
                    {exp.jobTitle}
                    {exp.location ? ` | ${exp.location}` : ""}
                  </div>
                  {renderDescription(exp.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {data.education.length > 0 && (
          <section>
            <h2
              className={`text-[14px] font-bold uppercase border-b-[1.5px] ${colors.border} pb-[2px] mb-1.5 ${colors.text}`}
            >
              Education
            </h2>
            <div className="flex flex-col gap-2">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-[13px] text-gray-900">
                      {edu.degree}
                    </div>
                    <div className="text-[12px] italic text-gray-600 whitespace-nowrap">
                      {formatDate(edu.startDate)}{" "}
                      {formatDate(edu.startDate) && formatDate(edu.endDate)
                        ? "–"
                        : ""}{" "}
                      {formatDate(edu.endDate)}
                    </div>
                  </div>
                  <div className="text-[13px] italic text-gray-800">
                    {edu.institution}
                    {edu.location ? ` | ${edu.location}` : ""}
                  </div>
                  {renderDescription(edu.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS & ACHIEVEMENTS */}
        {(data.certifications.length > 0 || data.achievements.length > 0) && (
          <section>
            <h2
              className={`text-[14px] font-bold uppercase border-b-[1.5px] ${colors.border} pb-[2px] mb-1.5 ${colors.text}`}
            >
              Certifications & Achievements
            </h2>
            <ul className="list-disc list-outside ml-4 space-y-0">
              {data.certifications.map((cert) => (
                <li
                  key={cert.id}
                  className="text-[13px] text-gray-800 leading-snug pl-1"
                >
                  <span className="font-medium text-gray-900">{cert.name}</span>{" "}
                  {cert.organization ? `— ${cert.organization}` : ""}{" "}
                  {cert.issueDate ? `(${formatDate(cert.issueDate)})` : ""}
                </li>
              ))}
              {data.achievements.map((ach) => (
                <li
                  key={ach.id}
                  className="text-[13px] text-gray-800 leading-snug pl-1"
                >
                  <span className="font-medium text-gray-900">{ach.title}</span>{" "}
                  {ach.date ? `(${formatDate(ach.date)})` : ""}
                  {ach.description ? ` - ${ach.description}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* LANGUAGES */}
        {data.languages && data.languages.length > 0 && (
          <section>
            <h2
              className={`text-[14px] font-bold uppercase border-b-[1.5px] ${colors.border} pb-[2px] mb-1.5 ${colors.text}`}
            >
              Languages
            </h2>
            <ul className="list-disc list-outside ml-4 space-y-0">
              {data.languages.map((lang) => (
                <li
                  key={lang.id}
                  className="text-[13px] text-gray-800 leading-snug pl-1"
                >
                  <span className="font-medium text-gray-900">{lang.name}</span>
                  {lang.proficiency ? `: ${lang.proficiency}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CUSTOM SECTIONS */}
        {data.customSections.length > 0 && (
          <>
            {data.customSections.map((section) => (
              <section key={section.id}>
                <h2
                  className={`text-[14px] font-bold uppercase border-b-[1.5px] ${colors.border} pb-[2px] mb-1.5 ${colors.text}`}
                >
                  {section.title}
                </h2>
                {renderDescription(section.content)}
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
