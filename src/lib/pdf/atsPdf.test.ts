import { describe, it, expect } from "vitest";
import { generateResumePdf } from "./generatePdf";
import { extractTextFromPdf } from "./extractPdfText";
import { extractDomTextItems, sortItemsByAtsOrder } from "./extractDomText";
import { AtsTextItem } from "./types";
import { ResumeData } from "@/types/resume";
import { jsPDF } from "jspdf";

const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: "Arpit Gupta",
    jobTitle: "Frontend Developer",
    email: "arpit.gupta@example.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    website: "https://arpitgupta.dev",
    linkedin: "https://linkedin.com/in/arpitgupta",
    github: "https://github.com/arpitgupta",
    photoUrl: "",
    portfolio: "https://arpitgupta.dev/portfolio",
  },
  summary:
    "Experienced Frontend Developer specialized in building high-performance web applications using React, Next.js, and TypeScript.",
  skills: [
    { id: "1", name: "React", level: "Expert" },
    { id: "2", name: "Next.js", level: "Expert" },
    { id: "3", name: "TypeScript", level: "Advanced" },
    { id: "4", name: "JavaScript", level: "Expert" },
    { id: "5", name: "MongoDB", level: "Intermediate" },
  ],
  experience: [
    {
      id: "exp-1",
      jobTitle: "Senior Frontend Engineer",
      company: "Tech Corp",
      location: "Bangalore",
      startDate: "2022-01",
      endDate: "2024-03",
      current: true,
      description:
        "Architected enterprise dashboard using Next.js and TypeScript, reducing load times by 40%.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Hire-Craft Resume Builder",
      description:
        "Interactive ATS-optimized resume builder with custom layout design.",
      technologies: "Next.js, TypeScript, TailwindCSS, MongoDB",
      projectUrl: "https://hire-craft.example.com",
      githubUrl: "https://github.com/arpitgupta/hire-craft",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Technology in Computer Science",
      institution: "National Institute of Technology",
      location: "India",
      startDate: "2017-08",
      endDate: "2021-05",
      grade: "8.8 CGPA",
      description: "Graduated with honors in Computer Science and Engineering.",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Developer",
      organization: "Amazon Web Services",
      issueDate: "2023-06",
      credentialId: "AWS-123456",
      credentialUrl: "https://aws.amazon.com/verify",
    },
  ],
  languages: [
    { id: "lang-1", name: "English", proficiency: "Fluent" },
    { id: "lang-2", name: "Hindi", proficiency: "Native" },
  ],
  achievements: [
    {
      id: "ach-1",
      title: "First Prize Hackathon",
      date: "2023-11",
      description: "Won 1st place in national web development hackathon.",
    },
  ],
  customSections: [],
};

