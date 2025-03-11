
export interface Banner {
  id: string;
  type: "video" | "image";
  url: string;
  title: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
}
