import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role || 'artist';
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );

    if (!requiredRole) return true;

    // Check if the user has the required role or is an artist
    return userRole === requiredRole || userRole === 'user';
  }
}
