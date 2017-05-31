import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import UUID from 'pure-uuid';
import * as GraphQL from 'graphql';
import * as GraphQLTools from 'graphql-tools';
import GraphQLToolsSequelize from 'graphql-tools-sequelize';
import GraphQLToolsTypes from 'graphql-tools-types';
import Sequelize from 'sequelize';


// import schema from './schema';
const PORT = 3000;
const server = express();

(async function srv() {
  /*  establish database connection  */
  const db = new Sequelize('./sample.db', '', '', {
    dialect: 'sqlite',
    host: '',
    port: '',
    storage: './sample.db',
    define: { freezeTableName: true, timestamps: false },
    logging: (msg) => { console.log(`Sequelize: ${msg}`); },
  });
  await db.authenticate();

  /*  define database schema  */
  const dm = {};
  dm.OrgUnit = db.define('OrgUnit', {
    id: { type: Sequelize.UUID, primaryKey: true },
    initials: { type: Sequelize.STRING(3), allowNull: false },
    name: { type: Sequelize.STRING(100), allowNull: false },
  });
  dm.Person = db.define('Person', {
    id: { type: Sequelize.UUID, primaryKey: true },
    initials: { type: Sequelize.STRING(3), allowNull: false },
    name: { type: Sequelize.STRING(100), allowNull: false },
  });
  dm.OrgUnit.belongsTo(dm.OrgUnit, {
    as: 'parentUnit',
    foreignKey: 'parentUnitId',
  });
  dm.Person.belongsTo(dm.Person, {
    as: 'supervisor',
    foreignKey: 'personId',
  });
  dm.Person.belongsTo(dm.OrgUnit, {
    as: 'belongsTo',
    foreignKey: 'orgUnitId',
  });
  dm.OrgUnit.hasMany(dm.Person, {
    as: 'members',
    foreignKey: 'orgUnitId',
  });
  dm.OrgUnit.hasOne(dm.Person, {
    as: 'director',
    foreignKey: 'directorId',
  });

  /*  on-the-fly (re-)create database schema  */
  await db.sync({ force: true });

  /*  fill database initially  */
  const uuid = () => (new UUID(1)).format();
  const uMSG = await dm.OrgUnit.create({ id: uuid(), initials: 'msg', name: 'msg systems ag' });
  const uXT = await dm.OrgUnit.create({ id: uuid(), initials: 'XT', name: 'msg Applied Technology Research (XT)' });
  const uXIS = await dm.OrgUnit.create({ id: uuid(), initials: 'XIS', name: 'msg Information Security (XIS)' });
  const pHZ = await dm.Person.create({ id: uuid(), initials: 'HZ', name: 'Hans Zehetmaier' });
  const pJS = await dm.Person.create({ id: uuid(), initials: 'JS', name: 'Jens Stäcker' });
  const pRSE = await dm.Person.create({ id: uuid(), initials: 'RSE', name: 'Ralf S. Engelschall' });
  const pBEN = await dm.Person.create({ id: uuid(), initials: 'BEN', name: 'Bernd Endras' });
  const pCGU = await dm.Person.create({ id: uuid(), initials: 'CGU', name: 'Carol Gutzeit' });
  const pMWS = await dm.Person.create({ id: uuid(), initials: 'MWS', name: 'Mark-W. Schmidt' });
  const pBWE = await dm.Person.create({ id: uuid(), initials: 'BWE', name: 'Bernhard Weber' });
  const pFST = await dm.Person.create({ id: uuid(), initials: 'FST', name: 'Florian Stahl' });
  await uMSG.setDirector(pHZ);
  await uMSG.setMembers([pHZ, pJS]);
  await uXT.setDirector(pRSE);
  await uXT.setMembers([pRSE, pBEN, pCGU]);
  await uXT.setParentUnit(uMSG);
  await uXIS.setDirector(pMWS);
  await uXIS.setMembers([pMWS, pBWE, pFST]);
  await uXIS.setParentUnit(uMSG);
  await pJS.setSupervisor(pHZ);
  await pRSE.setSupervisor(pJS);
  await pBEN.setSupervisor(pRSE);
  await pCGU.setSupervisor(pRSE);
  await pMWS.setSupervisor(pJS);
  await pBWE.setSupervisor(pMWS);
  await pFST.setSupervisor(pMWS);

  /*  establish GraphQL to Sequelize mapping  */
  const validator = async (/* type, obj */) => true;
  const authorizer = async (/* moment, op, type, obj, ctx */) => true;
  const gts = new GraphQLToolsSequelize(db, {
    validator,
    authorizer,
    tracer: async (type, oid, obj, op, via, onto /* , ctx */) => {
      console.log(`trace: type=${type} oid=${oid || 'none'} op=${op} via=${via} onto=${onto}`);
    },
    fts: {
      OrgUnit: ['name'],
      Person: ['name'],
    },
  });
  await gts.boot();

  /*  the GraphQL schema definition  */
  const definition = `
        schema {
            query:    Root
            mutation: Root
        }
        scalar UUID
        scalar JSON
        type Root {
            ${gts.entityQuerySchema('Root', '', 'OrgUnit')}
            ${gts.entityQuerySchema('Root', '', 'OrgUnit*')}
            ${gts.entityQuerySchema('Root', '', 'Person')}
            ${gts.entityQuerySchema('Root', '', 'Person*')}
        }
        type OrgUnit {
            id: UUID!
            initials: String
            name: String
            director: Person
            members: [Person]!
            parentUnit: OrgUnit
            ${gts.entityCloneSchema('OrgUnit')}
            ${gts.entityCreateSchema('OrgUnit')}
            ${gts.entityUpdateSchema('OrgUnit')}
            ${gts.entityDeleteSchema('OrgUnit')}
        }
        type Person {
            id: UUID!
            initials: String
            name: String
            belongsTo: OrgUnit
            supervisor: Person
            ${gts.entityCloneSchema('Person')}
            ${gts.entityCreateSchema('Person')}
            ${gts.entityUpdateSchema('Person')}
            ${gts.entityDeleteSchema('Person')}
        }
    `;

  /*  the GraphQL schema resolvers  */
  const resolvers = {
    UUID: GraphQLToolsTypes.UUID({ name: 'UUID', storage: 'string' }),
    JSON: GraphQLToolsTypes.JSON({ name: 'JSON' }),
    Root: {
      OrgUnit: gts.entityQueryResolver('Root', '', 'OrgUnit'),
      OrgUnits: gts.entityQueryResolver('Root', '', 'OrgUnit*'),
      Person: gts.entityQueryResolver('Root', '', 'Person'),
      Persons: gts.entityQueryResolver('Root', '', 'Person*'),
    },
    OrgUnit: {
      director: gts.entityQueryResolver('OrgUnit', 'director', 'Person'),
      members: gts.entityQueryResolver('OrgUnit', 'members', 'Person*'),
      parentUnit: gts.entityQueryResolver('OrgUnit', 'parentUnit', 'OrgUnit'),
      clone: gts.entityCloneResolver('OrgUnit'),
      create: gts.entityCreateResolver('OrgUnit'),
      update: gts.entityUpdateResolver('OrgUnit'),
      delete: gts.entityDeleteResolver('OrgUnit'),
    },
    Person: {
      belongsTo: gts.entityQueryResolver('Person', 'belongsTo', 'OrgUnit'),
      supervisor: gts.entityQueryResolver('Person', 'supervisor', 'Person'),
      clone: gts.entityCloneResolver('Person'),
      create: gts.entityCreateResolver('Person'),
      update: gts.entityUpdateResolver('Person'),
      delete: gts.entityDeleteResolver('Person'),
    },
  };

  /*  generate executable GraphQL schema  */
  const schema = GraphQLTools.makeExecutableSchema({
    typeDefs: [definition],
    resolvers,
    allowUndefinedInResolve: false,
    resolverValidationOptions: {
      requireResolversForArgs: true,
      requireResolversForNonScalar: true,
      requireResolversForAllFields: false,
    },
  });


  server.use('/graphql', bodyParser.json(), graphqlExpress(() => ({
    schema,
    // rootValue,
    // context: context(request.headers, process.env),
  })));

  server.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    query: `# Welcome to GraphiQL

{
  OrgUnits{
    name
  }
}`,
  }));

  server.listen(PORT, () => {
    console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`); // eslint-disable-line
    console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`); // eslint-disable-line
  });
}()).catch((ex) => {
  console.log(`ERROR: ${ex}`); // eslint-disable-line
});
