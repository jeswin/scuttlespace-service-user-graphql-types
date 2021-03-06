import * as codegen from "graphql-to-ts";
import { ITSEnum, ITSInterface } from "graphql-to-ts/dist/types";
import prettier = require("prettier");
import schema from "../src/schema";

function generateEnums(enums: ITSEnum[]) {
  return enums.map(
    e => `
    export enum ${e.name} {
      ${e.values.map(v => `${v}="${v}"`).join(",")}
    }
    `
  );
}

function generateInterfaces(interfaces: ITSInterface[]) {
  return interfaces
    .map(
      i => `
    export interface ${i.name} {
      ${i.fields
        .map(f => `${f.name}: ${codegen.typeToString(f.type)};`)
        .join("")}
    }
    `
    )
    .join("");
}

const types = codegen.getTypes(schema);

console.log(
  prettier.format(
    `
    ${generateEnums(types.enums)}
    ${generateInterfaces(
      types.interfaces.filter(x => !["IQuery", "IMutation"].includes(x.name))
    )}
    `,
    { parser: "typescript" }
  )
);
