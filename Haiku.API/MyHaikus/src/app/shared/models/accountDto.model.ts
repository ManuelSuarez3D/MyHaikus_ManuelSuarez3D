import { UserDto } from "./userDto.model";
export interface AccountDto extends UserDto {
  bio: string;
  filePath: string;
}
