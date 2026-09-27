import { Inter, Lato, Montserrat, Poppins, Roboto } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});
const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

/**
 * Returns the same-origin Next.js font family string for a given standard font name.
 */
export function getNextFontFamily(fontName: string): string {
  switch (fontName) {
    case "Inter":
      return inter.style.fontFamily;
    case "Lato":
      return lato.style.fontFamily;
    case "Montserrat":
      return montserrat.style.fontFamily;
    case "Poppins":
      return poppins.style.fontFamily;
    case "Roboto":
      return roboto.style.fontFamily;
    case "Arial":
      return "Arial, sans-serif";
    case "Helvetica":
      return "Helvetica, sans-serif";
    case "Times New Roman":
      return "'Times New Roman', serif";
    case "Georgia":
      return "Georgia, serif";
    default:
      // If it's a fallback that we don't recognize, just return it directly.
      // This supports legacy values like "'Lato', sans-serif" if they exist in the DB.
      if (fontName.includes(",")) return fontName;
      return inter.style.fontFamily; // Fallback
  }
}
