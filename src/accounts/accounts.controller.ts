import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.strategy';
import { Role } from 'src/guards/role.guard';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
@ApiBearerAuth()
@ApiTags('Accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Role('admin')
  @ApiOperation({ summary: 'Get all accounts' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ description: 'Get all accounts' })
  @ApiInternalServerErrorResponse({ description: 'Error finding accounts' })
  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @Role('USER')
  @ApiOperation({ summary: 'Create account' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCreatedResponse({ description: 'Account created successfully' })
  @ApiBadRequestResponse({ description: 'Error creating account' })
  @ApiInternalServerErrorResponse({ description: 'Error creating account' })
  @Post()
  create(
    @Body() dto: CreateAccountDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.accountsService.create(dto, req.user.id);
  }

  @Role('admin')
  @ApiOperation({ summary: 'Get account balance' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ description: 'Get account balance' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBadRequestResponse({ description: 'Error getting account balance' })
  @Get(':id')
  getAccountBalance(@Param('id') id: number) {
    return this.accountsService.getAccountBalance(id);
  }

  @Role('admin')
  @ApiOperation({ summary: 'Activate or deactivate account' })
  @ApiOkResponse({ description: 'Account updated successfully' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBadRequestResponse({ description: 'Error updating account' })
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateAccountDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.accountsService.update(id, dto, req.user.id);
  }

  @Role('user')
  @ApiOperation({ summary: 'Delete account' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ description: 'Account deleted successfully' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBadRequestResponse({ description: 'Error deleting account' })
  @Delete(':id')
  delete(@Param('id') id: number, @Request() req: { user: { id: number } }) {
    return this.accountsService.delete(id, req.user.id);
  }
}
