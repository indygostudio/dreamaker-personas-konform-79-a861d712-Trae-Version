
import type { FileRouter } from "uploadthing/next";
import { UploadButton, UploadDropzone } from "@uploadthing/react";

export const { UploadButton: CustomUploadButton, UploadDropzone: CustomUploadDropzone } = { UploadButton, UploadDropzone };

// Re-export types
export type OurFileRouter = FileRouter;
