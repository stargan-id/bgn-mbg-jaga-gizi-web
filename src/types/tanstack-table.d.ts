// tanstack-table.d.ts
import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // Menambahkan properti 'onDelete' ke dalam interface TableMeta
  // 'TData' adalah tipe generik untuk data baris (RowData)
  interface TableMeta<TData extends RowData> {
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    onView?: (id: string) => void;
  }
}