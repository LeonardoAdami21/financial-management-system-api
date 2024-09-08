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
  ApiTags,
} from '@nestjs/swagger';
import { TransactionDepositDto } from './dto/transaction-deposit.dto';
import { TransactionWithdrawDto } from './dto/transaction-widraw.dto';
import { TransactionTransferDto } from './dto/transaction-transfer.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.strategy';
import { Role } from '../guards/role.guard';
import { TransactionGuard } from '../guards/transaction.guard';

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

  @Role('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get account statement' })
  @ApiOkResponse({ description: 'Get all account statement' })
  @ApiInternalServerErrorResponse({ description: 'Error finding transactions' })
  @Get(':id/statement')
  getAccountStatement(
    @Param('accountId') accountId: number,
    @Param('startDate') startDate: Date,
    @Param('endDate') endDate: Date,
  ) {
    const initalDate = new Date(startDate);
    const finalDate = new Date(endDate);
    return this.transactionsService.getAccountStatement(
      +accountId,
      initalDate,
      finalDate,
    );
  }

  @Role('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get aggregated report' })
  @ApiOkResponse({ description: 'Get all aggregated report' })
  @ApiInternalServerErrorResponse({ description: 'Error finding transactions' })
  @Get(':id/report')
  getAggregatedReport(
    @Param('startDate') startDate: Date,
    @Param('endDate') endDate: Date,
    @Param('type') type?: string,
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
