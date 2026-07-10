import "server-only";
import ExcelJS from "exceljs";

/**
 * Prefija con un apóstrofo cualquier valor de texto que empiece con un
 * carácter capaz de disparar una fórmula al abrirse en Excel/Sheets
 * (=, +, -, @, tab, CR). exceljs ya escribe strings como texto plano
 * (nunca como fórmula salvo que se pase `{formula: ...}`), pero esto se
 * mantiene como defensa en profundidad explícita: es un requisito no
 * negociable del proyecto evitar la corrupción de fórmulas al exportar.
 */
function sanitizeCell(value: unknown): unknown {
  if (typeof value !== "string") return value;
  if (/^[=+\-@\t\r]/.test(value)) return `'${value}`;
  return value;
}

export interface ReportColumn {
  header: string;
  key: string;
  width?: number;
}

/**
 * Construye un .xlsx de una sola hoja y lo devuelve como Response de
 * descarga. Cada celda de texto pasa por `sanitizeCell`.
 */
export async function buildXlsxResponse(
  filename: string,
  sheetName: string,
  columns: ReportColumn[],
  rows: object[],
): Promise<Response> {
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = columns.map((c) => ({ header: c.header, key: c.key, width: c.width ?? 22 }));
  sheet.getRow(1).font = { bold: true };

  for (const row of rows) {
    const record = row as Record<string, unknown>;
    const sanitized: Record<string, unknown> = {};
    for (const col of columns) sanitized[col.key] = sanitizeCell(record[col.key]);
    sheet.addRow(sanitized);
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
