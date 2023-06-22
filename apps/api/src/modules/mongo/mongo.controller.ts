import { Controller, Get, Param } from "@nestjs/common";
import { MongoService } from "./mongo.service";

@Controller("mongo")
export class MongoController {
  constructor(private readonly mongoService: MongoService) {}
  @Get("github-links/:id")
  async getGitHubLink(@Param("id") id: string): Promise<string> {
    return this.mongoService.getGitHubLinkById(id);
  }
}