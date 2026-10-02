export type AtsSectionCategory =
  | "HEADER"
  | "SUMMARY"
  | "SKILLS"
  | "EXPERIENCE"
  | "PROJECTS"
  | "EDUCATION"
  | "CERTIFICATIONS"
  | "ACHIEVEMENTS"
  | "LANGUAGES"
  | "CUSTOM";

export interface AtsTextItem {
  text: string;
  x: number; // in mm relative to paper
  y: number; // in mm relative to paper
  width: number; // in mm
  height: number; // in mm
  fontSizePt: number;
  fontFamily: "helvetica" | "times" | "courier";
  fontWeight: "bold" | "normal";
  fontStyle: "italic" | "normal";
  category: AtsSectionCategory;
}

export interface ExtractedPageText {
  pageNum: number;
  items: AtsTextItem[];
}
