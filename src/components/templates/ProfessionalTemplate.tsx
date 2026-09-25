"use client";

import { ResumeData, ResumeTheme } from "@/types/resume";
import QRCode from "react-qr-code";

const getThemeColors = (theme: ResumeTheme) => {
  switch (theme) {
    case "blue": return { text: "text-blue-800", border: "border-blue-800" };
    case "green": return { text: "text-green-800", border: "border-green-800" };
    case "purple": return { text: "text-purple-800", border: "border-purple-800" };
    case "red": return { text: "text-red-800", border: "border-red-800" };
    case "gray":
    default:
      return { text: "text-gray-900", border: "border-gray-800" };
  }
};

export function ProfessionalTemplate({ data, theme }: { data: ResumeData; theme: ResumeTheme }) {
  const colors = getThemeColors(theme);
  
  const contactItems = [];
  if (data.personalInfo.email) contactItems.push(data.personalInfo.email);
  if (data.personalInfo.phone) contactItems.push(data.personalInfo.phone);
  if (data.personalInfo.location) contactItems.push(data.personalInfo.location);
  if (data.personalInfo.linkedin) contactItems.push(data.personalInfo.linkedin);
  if (data.personalInfo.github) contactItems.push(data.personalInfo.github);
  if (data.personalInfo.website) contactItems.push(data.personalInfo.website);

  return (
    <div className="relative flex flex-col w-full min-h-full bg-white text-gray-900 font-serif p-10">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className={`text-4xl font-bold uppercase mb-2 ${colors.text}`}>{data.personalInfo.fullName || "Your Name"}</h1>
        {data.personalInfo.jobTitle && (
          <h2 className="text-xl text-gray-700 mb-3">{data.personalInfo.jobTitle}</h2>
        )}
        <div className="text-sm text-gray-600 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {contactItems.map((item, index) => (
            <span key={index} className="flex items-center">
              {item}
              {index < contactItems.length - 1 && <span className="mx-2 text-gray-300">|</span>}
            </span>
          ))}
        </div>
        
        {data.personalInfo.portfolio && (
          <div className="absolute top-10 right-10 flex flex-col items-end">
            <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="bg-white p-1 rounded border border-gray-200">
              <QRCode value={data.personalInfo.portfolio} size={64} level="L" />
            </a>
            <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-[10px] text-gray-500 mt-1 hover:underline hover:text-blue-600 max-w-[80px] break-all text-right">
              {data.personalInfo.portfolio.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {data.summary && (
          <section>
            <h3 className={`text-lg font-bold uppercase border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}>Professional Summary</h3>
            <p className="text-sm leading-relaxed">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h3 className={`text-lg font-bold uppercase border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}>Experience</h3>
            <div className="flex flex-col gap-5">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-base">{exp.jobTitle}</h4>
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {exp.startDate} {exp.startDate && (exp.current || exp.endDate) ? "–" : ""} {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold italic text-gray-700 mb-2">
                    {exp.company} {exp.location && `| ${exp.location}`}
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h3 className={`text-lg font-bold uppercase border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}>Education</h3>
            <div className="flex flex-col gap-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-base">{edu.degree}</h4>
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold italic text-gray-700 mb-1">
                    {edu.institution} {edu.location && `| ${edu.location}`}
                  </div>
                  {edu.description && <p className="text-sm text-gray-800 whitespace-pre-wrap">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section>
            <h3 className={`text-lg font-bold uppercase border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}>Projects</h3>
            <div className="flex flex-col gap-4">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-base">{proj.name}</h4>
                  </div>
                  {proj.technologies && <div className="text-xs font-semibold italic text-gray-600 mb-2">{proj.technologies}</div>}
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h3 className={`text-lg font-bold uppercase border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}>Skills</h3>
            <div className="text-sm leading-relaxed">
              <span className="font-bold">Core Competencies: </span>
              {data.skills.map((skill) => skill.name).join(", ")}
            </div>
          </section>
        )}
        
        {data.certifications.length > 0 && (
          <section>
            <h3 className={`text-lg font-bold uppercase border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}>Certifications</h3>
            <ul className="list-disc list-inside text-sm flex flex-col gap-1">
              {data.certifications.map((cert) => (
                <li key={cert.id}>
                  <span className="font-semibold">{cert.name}</span> — {cert.organization} {cert.issueDate && `(${cert.issueDate})`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.achievements.length > 0 && (
          <section>
            <h3 className={`text-lg font-bold uppercase border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}>Achievements</h3>
            <ul className="list-disc list-inside text-sm flex flex-col gap-2">
              {data.achievements.map((ach) => (
                <li key={ach.id}>
                  <span className="font-semibold">{ach.title}</span> {ach.date && <span className="text-gray-600">({ach.date})</span>}
                  {ach.description && <div className="ml-5 text-gray-800 whitespace-pre-wrap">{ach.description}</div>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.customSections.length > 0 && (
          <div className="flex flex-col gap-6">
            {data.customSections.map((section) => (
              <section key={section.id}>
                <h3 className={`text-lg font-bold uppercase border-b-2 ${colors.border} pb-1 mb-3 ${colors.text}`}>{section.title}</h3>
                <div className="text-sm text-gray-800 whitespace-pre-wrap">
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
