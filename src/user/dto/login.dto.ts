import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: 'Email or username is required' })
    identifier: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Your password must be at least 8 characters long' })
    password: string;
}