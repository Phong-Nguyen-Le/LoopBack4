import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Agency,
} from '../models';
import {UserRepository} from '../repositories';

export class UserAgencyController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/agency', {
    responses: {
      '200': {
        description: 'User has one Agency',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Agency),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Agency>,
  ): Promise<Agency> {
    return this.userRepository.agency(id).get(filter);
  }

  @post('/users/{id}/agency', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Agency)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agency, {
            title: 'NewAgencyInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) agency: Omit<Agency, 'id'>,
  ): Promise<Agency> {
    return this.userRepository.agency(id).create(agency);
  }

  @patch('/users/{id}/agency', {
    responses: {
      '200': {
        description: 'User.Agency PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agency, {partial: true}),
        },
      },
    })
    agency: Partial<Agency>,
    @param.query.object('where', getWhereSchemaFor(Agency)) where?: Where<Agency>,
  ): Promise<Count> {
    return this.userRepository.agency(id).patch(agency, where);
  }

  @del('/users/{id}/agency', {
    responses: {
      '200': {
        description: 'User.Agency DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Agency)) where?: Where<Agency>,
  ): Promise<Count> {
    return this.userRepository.agency(id).delete(where);
  }
}
