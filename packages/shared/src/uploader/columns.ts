export type ImportColumnRole =
  | "parentSku"
  | "sku"
  | "sourceTitle"
  | "productTag"
  | "color"
  | "size"
  | "sourceUrl"
  | "price"
  | "sourceMainImage"
  | "childVariantImage";

export interface ExcelColumnRange {
  start: number;
  end: number;
}

export interface UploaderColumnContract {
  id: string;
  source: string;
  columns: Record<ImportColumnRole, number>;
  ranges: {
    sourceExtraImages: ExcelColumnRange;
    aliexpressDescriptionImages: ExcelColumnRange;
  };
}

export const CURRENT_UPLOADER_CONTRACT: UploaderColumnContract = {
  id: "yaowo-uploader-2026-06-15",
  source: "E:/上传器/上传器_完整包 (2)/上传器_完整包",
  columns: {
    parentSku: 1,
    sku: 2,
    sourceTitle: 3,
    productTag: 5,
    color: 10,
    size: 11,
    sourceUrl: 12,
    price: 13,
    sourceMainImage: 18,
    childVariantImage: 41
  },
  ranges: {
    sourceExtraImages: { start: 18, end: 38 },
    aliexpressDescriptionImages: { start: 67, end: 86 }
  }
};

export function getImportColumnByRole(role: ImportColumnRole, contract = CURRENT_UPLOADER_CONTRACT): number {
  return contract.columns[role];
}

export function excelColumnName(oneBasedColumn: number): string {
  if (!Number.isInteger(oneBasedColumn) || oneBasedColumn < 1) {
    throw new RangeError(`Excel column must be a positive integer: ${oneBasedColumn}`);
  }

  let value = oneBasedColumn;
  let name = "";
  while (value > 0) {
    value -= 1;
    name = String.fromCharCode(65 + (value % 26)) + name;
    value = Math.floor(value / 26);
  }
  return name;
}
