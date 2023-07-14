import dotenv from 'dotenv'
dotenv.config()

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import {resolvers, typeDefs} from './resolvers.js';
import session from './src/session.js';
import cookieParser from 'cookie-parser';

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});
await server.start();

function onLogin(req, res, next){
  
  let success = false;

  if(req.originalUrl === '/login'){
    let body = req.body;

    if(body && body.login && body.password){
      var sessionObj = new session();
      if(sessionObj.login(body.login, body.password)){
        res.cookie('uid', sessionObj.getUidToken() || '', { maxAge: sessionObj.getCookieExpireDays() * 24*3600*1000, httpOnly: true, secure: true, sameSite: 'none' });
        success = true;
      }
    }
  }
  else if(req.originalUrl === '/logout'){
    var sessionObj = new session();
    res.cookie('uid', '', { expires: new Date(Date.now() - 900000), httpOnly: true, secure: true, sameSite: 'none' });
    success = true;
  }

  if(success){
    res.send(JSON.stringify({success: success}));
  }else{
    next();
  }
}

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:4000'], 
    credentials: true,
  }),
  bodyParser.json(),
  cookieParser(),
  onLogin,
  expressMiddleware(server, {
      context: ({ req, res }) => {
        var sessionObj = new session();
        if(req.cookies && req.cookies.uid){
          sessionObj.loginToken(req.cookies.uid);
        }
        
        return {session: sessionObj};
      }
  })
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000`);