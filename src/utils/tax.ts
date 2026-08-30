import axios from "axios";

export interface TaxPayerResponse {
  success?: boolean;
  message?: string;
  orgType?: string;
  taxID?: string;
  name?: string;
  address?: string;
  taxDepartment?: string;
  status?: string;
  updatedAt?: string;
}

export async function fetchTaxPayerInfo(taxCode: string): Promise<TaxPayerResponse | null> {
  const code = taxCode.trim();
  if (!code) return null;
  try {
    const res = await axios.get<TaxPayerResponse>(`https://api.xinvoice.vn/gdt-api/tax-payer/${code}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching tax payer info:", error);
    return null;
  }
}
