import { User } from 'src/user/entities/user.entity'
import {Request } from 'express'
import { Catador } from '@prisma/client'

export interface CatadorRequest extends Request{
catador: Catador
}