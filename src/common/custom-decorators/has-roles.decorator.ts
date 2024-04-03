// This is the custom decorator for roles

import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/role.enum';
export const HasRoles = (...roles: Role[]) => SetMetadata('roles', roles);