import { Context, Get, Post , Patch, HttpResponseOK , TokenRequired , ValidateParams, HttpResponseBadRequest, ValidateBody, Delete, HttpResponseMethodNotAllowed } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import {User} from '../entities/user.entity';
import {Category} from '../entities/category.entity';
import {Note} from '../entities/note.entity'
import { getRepository} from 'typeorm';

const bodySchema = {
  additionalProperties: false,
  properties: {
    note: {type: 'string'},
    category : {type: 'string'}
  },
  required: [ 'note','category' ],
  type: 'object',
};

@TokenRequired({ store: TypeORMStore })
export class ApiController {

  @Get('/notes')
  @ValidateParams({ properties: { email: { type: 'string',format : 'email' } }, type: 'object' })
  async notes(ctx: Context) {
    console.log(ctx.request.query);
    const user = await getRepository(User)
    .findOne({email: ctx.request.query.email},{
      relations:['notes','notes.category']
    });
    if(!user){
      return new HttpResponseBadRequest();
    }
    return new HttpResponseOK({
      user:user.email,
      notes:user.notes
    });
  }

  @Post('/note')
  @ValidateBody(bodySchema)
  async note(ctx: Context){
    const user = await getRepository(User).findOne(ctx.user);
    const category = await getRepository(Category).findOne({name:ctx.request.body.category});
    if(!user || !category ){
      return new HttpResponseBadRequest({message:'Category or User not exists'})
    }
    const note = new Note();
    note.note = ctx.request.body.note;
    note.category = category;
    note.user = user;
    await getRepository(Note).save(note);
    return new HttpResponseOK({message: 'Your Note added successfully'})
  }

  @Delete('/note')
  @ValidateParams({ properties: { id: { type: 'number'} }, type: 'object' })
  async deleteNote(ctx: Context){
    const note = await getRepository(Note).findOne({id: ctx.request.query.id,user: ctx.user})
    if(!note){
      return new HttpResponseMethodNotAllowed()
    }

    await getRepository(Note).delete(note);
    return new HttpResponseOK({message: 'Your Note daleted successfully'});

  }

  @Patch('/note')
  @ValidateBody({
    additionalProperties: false,
    properties: { 
      id: { type: 'number'},
      note: {type: 'string'}
    },
    type: 'object', 
    required: [ 'note','id' ]
  })
  async updateNote(ctx: Context){
    const note = await getRepository(Note).findOne({id: ctx.request.body.id,user: ctx.user});

    if(!note){
      return new HttpResponseMethodNotAllowed();
    }

    Object.assign(note, {note:ctx.request.body.note});
    await getRepository(Note).save(note);

    return new HttpResponseOK({message: 'Your Note updated successfully'})
  }

}
