import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    console.log(request);
    //const authHeaderTest = request.headers.authorization;
    //const authHeaderTest = request.headers['authorization'] || request.headers['Authorization'];
    //const authHeaderTest = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmNiNDBmZTNiMGYwMjI2N2FkODkxNzEiLCJlbWFpbCI6Im5ld3VzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MjQ1OTkzMzMsImV4cCI6MTcyNDYwMjkzM30.3sxmQrw94GuZwEvr9QrhpkQMOA-s9QyD4tnv1_4a-t0 ';
    const authHeaderTest = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmNiNDBmZTNiMGYwMjI2N2FkODkxNzEiLCJlbWFpbCI6Im5ld3VzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MjQ2MTM4MzYsImV4cCI6MTcyNDYxNzQzNn0.oy0yhHlNkrFbBa6Re-gTz7YN5piBdVv0_U5Xk9YUx0c ';

    if (!authHeaderTest) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const authHeader = Array.isArray(authHeaderTest) ? authHeaderTest[0] : authHeaderTest;
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
