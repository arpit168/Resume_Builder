"use client";

import { ResumeData, ResumeTheme } from "@/types/resume";
import QRCode from "react-qr-code";

const getThemeColors = (theme: ResumeTheme) => {
  switch (theme) {
    case "blue":
      return { text: "text-blue-700", border: "border-blue-700" };
    case "green":
      return { text: "text-emerald-700", border: "border-emerald-700" };
    case "purple":
      return { text: "text-purple-700", border: "border-purple-700" };
    case "red":
      return { text: "text-red-700", border: "border-red-700" };
    case "gray":
    default:
      return { text: "text-slate-800", border: "border-slate-800" };
  }
};

const SectionHeader = ({
  title,
  colors,
}: {
  title: string;
  colors: { text: string; border: string };
}) => (
  <div className="flex items-center gap-4 my-4">
    <div className={`flex-grow h-px border-t ${colors.border}`}></div>
    <h3 className={`text-sm font-bold lowercase tracking-wide ${colors.text}`}>
      {title}
    </h3>
    <div className={`flex-grow h-px border-t ${colors.border}`}></div>
  </div>
);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})$/);
  return match ? `${match[2]}-${match[1]}` : dateStr;
};

export function StructuredTemplate({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTheme;
}) {
  const colors = getThemeColors(theme);

  return (
    <div
      className={`relative flex flex-col w-full min-h-full bg-white text-gray-900 font-serif p-12`}
    >
      {/* Header */}
      <div className="flex items-center gap-6 mb-4">
        {data.personalInfo.photoUrl && (
          <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden border border-gray-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.personalInfo.photoUrl}
              alt="Profile"
              className="w-full h-full object-cover grayscale"
            />
          </div>
        )}

        <div className="flex flex-col flex-1">
          <h1 className={`text-3xl font-bold mb-2 ${colors.text}`}>
            {data.personalInfo.fullName || "Your Name"}
          </h1>

          <div className="text-[10px] text-gray-800 font-medium leading-relaxed max-w-2xl">
            {data.personalInfo.jobTitle && (
              <>
                <strong className="text-gray-900">Title:</strong>{" "}
                {data.personalInfo.jobTitle} &nbsp;
              </>
            )}
            {data.personalInfo.location && (
              <>
                <strong className="text-gray-900">Address:</strong>{" "}
                {data.personalInfo.location} &nbsp;
              </>
            )}
            {data.personalInfo.phone && (
              <>
                <strong className="text-gray-900">Phone number:</strong>{" "}
                <a
                  href={`tel:${data.personalInfo.phone.replace(/[^0-9+]/g, "")}`}
                  className="hover:underline"
                >
                  {data.personalInfo.phone}
                </a>{" "}
                &nbsp;
              </>
            )}
            {data.personalInfo.email && (
              <>
                <strong className="text-gray-900">Email address:</strong>{" "}
                <a
                  href={`mailto:${data.personalInfo.email}`}
                  className="hover:underline"
                >
                  {data.personalInfo.email}
                </a>{" "}
                &nbsp;
              </>
            )}
            {data.personalInfo.website && (
              <>
                <strong className="text-gray-900">Web:</strong>{" "}
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
                </a>{" "}
                &nbsp;
              </>
            )}
            {data.personalInfo.linkedin && (
              <>
                <strong className="text-gray-900">LinkedIn:</strong>{" "}
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
              </>
            )}
          </div>
        </div>
        {data.personalInfo.portfolio && (
          <div className="absolute top-12 right-12 flex flex-col items-end">
            <div
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

      <div className="flex flex-col gap-2">
        {/* Objective / Summary */}
        {data.summary && (
          <section>
            <SectionHeader colors={colors} title="Resume objective" />
            <p className="text-xs text-gray-800 leading-relaxed text-justify">
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <SectionHeader colors={colors} title="Work experience" />
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="font-bold text-sm text-gray-900">
                    {exp.jobTitle}
                  </div>
                  <div className="text-[11px] text-gray-700 font-medium mb-1">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </div>
                  <div className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider">
                    {formatDate(exp.startDate)} -{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </div>
                  <ul className="list-disc list-inside text-xs text-gray-800 leading-relaxed space-y-1">
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
            <SectionHeader colors={colors} title="Education" />
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-sm text-gray-900">
                    {edu.degree}
                  </div>
                  <div className="text-[11px] text-gray-700 font-medium mb-1">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </div>
                  <div className="text-[10px] text-gray-600 mb-1 uppercase tracking-wider">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                  {edu.description && (
                    <ul className="list-disc list-inside text-xs text-gray-800 leading-relaxed mt-1">
                      <li>{edu.description}</li>
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section>
            <SectionHeader colors={colors} title="Projects" />
            <div className="space-y-4">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="font-bold text-sm text-gray-900">
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
                    <div className="text-[11px] text-gray-700 font-medium mb-1">
                      {proj.technologies}
                    </div>
                  )}
                  <div className="text-xs text-gray-800 mt-1">
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
            <SectionHeader colors={colors} title="Skills" />
            <div className="flex flex-wrap gap-x-12 gap-y-2 px-4 justify-between">
              {data.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="text-xs font-bold text-gray-900 w-[40%]"
                >
                  {skill.name}{" "}
                  {skill.level && (
                    <span className="font-normal text-gray-500 float-right">
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
            <SectionHeader colors={colors} title="Languages" />
            <div className="flex flex-wrap gap-x-12 gap-y-2 px-4 justify-between">
              {data.languages.map((lang) => (
                <div
                  key={lang.id}
                  className="text-xs font-bold text-gray-900 w-[40%]"
                >
                  {lang.name}{" "}
                  {lang.proficiency && (
                    <span className="font-normal text-gray-500 float-right">
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
            <SectionHeader colors={colors} title="Certifications" />
            <div className="flex flex-wrap gap-x-12 gap-y-2 px-4 justify-between">
              {data.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="text-xs font-bold text-gray-900 w-[40%]"
                >
                  {cert.name}
                  <div className="text-[10px] text-gray-600 font-normal mt-0.5">
                    {cert.organization}{" "}
                    {formatDate(cert.issueDate) &&
                      `(${formatDate(cert.issueDate)})`}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <section>
            <SectionHeader colors={colors} title="Achievements" />
            <div className="space-y-3 px-4">
              {data.achievements.map((ach) => (
                <div key={ach.id}>
                  <div className="font-bold text-sm text-gray-900">
                    {ach.title}
                  </div>
                  {formatDate(ach.date) && (
                    <div className="text-[10px] text-gray-600 mb-1">
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
          <div className="space-y-2">
            {data.customSections.map((section) => (
              <section key={section.id}>
                <SectionHeader colors={colors} title={section.title} />
                <div className="px-4 text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
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
