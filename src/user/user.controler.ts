import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserModel } from "./user.model";
import { UserResponseInterface } from "./types/user.interface";
import { UserService } from "./user.service";
import { AuthGuard } from "./guards/auth.guards";
import { User } from "./decorates/userDecorators";
import { BackendValidationPipe } from "src/shared/pipes/BackendValidation.pipe";
import { LoginUserDto } from "./dto/loginUser.dto";
import { CreateUSerDto } from "./dto/createUser.dto";
import { UpdatePasswordDto } from "./dto/updatePassword.to";
import { Roles } from "src/user/decorates/roles.decorator";
import { Role } from "src/user/types/role.enum";
import { RolesGuard } from "./guards/role.guards";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  //@Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async create(
    @Body("user")
    createUserDto: CreateUSerDto
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Post("login")
  @UsePipes(new BackendValidationPipe())
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(@User() user: UserModel): Promise<UserModel[]> {
    const users = await this.userService.findAllUser();
    return users;
  }

  @Delete(":id") // DELETE endpoint for deleting a user by ID
  @UseGuards(AuthGuard)
  async deleteUser(@Param("id") id: string) {
    const deletedUser = await this.userService.deleteUserById(id);

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { message: "User deleted successfully" };
  }

  @Patch("password")
  @UseGuards(AuthGuard)
  async changePassword(
    @User("id") currentUserId: string,
    @Body() updatePassword: UpdatePasswordDto
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updatePassword(
      currentUserId,
      updatePassword
    );

    return this.userService.buildUserResponse(user);
  }
}
