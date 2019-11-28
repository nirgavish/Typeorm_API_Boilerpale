import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { Repo } from '../../src/services/repo.service';

export async function List(req: Request, res: Response, Entity: any, filter?: any) {
    try {
        const response = await Repo(Entity).find(filter);
        res.status(HttpStatus.OK).json({
          data: response
        });
      } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({
          error: err
        });
      }
}

export async function GetById(req: Request, res: Response, Entity: any, filter?: any ) {
}

export async function Delete(req: Request, res: Response, Entity: any, filter?: any ) {
}

export async function Put(req: Request, res: Response, Entity: any, filter?: any ) {
}

export async function Post(req: Request, res: Response, Entity: any, filter?: any ) {
}