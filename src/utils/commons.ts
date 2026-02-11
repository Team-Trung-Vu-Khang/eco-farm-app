import { vietQrBankData } from "@/constants/banks";
import { convertLexicalToHtml } from "@tankhang1/eco-shared-ui";

export const dateFormat = (date: string | number | Date) => {
  return new Intl.DateTimeFormat("vi", {
    day: "2-digit",
    year: "numeric",
    month: "2-digit",
  }).format(date instanceof Date ? date : new Date(date));
};

export const deepClone = (value: unknown) => {
  if (!value) {
    return value;
  }

  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};

export const parseVietQR = (text: string) => {
  // Basic VietQR parser (EMVCo Tag-Length-Value)
  // Tag 38: Consumer Presented Data
  // Sub-tag 01: Merchant ID (Bank Info)
  // Sub-sub-tag 00: Bank ID, 01: Account Number

  try {
    if (!text.startsWith("000201")) return null;

    const findTag = (data: string, targetTag: string) => {
      let i = 0;
      while (i < data.length) {
        const tag = data.substring(i, i + 2);
        const len = parseInt(data.substring(i + 2, i + 4));
        const val = data.substring(i + 4, i + 4 + len);
        if (tag === targetTag) return val;
        i += 4 + len;
      }
      return null;
    };

    const tag38 = findTag(text, "38");
    const accountHolder = findTag(text, "59");
    const additionalData = findTag(text, "62");
    const note = additionalData ? findTag(additionalData, "08") : "";

    if (tag38) {
      const bankData = findTag(tag38, "01");
      if (bankData) {
        const bankId = findTag(bankData, "00"); // NAPAS Bin
        const accountNumber = findTag(bankData, "01");

        const binMapValue = vietQrBankData.find((bank) => bank.bin === bankId);

        return {
          note: note || "",
          bin: binMapValue?.bin || "",
          bankId: binMapValue?.id || "",
          bankName: binMapValue?.name || "",
          accountNumber: accountNumber || "",
          accountHolder: accountHolder || "",
        };
      }
    }

    // Fallback: search for numbers that look like account numbers
    const accMatch = text.match(/\d{9,16}/);
    if (accMatch) {
      return {
        accountNumber: accMatch[0],
        bankName: "",
        bankId: "",
        bin: "",
        accountHolder: accountHolder || "",
        note: note || "",
      };
    }
  } catch (e) {
    console.error("QR Parse Error", e);
  }
  return null;
};

export const isContaintHtmlTag = (text: string) => {
  return text.startsWith("<") && text.endsWith(">");
};

export const safeConvertLexicalToHtml = async (editorContent: string) => {
  try {
    return await convertLexicalToHtml(editorContent);
  } catch (error) {
    console.error("Error converting Lexical to HTML:", error);
    return "";
  }
};
