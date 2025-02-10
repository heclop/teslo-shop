import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    ( data, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();

        console.log({req});
        // const user = req.user;

        // if( !user ) throw new InternalServerErrorException('User not found (request)')

        // if( data === 'email') return user.email;

        // console.log({ data })

        return req.rawHeaders;
    }
);