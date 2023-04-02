import { CreatePeerDto } from '@core/domains/peers/services/create-peer.dto';
import { CreatePeerService } from '@core/domains/peers/services/create-peer.service';
import { DeleteAllPeersService } from '@core/domains/peers/services/delete-all-peers.service';
import { ListPaginatedPeersService } from '@core/domains/peers/services/list-paginated-peers.service';
import { PaginationQueryDto } from '@core/shared/dto/pagination-query.dto';
import { GlobalAppHttpException } from '@core/shared/errors/global-app-http-exception';
import { Body, Controller, Delete, ForbiddenException, Get, Post, Query } from '@nestjs/common';
import { configDto } from '../../../../config.dto';
import { GetPeersResponseDto } from './get-peers-response.dto';

@Controller('peers')
export class PeersRestController {
  constructor(
    private createPeerService: CreatePeerService,
    private listPaginatedPeersService: ListPaginatedPeersService,
    private deleteAllPeersService: DeleteAllPeersService
  ) {}

  @Post()
  async create(@Body() createPeerDto: CreatePeerDto) {
    try {
      const peer = await this.createPeerService.execute(createPeerDto);
      return peer;
    } catch (e) {
      throw new GlobalAppHttpException(e);
    }
  }

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<GetPeersResponseDto> {
    const peers = await this.listPaginatedPeersService.execute(paginationQuery);
    return { peers };
  }

  @Delete()
  async deleteAll() {
    // TODO: Require highest level of authorization
    if (configDto.applicationNodeEnv === 'development') {
      await this.deleteAllPeersService.execute();
      return null;
    }

    throw new ForbiddenException('This action is forbidden in production environment');
  }
}
