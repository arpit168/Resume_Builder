/**
 * Unescapes PDF literal string escapes:
 * \( -> (
 * \) -> )
 * \\ -> \
 * \n -> \n
 * \r -> \r
 * \t -> \t
 * \b -> \b
 * \f -> \f
 * \ddd -> octal character code
 */
function unescapePdfString(str: string): string {
  return str
    .replace(/\\([()\\])/g, "$1")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\([0-7]{1,3})/g, (_, oct) =>
      String.fromCharCode(parseInt(oct, 8)),
    );
}

/**
 * Extracts plain text from a jsPDF or standard PDF output (string, Buffer, or Uint8Array).
 * Parses PDF text stream operators (BT ... ET, Tj, TJ, hex strings) into readable text.
 */
export function extractTextFromPdf(pdfContent: string | Uint8Array): string {
  let content = "";
  if (typeof pdfContent === "string") {
    content = pdfContent;
  } else {
    // Convert Uint8Array to binary string
    const bytes = new Uint8Array(pdfContent);
    let binary = "";
    const len = bytes.byteLength;
    const chunkSize = 8192;
    for (let i = 0; i < len; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
      binary += String.fromCharCode(...chunk);
    }
    content = binary;
  }

  const textChunks: string[] = [];
  const btEtRegex = /BT[\s\S]*?ET/g;
  let block: RegExpExecArray | null;

  while ((block = btEtRegex.exec(content)) !== null) {
    const blockContent = block[0];

    // 1. Literal string Tj: (string) Tj
    const tjRegex = /\(((?:[^()\\]|\\.)*)\)\s*Tj/g;
    let m: RegExpExecArray | null;
    while ((m = tjRegex.exec(blockContent)) !== null) {
      const decoded = unescapePdfString(m[1]).trim();
      if (decoded) textChunks.push(decoded);
    }

    // 2. Text array TJ: [ (string) -123 (string) ] TJ
    const tjArrayRegex = /\[([\s\S]*?)\]\s*TJ/g;
    let am: RegExpExecArray | null;
    while ((am = tjArrayRegex.exec(blockContent)) !== null) {
      const arrayInner = am[1];
      const strRegex = /\(((?:[^()\\]|\\.)*)\)/g;
      let sm: RegExpExecArray | null;
      while ((sm = strRegex.exec(arrayInner)) !== null) {
        const decoded = unescapePdfString(sm[1]).trim();
        if (decoded) textChunks.push(decoded);
      }
    }

    // 3. Hex string: <4172706974> Tj
    const hexRegex = /<([0-9a-fA-F]+)>\s*Tj/g;
    let hm: RegExpExecArray | null;
    while ((hm = hexRegex.exec(blockContent)) !== null) {
      const hex = hm[1];
      let decoded = "";
      for (let i = 0; i < hex.length; i += 2) {
        decoded += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
      }
      if (decoded.trim()) textChunks.push(decoded.trim());
    }
  }

  return textChunks.join(" ");
}
