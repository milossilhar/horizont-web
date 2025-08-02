/**
 * This file initializes Supertokens roles and admin account from environment.
 */
import supertokens from 'supertokens-node';
import UserRoles from "supertokens-node/recipe/userroles";

import { superConfig } from './supertokens';
import { list } from 'postcss';

supertokens.init(superConfig);

async function createRole(name: string, permissions: string[] = []) {
  const response = await UserRoles.createNewRoleOrAddPermissions(name, permissions);
  if (!response.createdNewRole) {
    console.log(`Role ${name} already exists. Added permissions ${JSON.stringify(permissions)}`);
  } else {
    console.log(`Created role ${name} with permissions ${JSON.stringify(permissions)}`);
  }
}

async function listRoles() {
  const roles = await UserRoles.getAllRoles();
  console.log(`Found roles: ${JSON.stringify(roles)}`);
}

async function main() {
  await createRole('USER');
  await createRole('ADMIN');
  await listRoles();
}

main();