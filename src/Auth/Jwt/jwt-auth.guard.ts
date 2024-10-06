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
    const authHeaderTest = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmZkYjMzOTFjYzZkODk3ZTczNGJiZDEiLCJ1c2VybmFtZSI6ImJhdHVoYW4iLCJpYXQiOjE3MjgwMzI2MjMsImV4cCI6MTcyODAzNjIyM30.9i1fJr2pieIH4cafbjq-AtkLnccpAKtSaRHMSpftYwI";

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
