const userControl = require('./src/user-control.js');

const typeDefs = `#graphql
  type User {
    id: ID,
    email: String
  }

  type Query {
    hello: String,
    me: User
  }
`;

const resolvers = {

  Query: {
    hello: () => {return 'world'},
    me: (_, args, context) => {
        let id = context.session.getUid();
        if(id){
          return userControl.find(id);
        }
    },
  }
}


module.exports = {
    typeDefs,
    resolvers
};