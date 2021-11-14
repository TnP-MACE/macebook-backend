import { Body, Controller, Delete, Get,Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { JobsDto, SearchJobsDto } from './dto/jobs.dto';
import {JobsService} from './jobs.service';
import { ApplicationsDto } from './dto/applications.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Jobs')
@Controller('api/v1/jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {
    }
    @Get('')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'To get complete job in the database'})
    // @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } }) 
    FindJobs(): Promise<any> { 
        return this.jobsService.getJobDetails() 
    }
    @Get('/s/:job_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'To get details of one job' })
    @ApiParam({ name: 'job_id', required: true, schema: { oneOf: [{ type: 'string' }] } }) 
    FindOneJob(@Param() job_id:string): Promise<any> { 
        return this.jobsService.getOneJobDetails(job_id) 
    }

    @Get('/search')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Search job' })
    // @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } }) 
    SearchJobs(@Body() jobsearch:SearchJobsDto): Promise<any> { 
        console.log(jobsearch)
        return this.jobsService.searchJobDetails(jobsearch) 
    }

    @Get('/alumni_job/:alumni_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Return the complete job posted by the alumni and complete applications in each job including the student name and student id' })
    @ApiParam({ name: 'alumni_id', required: true, schema: { oneOf: [{ type: 'string' }] } }) 
    AlumniJob(@Param() param): Promise<any> { 
        return this.jobsService.AlumniJobDetails(param.alumni_id) 
    }   

    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Add one job' })
    // @ApiParam({ name: 'post_id', required: true, schema: { oneOf: [{ type: 'string' }] } }) 
    AddJob(@Body() jobDto:JobsDto): Promise<any> { 
        return this.jobsService.insertjob(jobDto) 
    }

    
    @Post('/applications/:job_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'To insert application where student can add resume whenever required' })
    @ApiParam({ name: 'job_id', required: true, schema: { oneOf: [{ type: 'string' }] } })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            profilepicture: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      }) 
    @UseInterceptors(FileInterceptor('resume', {
        storage: diskStorage({
            destination: './uploads/resume',
            filename: (req, file, cb) => {
                const ori=file.originalname.split(".")
                const fileName = ori[0]+"_"+uuidv4();
                return cb(null, `${fileName}${extname(file.originalname)}`);
            }
        })
    }))
    AddApplication(@Param() param,@Body() applicationDto:ApplicationsDto,@UploadedFile() file: Express.Multer.File) { 
        return this.jobsService.insertapplication(applicationDto,file.filename,param.job_id)
    }


    @Patch('/remarks/:application_id') 
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Search Post' })
    @ApiParam({ name: 'application_id', required: true, schema: { oneOf: [{ type: 'string' }] } }) 
    AddRemarks(@Param() param:any,@Body() applicationDto:ApplicationsDto): Promise<any> { 
        console.log(param)
        return this.jobsService.addremarks(applicationDto,param.application_id) 
    }


    

    @Patch('/alumni_job/:application_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'an change the status. staus used to show new application count ' })
    @ApiParam({ name: 'application_id', required: true, schema: { oneOf: [{ type: 'string' }] } })   
    ChangeStatus(@Param() param): Promise<any> { 
        var data={
            status:true
        }
        return this.jobsService.ChangeStatus(param.application_id ,data) 
    }

    @Get('/resume/:application_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Can be used to select resume' })
    @ApiParam({ name: 'application_id', required: true, schema: { oneOf: [{ type: 'string' }] } }) 
    GetResume(@Param() param): Promise<any> { 
        return this.jobsService.selectresume(param.application_id) 
    }

    
    @Delete('j/:job_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Delete the job posted by alumni' })
    @ApiParam({ name: 'job_id', required: true, schema: { oneOf: [{ type: 'string' }] } }) 
    DeleteoneJob(@Param() job_id:string):Promise<any> { 
        return this.jobsService.deletejob(job_id) 
    }
  

    @Delete('/applications/:application_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Delete Application' })
    @ApiParam({ name: 'application_id', required: true, schema: { oneOf: [{ type: 'string' }] } }) 
    DeleteApplication(@Param() param):Promise<any>{
        console.log(param.application_id)
        return this.jobsService.deleteapplication(param.application_id)
    }

    @Delete('/resume/:application_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Search Post' })
    @ApiParam({ name: 'application_id', required: true, schema: { oneOf: [{ type: 'string' }] } }) 
    DeleteResume(@Param() param):Promise<any>{
        return this.jobsService.deleteresume(param.application_id)
    }

    @Patch('/job/:job_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Update job' })
    @ApiParam({ name: 'job_id', required: true, schema: { oneOf: [{ type: 'string' }] } })   
    UpdateJob(@Param() param,@Body() jobDto:JobsDto): Promise<any> { 
        console.log("ksddbkjsawhndkndsk")
        return this.jobsService.updatejob(param.job_id,jobDto) 
    }
}

