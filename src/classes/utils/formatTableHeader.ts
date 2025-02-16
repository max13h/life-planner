export const formatTableHeader = (tableColumns: string[]): string => {
  const header = `|${tableColumns.join('|')}|`;
  const separator = header.replace(/[^|]/g, '-');
  
  return `${header}\n${separator}`;
}