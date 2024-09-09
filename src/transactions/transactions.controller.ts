import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionDepositDto } from './dto/transaction-deposit.dto';
import { TransactionWithdrawDto } from './dto/transaction-widraw.dto';
import { TransactionTransferDto } from './dto/transaction-transfer.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.strategy';
import { Role } from '../guards/role.guard';
import { TransactionGuard } from '../guards/transaction.guard';
import { TransactionType } from '@prisma/client';

@Controller('transactions')
@ApiBearerAuth()
@ApiTags('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Role('USER')
  @UseGuards(JwtAuthGuard, RolesGuard, TransactionGuard)
  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money for an account' })
  @ApiCreatedResponse({
    description: 'The deposit record has been send successfully.',
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiBadRequestResponse({ description: 'The amount must be greater than 0' })
  deposit(@Body() dto: TransactionDepositDto) {
    return this.transactionsService.deposit(dto);
  }

  @Role('USER')
  @UseGuards(JwtAuthGuard, RolesGuard, TransactionGuard)
  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money' })
  @ApiCreatedResponse({
    description: 'The withdraw record has been send successfully.',
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiBadRequestResponse({ description: 'The amount must be greater than 0' })
  withdraw(@Body() dto: TransactionWithdrawDto) {
    return this.transactionsService.withdraw(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, TransactionGuard)
  @Role('USER')
  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money between accounts' })
  @ApiCreatedResponse({
    description: 'The transfer record has been send successfully.',
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiBadRequestResponse({ description: 'The amount must be greater than 0' })
  transfer(@Body() dto: TransactionTransferDto) {
    return this.transactionsService.transferance(dto);
  }

  @Role('USER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiOkResponse({ description: 'Get all transactions' })
  @ApiInternalServerErrorResponse({ description: 'Error finding transactions' })
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Role('USER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get account statement' })
  @ApiOkResponse({ description: 'Get all account statement' })
  @ApiInternalServerErrorResponse({ description: 'Error finding transactions' })
  @Get(':accountId/statement')
  getAccountStatement(
    @Param('accountId') accountId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const initalDate = new Date(startDate);
    const finalDate = new Date(endDate);
    const formatedAccountId = Number(accountId);
    return this.transactionsService.getAccountStatement(
      formatedAccountId,
      initalDate,
      finalDate,
    );
  }

  @Role('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get aggregated admin report' })
  @ApiOkResponse({ description: 'Get all aggregated report' })
  @ApiInternalServerErrorResponse({ description: 'Error finding transactions' })
  @Get('/report')
  @ApiQuery({ description: 'Initial date', name: 'startDate', required: true })
  @ApiQuery({ description: 'Final date', name: 'endDate', required: true })
  @ApiQuery({
    description: 'Type of report',
    name: 'type',
    required: false,
    enum: TransactionType,
  })
  getAggregatedReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('type') type?: string,
  ) {
    const initalDate = new Date(startDate);
    const finalDate = new Date(endDate);
    return this.transactionsService.getAggregatedReport(
      initalDate,
      finalDate,
      type,
    );
  }
}
