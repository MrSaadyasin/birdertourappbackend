import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// import { User } from 'src/model/user.model';
import { BlogDTO } from 'src/dto/blog.dto';
import { Blog } from 'src/model/blog.model';
import { FileUploadService } from 'src/Utils/UploadFile.service';



@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    private fileUpload: FileUploadService,
  ) { }

  async BlogList() {
    return await this.blogModel.find().sort({createdAt: -1})
  }

  async BlogCreate(body: BlogDTO, request: any) {
    try {
      const { title, description, metaTitle, metaDescription, keywords } = body
      const metaKeywords = keywords && JSON.parse(keywords)
      const user_id = request['user'].id
      const files = request.files as any;
      if (!files.banner_image) {
        throw new HttpException('Banner Image is required', HttpStatus.BAD_REQUEST)
      }
      let banner_image;
      const image = files.banner_image[0];
      banner_image = await this.fileUpload.uploadSingleFile(image.buffer, image.originalname);
      return await this.blogModel.create({
        user: user_id,
        title: title,
        description: description,
        metaDescription: metaDescription,
        metaTitle: metaTitle,
        keywords: keywords ? metaKeywords.map((keyword) => keyword) : '',
        banner_image: banner_image.Location
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async BlogDelete(id: string) {
    try {
      await this.blogModel.deleteOne({ _id: id })
      return

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  async BlogEdit(slug: string) {
    try {
      const blog = await this.blogModel.findOne({ slug: slug })
      return blog

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  async BlogUpdate(slug: string, request: any) {
    try {
      const { title, description, metaTitle, metaDescription, keywords } = request.body
      const blog = await this.blogModel.findOne({slug: slug})
      const metaKeywords = keywords && JSON.parse(keywords)
      if (blog) {
        if (request.files.banner_image) {
          const files = request.files as any;
          const image = files.banner_image[0];
          const banner_image = await this.fileUpload.uploadSingleFile(image.buffer, image.originalname);
          blog.banner_image = banner_image.Location;
        }
        blog.title = title
        blog.description = description
        blog.metaTitle = metaTitle
        blog.metaDescription = metaDescription
        blog.keywords = keywords ? metaKeywords.map((keyword) => keyword) : ''
        await blog.save()
        return blog
      } else {
        throw new HttpException('Blog Not Found', HttpStatus.NOT_FOUND)
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  async BlogDetail(slug: string){
    try {
      return await this.blogModel.findOne({slug : slug})
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }
}


