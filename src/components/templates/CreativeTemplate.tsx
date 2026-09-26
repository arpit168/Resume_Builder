"use client";

import { ResumeData, ResumeTheme } from "@/types/resume";
import QRCode from "react-qr-code";
import { Mail, Phone, MapPin, Globe, Link as LinkIcon } from "lucide-react";

const getThemeColors = (theme: ResumeTheme) => {
  switch (theme) {
    case "blue":
      return {
        text: "text-blue-600",
        bg: "bg-blue-600",
        lightBg: "bg-blue-50",
      };
    case "green":
      return {
        text: "text-green-600",
        bg: "bg-green-600",
        lightBg: "bg-green-50",
      };
    case "purple":
      return {
        text: "text-purple-600",
        bg: "bg-purple-600",
        lightBg: "bg-purple-50",
      };
    case "red":
      return { text: "text-red-600", bg: "bg-red-600", lightBg: "bg-red-50" };
    case "gray":
    default:
      return {
        text: "text-gray-800",
        bg: "bg-gray-800",
        lightBg: "bg-gray-100",
      };
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})$/);
  return match ? `${match[2]}-${match[1]}` : dateStr;
};

export function CreativeTemplate({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTheme;
}) {
  const colors = getThemeColors(theme);

  return (
    <div className="flex w-full min-h-full bg-white font-sans">
      {/* Sidebar (Left) */}
      <div className="w-[35%] bg-slate-900 text-slate-200 flex flex-col pt-10 pb-8 px-6">
        <div className="flex flex-col items-center mb-8">
          {data.personalInfo.photoUrl && (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.personalInfo.photoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-3 text-sm w-full">
            {data.personalInfo.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" />{" "}
                <span className="break-all">
                  <a
                    href={`tel:${data.personalInfo.phone.replace(/[^0-9+]/g, "")}`}
                    className="hover:underline"
                  >
                    {data.personalInfo.phone}
                  </a>
                </span>
              </div>
            )}
            {data.personalInfo.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" />{" "}
                <span className="break-all">
                  <a
                    href={`mailto:${data.personalInfo.email}`}
                    className="hover:underline"
                  >
                    {data.personalInfo.email}
                  </a>
                </span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 shrink-0" />{" "}
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-3">
                <LinkIcon className="w-4 h-4 shrink-0" />{" "}
                <span className="break-all">
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
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 shrink-0" />{" "}
                <span className="break-all">
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
                </span>
              </div>
            )}
          </div>

          {data.personalInfo.portfolio && (
            <div className="mt-8 flex flex-col items-center">
              <div className="bg-white p-1 rounded">
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
              </div>
            </div>
          )}
        </div>

        {data.skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold uppercase tracking-widest text-white border-y border-slate-700 py-2 mb-4 text-center">
              Skills
            </h3>
            <ul className="list-[square] list-inside space-y-1.5 text-sm pl-2">
              {data.skills.map((skill) => (
                <li key={skill.id}>
                  {skill.name}{" "}
                  {skill.level && (
                    <span className="text-slate-500">- {skill.level}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.languages.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold uppercase tracking-widest text-white border-y border-slate-700 py-2 mb-4 text-center">
              Languages
            </h3>
            <ul className="list-[square] list-inside space-y-1.5 text-sm pl-2">
              {data.languages.map((lang) => (
                <li key={lang.id}>
                  {lang.name}{" "}
                  {lang.proficiency && (
                    <span className="text-slate-500">- {lang.proficiency}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.certifications.length > 0 && (
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest text-white border-y border-slate-700 py-2 mb-4 text-center">
              Certifications
            </h3>
            <div className="space-y-3 pl-2">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="text-sm">
                  <div className="font-bold text-white">{cert.name}</div>
                  <div className="text-slate-400 text-xs">
                    {cert.organization}{" "}
                    {formatDate(cert.issueDate) &&
                      `| ${formatDate(cert.issueDate)}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content (Right) */}
      <div className="w-[65%] flex flex-col bg-white">
        {/* Header Block */}
        <div className="pt-12 px-8 pb-6 bg-slate-900 text-white">
          <h1 className="text-5xl font-extrabold uppercase tracking-tight mb-2 text-white">
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <h2 className="text-xl tracking-widest uppercase text-slate-300">
            {data.personalInfo.jobTitle || "Job Title"}
          </h2>
        </div>

        {/* Ribbon Decor */}
        <div className={`w-full h-8 ${colors.bg}`}></div>

        <div className="p-8 flex flex-col gap-6 text-gray-800">
          {data.summary && (
            <p className="text-sm leading-relaxed text-gray-600 mb-2">
              {data.summary}
            </p>
          )}

          {data.experience.length > 0 && (
            <section>
              <h3 className="text-xl font-bold uppercase tracking-widest text-center text-white bg-slate-800 py-1.5 rounded-sm mb-4">
                Experience
              </h3>
              <div className="space-y-5">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <h4 className="font-bold text-lg text-slate-900">
                      {exp.jobTitle}
                    </h4>
                    <div className="text-sm font-semibold text-gray-500 mb-1">
                      {exp.company}
                      {exp.location && `, ${exp.location}`} |{" "}
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-700 mt-2">
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

          {data.projects.length > 0 && (
            <section>
              <h3 className="text-xl font-bold uppercase tracking-widest text-center text-white bg-slate-800 py-1.5 rounded-sm mb-4">
                Projects
              </h3>
              <div className="space-y-4">
                {data.projects.map((proj) => (
                  <div key={proj.id}>
                    <h4 className="font-bold text-lg text-slate-900">
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
                    {proj.technologies && (
                      <div
                        className={`text-xs font-semibold mb-1 ${colors.text}`}
                      >
                        {proj.technologies}
                      </div>
                    )}
                    <p className="text-sm text-gray-700 mt-1">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <h3 className="text-xl font-bold uppercase tracking-widest text-center text-white bg-slate-800 py-1.5 rounded-sm mb-4">
                Education
              </h3>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-lg text-slate-900">
                      {edu.degree}
                    </h4>
                    <div className="text-sm font-semibold text-gray-500 mb-1">
                      {edu.institution}
                      {edu.location && `, ${edu.location}`} |{" "}
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                    {edu.description && (
                      <p className="text-sm text-gray-700 mt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.achievements.length > 0 && (
            <section>
              <h3 className="text-xl font-bold uppercase tracking-widest text-center text-white bg-slate-800 py-1.5 rounded-sm mb-4">
                Achievements
              </h3>
              <div className="space-y-4">
                {data.achievements.map((ach) => (
                  <div key={ach.id}>
                    <h4 className="font-bold text-lg text-slate-900">
                      {ach.title}
                    </h4>
                    {formatDate(ach.date) && (
                      <div className="text-sm font-semibold text-gray-500 mb-1">
                        {formatDate(ach.date)}
                      </div>
                    )}
                    <p className="text-sm text-gray-700 mt-1">
                      {ach.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.customSections.length > 0 && (
            <div className="flex flex-col gap-6 mt-2">
              {data.customSections.map((section) => (
                <section key={section.id}>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-center text-white bg-slate-800 py-1.5 rounded-sm mb-4">
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
