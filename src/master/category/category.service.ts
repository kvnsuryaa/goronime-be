import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name
      }
    })

    return category
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: {
        isDeleted: false
      }
    })

    return categories
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: id,
        isDeleted: false
      }
    })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return category
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: {
        id: id,
        isDeleted: false
      },
      data: {
        name: updateCategoryDto.name
      }
    })

    return category
  }

  async remove(id: string) {
    await this.prisma.category.update({
      where: {
        id: id
      },
      data: {
        isDeleted: true
      }
    })
  }
}
