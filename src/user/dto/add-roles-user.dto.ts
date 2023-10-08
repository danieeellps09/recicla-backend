import { IsArray, IsInt, ArrayNotEmpty, ArrayMinSize, IsString } from 'class-validator';

export class AddRolesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  roleNames: string[];
}