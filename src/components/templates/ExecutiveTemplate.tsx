"use client";

import { ResumeData, ResumeTheme } from "@/types/resume";
import QRCode from "react-qr-code";

const getThemeColors = (theme: ResumeTheme) => {
  switch (theme) {
    case "blue": return { primary: "text-blue-900", bg: "bg-blue-900", border: "border-blue-900" };
    case "green": return { primary: "text-green-900", bg: "bg-green-900", border: "border-green-900" };
    case "purple": return { primary: "text-purple-900", bg: "bg-purple-900", border: "border-purple-900" };
    case "red": return { primary: "text-red-900", bg: "bg-red-900", border: "border-red-900" };
    case "gray":
    default:
      return { primary: "text-gray-900", bg: "bg-gray-900", border: "border-gray-900" };
  }
};

export function ExecutiveTemplate({ data, theme }: { data: ResumeData; theme: ResumeTheme }) {
  const colors = getThemeColors(theme);
  
  const contactItems = [];
  if (data.personalInfo.email) contactItems.push(data.personalInfo.email);
  if (data.personalInfo.phone) contactItems.push(data.personalInfo.phone);
  if (data.personalInfo.location) contactItems.push(data.personalInfo.location);
  if (data.personalInfo.linkedin) contactItems.push(data.personalInfo.linkedin);

  return (
    <div className="relative flex flex-col w-full min-h-full bg-white text-gray-900 font-serif">
      {/* Heavy Header */}
      <div className={`p-10 ${colors.bg} text-white flex flex-col items-center text-center`}>
        <h1 className="text-4xl font-extrabold tracking-widest uppercase mb-2">{data.personalInfo.fullName || "Your Name"}</h1>
        <h2 className="text-xl font-light tracking-widest mb-4 opacity-90 uppercase">{data.personalInfo.jobTitle || "Executive Title"}</h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-sans tracking-wide opacity-80">
          {contactItems.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
        
        {data.personalInfo.portfolio && (
          <div className="absolute top-8 right-10 flex flex-col items-center">
            <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="bg-white p-1 rounded shadow-sm border border-gray-200">
              <QRCode value={data.personalInfo.portfolio} size={64} level="L" />
            </a>
            <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-[9px] text-white/80 mt-1 hover:underline hover:text-white max-w-[80px] break-all text-center leading-tight">
              {data.personalInfo.portfolio.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>

      <div className="p-10 flex flex-col gap-8">
        {/* Executive Summary */}
        {data.summary && (
          <section className="text-center max-w-3xl mx-auto">
            <p className="text-lg leading-relaxed text-gray-700 italic">&quot;{data.summary}&quot;</p>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main Experience Column (2/3) */}
          <div className="md:col-span-2 flex flex-col gap-8">
            {data.experience.length > 0 && (
              <section>
                <h3 className={`text-2xl font-bold uppercase tracking-wider mb-6 border-b-2 ${colors.border} pb-2 ${colors.primary}`}>Professional Experience</h3>
                <div className="flex flex-col gap-8">
                  {data.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="text-xl font-bold text-gray-900">{exp.jobTitle}</h4>
                        <span className="text-sm font-bold text-gray-600 font-sans tracking-wider">
                          {exp.startDate} {exp.startDate && (exp.current || exp.endDate) ? "-" : ""} {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      <div className={`text-lg font-semibold mb-3 ${colors.primary}`}>
                        {exp.company} {exp.location && <span className="text-gray-500 font-normal">| {exp.location}</span>}
                      </div>
                      <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.projects.length > 0 && (
              <section>
                <h3 className={`text-2xl font-bold uppercase tracking-wider mb-6 border-b-2 ${colors.border} pb-2 ${colors.primary}`}>Key Initiatives</h3>
                <div className="flex flex-col gap-6">
                  {data.projects.map((proj) => (
                    <div key={proj.id}>
                      <h4 className="text-lg font-bold text-gray-900">{proj.name}</h4>
                      {proj.technologies && <div className="text-sm font-sans text-gray-500 mb-2 uppercase tracking-wider">{proj.technologies}</div>}
                      <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {data.customSections.length > 0 && (
              <div className="flex flex-col gap-8">
                {data.customSections.map((section) => (
                  <section key={section.id}>
                    <h3 className={`text-2xl font-bold uppercase tracking-wider mb-6 border-b-2 ${colors.border} pb-2 ${colors.primary}`}>{section.title}</h3>
                    <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                  </section>
                ))}
              </div>
            )}
          </div>

          {/* Side Column (1/3) */}
          <div className="md:col-span-1 flex flex-col gap-8">
            {data.skills.length > 0 && (
              <section>
                <h3 className={`text-xl font-bold uppercase tracking-wider mb-4 border-b-2 ${colors.border} pb-2 ${colors.primary}`}>Core Expertise</h3>
                <ul className="flex flex-col gap-2">
                  {data.skills.map((skill) => (
                    <li key={skill.id} className="text-base text-gray-800 font-medium pb-2 border-b border-gray-100">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {data.education.length > 0 && (
              <section>
                <h3 className={`text-xl font-bold uppercase tracking-wider mb-4 border-b-2 ${colors.border} pb-2 ${colors.primary}`}>Education</h3>
                <div className="flex flex-col gap-4">
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <h4 className="font-bold text-gray-900 leading-snug">{edu.degree}</h4>
                      <div className={`text-sm font-semibold mt-1 ${colors.primary}`}>{edu.institution}</div>
                      <div className="text-sm text-gray-500 font-sans mt-1">{edu.startDate} {edu.startDate && edu.endDate ? "-" : ""} {edu.endDate}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {data.achievements.length > 0 && (
              <section>
                <h3 className={`text-xl font-bold uppercase tracking-wider mb-4 border-b-2 ${colors.border} pb-2 ${colors.primary}`}>Honors & Awards</h3>
                <div className="flex flex-col gap-4">
                  {data.achievements.map((ach) => (
                    <div key={ach.id}>
                      <h4 className="font-bold text-gray-900 leading-snug">{ach.title}</h4>
                      {ach.date && <div className="text-sm text-gray-500 font-sans mt-1">{ach.date}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.certifications.length > 0 && (
              <section>
                <h3 className={`text-xl font-bold uppercase tracking-wider mb-4 border-b-2 ${colors.border} pb-2 ${colors.primary}`}>Certifications</h3>
                <div className="flex flex-col gap-4">
                  {data.certifications.map((cert) => (
                    <div key={cert.id}>
                      <h4 className="font-bold text-gray-900 leading-snug">{cert.name}</h4>
                      <div className="text-sm text-gray-600 mt-1">{cert.organization}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.languages.length > 0 && (
              <section>
                <h3 className={`text-xl font-bold uppercase tracking-wider mb-4 border-b-2 ${colors.border} pb-2 ${colors.primary}`}>Languages</h3>
                <div className="flex flex-col gap-2">
                  {data.languages.map((lang) => (
                    <div key={lang.id} className="flex flex-col">
                      <span className="font-bold text-gray-900 leading-snug">{lang.name}</span>
                      {lang.proficiency && <span className="text-sm text-gray-600">{lang.proficiency}</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