describe("ATS PDF Text Extraction and Compatibility", () => {
  it("exports a PDF containing real selectable text with all crucial ATS information", async () => {
    // 1. Create a simulated container element for the resume preview paper
    const paper = document.createElement("div");
    paper.id = "resume-preview-paper";
    document.body.appendChild(paper);

    // 2. Export PDF
    const pdf = await generateResumePdf(
      paper,
      "Arpit_Gupta_Resume.pdf",
      sampleResumeData,
    );
    expect(pdf).toBeDefined();

    // 3. Extract text from generated PDF output
    const pdfOutput = pdf.output();
    const extractedText = extractTextFromPdf(pdfOutput);

    // 4. Verify candidate information exists as real text
    expect(extractedText).toContain("Arpit Gupta");
    expect(extractedText).toContain("Frontend Developer");
    expect(extractedText).toContain("arpit.gupta@example.com");
    expect(extractedText).toContain("+91 98765 43210");
    expect(extractedText).toContain("https://linkedin.com/in/arpitgupta");
    expect(extractedText).toContain("https://github.com/arpitgupta");

    // 5. Verify ATS keywords and skills
    expect(extractedText).toContain("React");
    expect(extractedText).toContain("Next.js");
    expect(extractedText).toContain("TypeScript");
    expect(extractedText).toContain("JavaScript");
    expect(extractedText).toContain("MongoDB");

    // 6. Verify section headings
    expect(extractedText.toUpperCase()).toContain("WORK EXPERIENCE");
    expect(extractedText.toUpperCase()).toContain("EDUCATION");
    expect(extractedText.toUpperCase()).toContain("PROJECTS");
    expect(extractedText.toUpperCase()).toContain("SKILLS");

    // 7. Verify experience and project details
    expect(extractedText).toContain("Senior Frontend Engineer");
    expect(extractedText).toContain("Tech Corp");
    expect(extractedText).toContain("Hire-Craft Resume Builder");
    expect(extractedText).toContain("Bachelor of Technology");

    document.body.removeChild(paper);

    try {
      const fs = await import("fs");
      if (fs.existsSync("Arpit_Gupta_Resume.pdf")) {
        fs.unlinkSync("Arpit_Gupta_Resume.pdf");
      }
    } catch {}
  });

  it("fails text extraction verification if PDF is image-only (rasterized)", () => {
    // Simulate legacy image-only PDF export (no text layer)
    const legacyPdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    // In legacy export, only pdf.addImage was called without any pdf.text calls
    // 1x1 transparent PNG data URL
    const dummyDataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    legacyPdf.addImage(dummyDataUrl, "PNG", 0, 0, 210, 297);

    const legacyText = extractTextFromPdf(legacyPdf.output());

    // An image-only PDF has NO extractable text
    expect(legacyText).not.toContain("Arpit Gupta");
    expect(legacyText).not.toContain("Frontend Developer");
    expect(legacyText).not.toContain("React");
    expect(legacyText).not.toContain("Next.js");
    expect(legacyText).not.toContain("Work Experience");
    expect(legacyText).toBe("");
  });

  it("preserves ATS reading order (HEADER -> SUMMARY -> SKILLS -> EXPERIENCE -> PROJECTS -> EDUCATION)", () => {
    const unorderedItems: AtsTextItem[] = [
      {
        text: "Bachelor of Technology",
        x: 20,
        y: 200,
        width: 100,
        height: 10,
        fontSizePt: 10,
        fontFamily: "helvetica",
        fontWeight: "normal",
        fontStyle: "normal",
        category: "EDUCATION",
      },
      {
        text: "Senior Frontend Engineer",
        x: 20,
        y: 120,
        width: 100,
        height: 10,
        fontSizePt: 12,
        fontFamily: "helvetica",
        fontWeight: "bold",
        fontStyle: "normal",
        category: "EXPERIENCE",
      },
      {
        text: "Arpit Gupta",
        x: 20,
        y: 20,
        width: 100,
        height: 15,
        fontSizePt: 22,
        fontFamily: "helvetica",
        fontWeight: "bold",
        fontStyle: "normal",
        category: "HEADER",
      },
      {
        text: "React, Next.js, TypeScript",
        x: 20,
        y: 90,
        width: 100,
        height: 10,
        fontSizePt: 10,
        fontFamily: "helvetica",
        fontWeight: "normal",
        fontStyle: "normal",
        category: "SKILLS",
      },
      {
        text: "Hire-Craft Resume Builder",
        x: 20,
        y: 160,
        width: 100,
        height: 10,
        fontSizePt: 11,
        fontFamily: "helvetica",
        fontWeight: "bold",
        fontStyle: "normal",
        category: "PROJECTS",
      },
      {
        text: "Experienced Frontend Developer with 5+ years experience",
        x: 20,
        y: 60,
        width: 100,
        height: 10,
        fontSizePt: 10,
        fontFamily: "helvetica",
        fontWeight: "normal",
        fontStyle: "normal",
        category: "SUMMARY",
      },
    ];

    const sorted = sortItemsByAtsOrder(unorderedItems);
    const sortedCategories = sorted.map((item) => item.category);

    expect(sortedCategories).toEqual([
      "HEADER",
      "SUMMARY",
      "SKILLS",
      "EXPERIENCE",
      "PROJECTS",
      "EDUCATION",
    ]);
  });

  it("extracts DOM text items and correctly categorizes sections", () => {
    const container = document.createElement("div");
    container.id = "resume-preview-paper";
    container.innerHTML = `
      <div class="resume-root">
        <h1>Arpit Gupta</h1>
        <h2>Frontend Developer</h2>
        <div class="contact">
          <a href="mailto:arpit@example.com">arpit@example.com</a>
          <a href="tel:+919876543210">+91 98765 43210</a>
        </div>
        <section>
          <h3>Work Experience</h3>
          <div>
            <div class="job-title">Senior Frontend Engineer</div>
            <div class="company">Tech Corp</div>
            <p>Architected web applications using React, Next.js, and TypeScript.</p>
          </div>
        </section>
        <section>
          <h3>Technical Skills</h3>
          <p>React, Next.js, TypeScript, JavaScript, MongoDB</p>
        </section>
      </div>
    `;
    document.body.appendChild(container);

    const items: AtsTextItem[] = extractDomTextItems(container, 1);
    const allText = items.map((i) => i.text).join(" ");

    expect(allText).toContain("Arpit Gupta");
    expect(allText).toContain("Frontend Developer");
    expect(allText).toContain("arpit@example.com");
    expect(allText).toContain("Senior Frontend Engineer");
    expect(allText).toContain(
      "React, Next.js, TypeScript, JavaScript, MongoDB",
    );

    const expItem = items.find((i) => i.text === "Senior Frontend Engineer");
    expect(expItem?.category).toBe("EXPERIENCE");

    const skillItem = items.find((i) =>
      i.text.includes("React, Next.js, TypeScript"),
    );
    expect(skillItem?.category).toBe("SKILLS");

    document.body.removeChild(container);
  });
});
