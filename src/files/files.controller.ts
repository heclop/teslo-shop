import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){

    const path = this.filesService.getStaticProductImage( imageName );

    res.sendFile( path )
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  @ApiConsumes('multipart/form-data') // Indica que el endpoint acepta multipart/form-data
  @ApiBody({
    description: 'Sube una imagen para un producto',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFileImage(
   @UploadedFile() file: Express.Multer.File
  ){
    
    if( !file ){
      throw new BadRequestException(' Make sure tah file is an image')
    }

    const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;

    return{
      filnName: {secureUrl},
    }
  }

}
