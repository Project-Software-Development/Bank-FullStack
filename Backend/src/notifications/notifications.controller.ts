import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { BasicUser } from "../auth/auth.types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { NotificationService } from "./notifications.service";

type RequestWithUser = Request & {
  user: BasicUser;
};

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

  @Delete(":id")
  deleteOne(@Req() request: RequestWithUser, @Param() id: string) {
    return this.notificationService.deleteOne(request.user.id, id);
  }

  @Delete()
  deleteAll(@Req() request: RequestWithUser) {
    return this.notificationService.deleteAll(request.user.id);
  }
}
