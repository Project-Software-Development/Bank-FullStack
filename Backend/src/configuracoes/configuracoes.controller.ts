import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ConfiguracoesService } from './configuracoes.service';
import { AlterarStatusUsuarioDto } from './dto/alterar-status-usuario.dto';
import {
  ConfiguracoesUsuarioDto,
  ListarUsuariosResponseDto,
} from './dto/configuracoes-usuario-response.dto';
import { ListarUsuariosQueryDto } from './dto/listar-usuarios-query.dto';

@ApiTags('Configuracoes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMINISTRADOR)
@Controller('configuracoes')
export class ConfiguracoesController {
  constructor(private readonly configuracoesService: ConfiguracoesService) {}

  @Get('usuarios')
  @ApiOperation({
    summary: 'Lista usuarios para a gestao administrativa.',
  })
  @ApiQuery({
    name: 'busca',
    required: false,
    description: 'Busca por nome, e-mail ou CPF.',
    example: 'maria',
  })
  @ApiQuery({
    name: 'tipo',
    required: false,
    enum: Role,
    description: 'Filtra usuarios pelo tipo de perfil.',
  })
  @ApiQuery({
    name: 'statusConta',
    required: false,
    enum: ['ATIVO', 'BLOQUEADO', 'INATIVO'],
    description: 'Filtra usuarios pelo status da conta.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Pagina desejada.',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade de usuarios por pagina.',
    example: 10,
  })
  @ApiOkResponse({
    description: 'Usuarios retornados com sucesso.',
    type: ListarUsuariosResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Filtros ou parametros de paginacao invalidos.',
  })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  @ApiForbiddenResponse({
    description: 'Usuario sem permissao administrativa para este recurso.',
  })
  listarUsuarios(
    @Query() query: ListarUsuariosQueryDto,
  ): Promise<ListarUsuariosResponseDto> {
    return this.configuracoesService.listarUsuarios(query);
  }

  @Get('usuarios/:id')
  @ApiOperation({
    summary: 'Retorna detalhes de um usuario para a gestao administrativa.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuario.',
    example: '0f13db49-44a9-4cc8-b90f-5655489263aa',
  })
  @ApiOkResponse({
    description: 'Usuario retornado com sucesso.',
    type: ConfiguracoesUsuarioDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  @ApiForbiddenResponse({
    description: 'Usuario sem permissao administrativa para este recurso.',
  })
  @ApiNotFoundResponse({ description: 'Usuario nao encontrado.' })
  buscarUsuarioPorId(@Param('id') id: string): Promise<ConfiguracoesUsuarioDto> {
    return this.configuracoesService.buscarUsuarioPorId(id);
  }

  @Patch('usuarios/:id/status')
  @ApiOperation({
    summary: 'Altera o status administrativo de um usuario.',
    description:
      'Quando existir conta vinculada, o status da conta tambem sera atualizado para ATIVA, BLOQUEADA ou INATIVA conforme o novo status do usuario.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuario.',
    example: '0f13db49-44a9-4cc8-b90f-5655489263aa',
  })
  @ApiOkResponse({
    description: 'Status do usuario atualizado com sucesso.',
    type: ConfiguracoesUsuarioDto,
  })
  @ApiBadRequestResponse({
    description: 'Body invalido. Use statusConta ATIVO, BLOQUEADO ou INATIVO.',
  })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  @ApiForbiddenResponse({
    description: 'Usuario sem permissao administrativa para este recurso.',
  })
  @ApiNotFoundResponse({ description: 'Usuario nao encontrado.' })
  alterarStatusUsuario(
    @Param('id') id: string,
    @Body() alterarStatusUsuarioDto: AlterarStatusUsuarioDto,
  ): Promise<ConfiguracoesUsuarioDto> {
    return this.configuracoesService.alterarStatusUsuario(
      id,
      alterarStatusUsuarioDto,
    );
  }
}
