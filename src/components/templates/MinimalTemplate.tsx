"use client";

import { ResumeData, ResumeTheme } from "@/types/resume";

const getThemeColors = (theme: ResumeTheme) => {
  switch (theme) {
    case "blue": return "text-blue-900";
    case "green": return "text-green-900";
    case "purple": return "text-purple-900";
    case "red": return "text-red-900";
    case "gray":
    default:
      return "text-gray-900";
  }
};

export function MinimalTemplate({ data, theme }: { data: ResumeData; theme: ResumeTheme }) {
  const accentColor = getThemeColors(theme);
  
  const contactItems = [];
  if (data.personalInfo.email) contactItems.push(data.personalInfo.email);
  if (data.personalInfo.phone) contactItems.push(data.personalInfo.phone);
  if (data.personalInfo.location) contactItems.push(data.personalInfo.location);
  if (data.personalInfo.website) contactItems.push(data.personalInfo.website);
  if (data.personalInfo.linkedin) contactItems.push(data.personalInfo.linkedin);
  if (data.personalInfo.github) contactItems.push(data.personalInfo.github);

  return (
    <div className="flex flex-col w-full min-h-full bg-white text-gray-800 font-sans p-12 max-w-4xl mx-auto leading-relaxed">
      {/* Header */}
      <header className="mb-10">
        <h1 className={`text-3xl font-light tracking-tight mb-1 ${accentColor}`}>
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        {data.personalInfo.jobTitle && (
          <h2 className="text-lg font-medium text-gray-500 mb-4">{data.personalInfo.jobTitle}</h2>
        )}
        <div className="text-sm text-gray-400 flex flex-wrap gap-x-4 gap-y-2">
          {contactItems.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </header>

      <div className="flex flex-col gap-10">
        {data.summary && (
          <section>
            <h3 className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-4">Summary</h3>
            <p className="text-sm text-gray-700">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-4">Experience</h3>
            <div className="flex flex-col gap-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="md:col-span-1 text-sm text-gray-400 mt-1">
                    {exp.startDate} {exp.startDate && (exp.current || exp.endDate) ? "—" : ""} {exp.current ? "Present" : exp.endDate}
                  </div>
                  <div className="md:col-span-3">
                    <h4 className={`text-base font-medium ${accentColor}`}>{exp.jobTitle}</h4>
                    <div className="text-sm text-gray-500 mb-2">
                      {exp.company} {exp.location && `· ${exp.location}`}
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-4">Education</h3>
            <div className="flex flex-col gap-6">
              {data.education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="md:col-span-1 text-sm text-gray-400 mt-1">
                    {edu.startDate} {edu.startDate && edu.endDate ? "—" : ""} {edu.endDate}
                  </div>
                  <div className="md:col-span-3">
                    <h4 className={`text-base font-medium ${accentColor}`}>{edu.degree}</h4>
                    <div className="text-sm text-gray-500 mb-1">
                      {edu.institution} {edu.location && `· ${edu.location}`}
                    </div>
                    {edu.description && <p className="text-sm text-gray-600 whitespace-pre-wrap">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-4">Projects</h3>
            <div className="flex flex-col gap-6">
              {data.projects.map((proj) => (
                <div key={proj.id} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="md:col-span-1 text-sm text-gray-400 mt-1">
                    {proj.technologies}
                  </div>
                  <div className="md:col-span-3">
                    <h4 className={`text-base font-medium ${accentColor}`}>{proj.name}</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap mt-1">{proj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {data.skills.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-4">Skills</h3>
              <div className="text-sm text-gray-600">
                {data.skills.map((skill) => skill.name).join(", ")}
              </div>
            </section>
          )}

          {data.languages.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-4">Languages</h3>
              <div className="text-sm text-gray-600 flex flex-col gap-1">
                {data.languages.map((lang) => (
                  <div key={lang.id}>
                    <span className="font-medium text-gray-800">{lang.name}</span>
                    {lang.proficiency && <span className="text-gray-400 ml-2">({lang.proficiency})</span>}
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
