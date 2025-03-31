import OryxServer from '@core/system/server';
import { Server } from 'socket.io';
import { socketCors } from '@app/config/cors';

export default class OryxSocket {
    public static io: Server = new Server(OryxServer.server, {
        cors: socketCors,
    });
}
