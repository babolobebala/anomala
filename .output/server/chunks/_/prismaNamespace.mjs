import { c as client } from './prisma.mjs';

const PrismaClientKnownRequestError = client.PrismaClientKnownRequestError;
const sql = client.sqltag;
const empty = client.empty;
const join = client.join;
client.Extensions.getExtensionContext;
({
  DbNull: client.NullTypes.DbNull,
  JsonNull: client.NullTypes.JsonNull,
  AnyNull: client.NullTypes.AnyNull
});
client.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
client.Extensions.defineExtension;

export { PrismaClientKnownRequestError as P, empty as e, join as j, sql as s };
//# sourceMappingURL=prismaNamespace.mjs.map
