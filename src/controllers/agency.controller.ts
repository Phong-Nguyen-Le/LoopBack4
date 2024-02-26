import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Agency} from '../models';
import {AgencyRepository, UserRepository} from '../repositories';

export class AgencyController {
  constructor(
    @repository(AgencyRepository)
    public agencyRepository : AgencyRepository,
    @repository(UserRepository)
    public userRepository : UserRepository,
    @inject(SecurityBindings.USER) private userProfile: UserProfile,
  ) {}

  @authenticate('jwt')
  @post('/agencies/create')
  @response(200, {
    description: 'Agency model instance',
    content: {'application/json': {schema: getModelSchemaRef(Agency)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agency, {
            title: 'NewAgency',
          }),
        },
      },
    })
    agency: Agency,
  ): Promise<any> {
    const user = await this.userRepository.findById(this.userProfile.id)
    if(user.role !== 'ADMIN')  throw new HttpErrors.Forbidden(`You don't have permission`);

    return this.agencyRepository.create(agency);
  }

  @authenticate('jwt')
  @patch('/agencies/update')
  @response(200, {
    description: 'Agency model instance',
    content: {'application/json': {schema: getModelSchemaRef(Agency)}},
  })
  async update(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agency, {
            title: 'NewAgency',
          }),
        },
      },
    })
    agency: Agency & {id: string},
  ): Promise<any> {
    const user = await this.userRepository.findById(this.userProfile.id)
    if(user.role !== 'ADMIN')  throw new HttpErrors.Forbidden(`You don't have permission`);

    if (!agency?.id) {
      throw new HttpErrors.BadRequest('Agency ID is required');
    }

    const agencyFound = await this.agencyRepository.findById(agency?.id)
    if(!agencyFound)  throw new HttpErrors.Forbidden(`Not found agency`);

    return this.agencyRepository.updateById(agency.id, agency);
  }

  @authenticate('jwt')
  @get('/agencies')
  @response(200, {
    description: 'Array of Agency model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Agency, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Agency) filter?: Filter<Agency>,
  ): Promise<Agency[]> {
    return this.agencyRepository.find(filter);
  }

  @authenticate('jwt')
  @get('/agencies/{id}')
  @response(200, {
    description: 'Agency model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Agency, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Agency, {exclude: 'where'}) filter?: FilterExcludingWhere<Agency>
  ): Promise<Agency> {
    return this.agencyRepository.findById(id, {include: [{relation: 'user'}]});
  }

  @patch('/agencies/{id}')
  @response(204, {
    description: 'Agency PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agency, {partial: true}),
        },
      },
    })
    agency: Agency,
  ): Promise<void> {
    await this.agencyRepository.updateById(id, agency);
  }

  @authenticate('jwt')
  @put('/agencies/{id}')
  @response(204, {
    description: 'Agency PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() agency: Agency,
  ): Promise<void> {
    await this.agencyRepository.replaceById(id, agency);
  }

  @authenticate('jwt')
  @del('/agencies/{id}')
  @response(204, {
    description: 'Agency DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.agencyRepository.deleteById(id);
  }
}
