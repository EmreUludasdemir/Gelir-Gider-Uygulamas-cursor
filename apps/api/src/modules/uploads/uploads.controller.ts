import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadsService } from "./uploads.service";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  @Post("pdf")
  @UseInterceptors(FileInterceptor("file"))
  uploadPdf(@UploadedFile() file: Express.Multer.File) {
    return this.service.processPdf(file);
  }
}

