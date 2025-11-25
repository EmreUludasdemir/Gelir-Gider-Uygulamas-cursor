import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadsService } from "./uploads.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("pdf")
  @UseInterceptors(FileInterceptor("file"))
  uploadPdf(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { sub: string }
  ) {
    return this.service.processPdf(user.sub, file);
  }
}

