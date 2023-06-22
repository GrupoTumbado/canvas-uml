import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Link } from "./schemas/mongo.model";

@Injectable()
export class MongoService {
  constructor(
    @InjectModel(Link.name) private readonly linkModel: Model<Link>,
  ) {}

  async getGitHubLinkById(id: string): Promise<string> {
    const link: Link = await this.linkModel.findById(id).exec();

    if (!link) {
      throw new HttpException("El enlace no fue encontrado", HttpStatus.NOT_FOUND);
    }

    return link.url;
  }
}
