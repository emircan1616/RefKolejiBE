import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    //console.log(request);
    //const authHeaderTest = request.headers.authorization;
    //const authHeaderTest = request.headers['authorization'] || request.headers['Authorization'];
    const authHeaderTest = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmU4OWRiMGJiMmJhMDBjZjE3YjE5ZWYiLCJlbWFpbCI6Im5ld3VzZXJlbWlyY2FuQGV4YW1wbGUuY29tIiwiaWF0IjoxNzI2NTY0NTEzLCJleHAiOjE3MjY1NjgxMTN9.FvIpr1iKzWF86qmi7CzFrhFJYX_T-5N2HynMSAk5U3c";

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
