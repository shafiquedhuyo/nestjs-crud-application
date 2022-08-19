import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { HttpModule } from '@nestjs/axios';
import { SoapModule } from 'nestjs-soap';


@Module({
  imports: [HttpModule,SoapModule.register(
    { clientName: 'MY_SOAP_CLIENT', uri: 'http://www.dneonline.com/calculator.asmx?wsdl' },
  ),MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
