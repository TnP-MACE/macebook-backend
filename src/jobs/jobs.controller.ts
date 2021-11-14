import { Body, Controller, Delete, Get,Param, Patch, Post, Req, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { JobsDto } from './dto/jobs.dto';
import {JobsService} from './jobs.service';
import { ApplicationsDto } from './dto/applications.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';


@Controller('api/v1/jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {
    }
    @Get('')
    FindJobs(): Promise<any> { 
        return this.jobsService.getJobDetails() 
    }
    @Get('/s/:job_id')
    FindOneJob(@Param() job_id:string): Promise<any> { 
        return this.jobsService.getOneJobDetails(job_id) 
    }

    @Get('/search')
    SearchJobs(@Body() jobsearch:any): Promise<any> { 
        console.log(jobsearch)
        return this.jobsService.searchJobDetails(jobsearch) 
    }

    @Get('/alumni_job/:alumni_id')
    AlumniJob(@Param() param): Promise<any> { 
        return this.jobsService.AlumniJobDetails(param.alumni_id) 
    }   

    @Post('/add')  
    AddJob(@Body() jobDto:JobsDto): Promise<any> { 
        return this.jobsService.insertjob(jobDto) 
    }

    
    @Post('/applications/:job_id')  
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
    AddRemarks(@Param() param:any,@Body() applicationDto:ApplicationsDto): Promise<any> { 
        console.log(param)
        return this.jobsService.addremarks(applicationDto,param.application_id) 
    }


    

    @Patch('/alumni_job/:application_id')  
    ChangeStatus(@Param() param): Promise<any> { 
        var data={
            status:true
        }
        return this.jobsService.ChangeStatus(param.application_id ,data) 
    }

    @Get('/resume/:application_id')
    GetResume(@Param() param): Promise<any> { 
        return this.jobsService.selectresume(param.application_id) 
    }

    
    @Delete('j/:job_id')
    DeleteoneJob(@Param() job_id:string):Promise<any> { 
        return this.jobsService.deletejob(job_id) 
    }

    @Delete('/applications/:application_id')
    DeleteApplication(@Param() param):Promise<any>{
        console.log(param.application_id)
        return this.jobsService.deleteapplication(param.application_id)
    }

    @Delete('/resume/:application_id')
    DeleteResume(@Param() param):Promise<any>{
        return this.jobsService.deleteresume(param.application_id)
    }
}

