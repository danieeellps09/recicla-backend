import { IsArray, IsInt, ArrayNotEmpty, ArrayMinSize } from 'class-validator';

export class AddRolesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  roleIds: number[];
}