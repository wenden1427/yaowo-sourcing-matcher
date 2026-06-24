import ExcelJS from "exceljs";

export interface WriteRowsWorkbookInput {
  outputPath: string;
  worksheetName: string;
  headers: unknown[];
  rows: unknown[][];
}

export async function writeRowsWorkbook(input: WriteRowsWorkbookInput): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(input.worksheetName);

  worksheet.addRow(input.headers);
  for (const row of input.rows) {
    worksheet.addRow(row);
  }

  await workbook.xlsx.writeFile(input.outputPath);
}
