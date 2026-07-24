export declare class UploadController {
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    serveFile(filename: any, res: any): void;
}
