import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpService } from '@nestjs/axios';
import { Client } from 'nestjs-soap';




@Injectable()
export class UsersService {
  constructor(@Inject('MY_SOAP_CLIENT') private readonly mySoapClient: Client, @InjectModel(User.name) private userModel: Model<UserDocument>, private httpService: HttpService) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return new this.userModel(createUserDto).save();
  }

  async findAll() {
    return this.userModel.find();
  }

  async findOne(name: string) {
    return this.userModel.findOne({ name });
  }

  async update(name: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ name }, { $set: { ...updateUserDto } });
  }

  async remove(name: string) {
    return this.userModel.deleteOne({ name });
  }

  async findAllFromAPI() {
    var usersArr = []
    const apiResponse =  this.httpService.get('https://reqres.in/api/users');
    const users = await apiResponse.toPromise();
    for (const user of users.data.data) {
      user['age'] = await this.getUserAge();
      // console.log(this.getUserAge());
      usersArr.push(user);
    }

    return usersArr;
  }
  async getUserAge(): Promise<String> {
    var age: any;
    var apiResponse: any;
    apiResponse = await this.mySoapClient.AddAsync({ intA: 15, intB: 15 }).then((result: any) => {
      console.log('Soap Request:', result[3]);
      console.log('Soap Response:', result[1]);
      return result[1];
    })
      .catch((err: any) => {
        console.log('Error>>>', err);
      });
    age = await this.getAgeValue(apiResponse.replaceAll('soap:', ''));
    return age;
  }
  async getAgeValue(responseXml: any): Promise<String> {
    const xml2js = require('xml2js');
    var age;
    xml2js.parseString(responseXml, { mergeAttrs: true }, (err: any, result: any) => {
      if (err) {
        throw err;
      }
      // `result` is a JavaScript object
      // convert it to a JSON string
      const json = JSON.parse(JSON.stringify(result, null, 4));
      age = json['Envelope']['Body'][0]['AddResponse'][0]['AddResult'][0];
    });

    return age;
  }

}


