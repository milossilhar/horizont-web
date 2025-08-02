import {TypeInput} from 'supertokens-node/types';
import {config} from './config';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';
import Dashboard from 'supertokens-node/recipe/dashboard';
import Session from 'supertokens-node/recipe/session';

export const superConfig: TypeInput = {
  framework: 'express',
  supertokens: {
    connectionURI: config.supertokens.uri
  },
  appInfo: {
    appName: 'Horizont',
    apiDomain: config.hostname,
    websiteDomain: config.hostname,
    apiBasePath: '/supertokens',
    websiteBasePath: '/auth'
  },
  recipeList: [
    EmailPassword.init({
      signUpFeature: {
        formFields: [
          { id: 'name' },
          { id: 'surname' },
          { id: 'birthdate' }
        ]
      },
      override: {
        functions: (originalImplementation) => {
          return {
            ...originalImplementation,
            signUp: async (input) => {
              // First, we call the original implementation of signUp.
              const response = await originalImplementation.signUp(input);

              // Post sign-up response, we check if it was successful
              if (response.status === "OK" && response.user.loginMethods.length === 1 && input.session === undefined) {
                await UserRoles.addRoleToUser('public', response.user.id, 'USER');
              }
              return response;
            }
          }
        }
      }
    }),
    UserRoles.init(),
    Dashboard.init(),
    Session.init()
  ]
};