import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { BasicUser } from "../auth/auth.types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationStatusDto } from "./dto/update-notification-status.dto";
import { NotificationService } from "./notification.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

type RequestWithUser = Request & {
  user: BasicUser;
};

@ApiTags("Notifications")
@ApiBearerAuth("JWT-auth")
@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(
    @Req() request: RequestWithUser,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationService.create(
      request.user.id,
      createNotificationDto,
    );
  }

  @Get()
  findAll(@Req() request: RequestWithUser) {
    return this.notificationService.findAll(request.user.id);
  }

  @Patch(":id/status")
  updateStatus(
    @Req() request: RequestWithUser,
    @Param("id") id: string,
    @Body() updateNotificationStatusDto: UpdateNotificationStatusDto,
  ) {
    return this.notificationService.updateReadStatus(
      request.user.id,
      id,
      updateNotificationStatusDto.lida,
    );
  }

  @Delete(":id")
  deleteOne(@Req() request: RequestWithUser, @Param("id") id: string) {
    return this.notificationService.deleteOne(request.user.id, id);
  }

  @Delete()
  deleteAll(@Req() request: RequestWithUser) {
    return this.notificationService.deleteAll(request.user.id);
  }
}
