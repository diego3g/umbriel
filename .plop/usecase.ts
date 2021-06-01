import { NodePlopAPI } from 'plop';
import { readdirSync } from 'fs';
import path from 'path'

const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

export default function (plop: NodePlopAPI) {
  plop.setGenerator('usecase', {
    description: 'Base Use Case with API Route',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Name',
      },
      {
        type: 'list',
        name: 'module',
        message: 'Module',
        choices: getDirectories(path.resolve(__dirname, '../src/modules'))
      },
      {
        type: 'confirm',
        name: 'shouldIncludeController',
        message: 'Include HTTP controller?',
        default: true,
      },
      {
        type: 'list',
        name: 'httpMethod',
        message: 'HTTP method',
        choices: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        default: 'GET',
        when: (answers) => {
          return answers.shouldIncludeController
        }
      },
      {
        type: 'input',
        name: 'httpPath',
        message: 'HTTP route path',
        when: (answers) => {
          return answers.shouldIncludeController
        }
      }
    ],
    actions: (answers) => {
      const actions = [
        {
          type: 'add',
          path: '../src/modules/{{module}}/useCases/{{pascalCase name}}/{{pascalCase name}}.ts',
          templateFile: 'templates/useCase.ts.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: '../src/modules/{{module}}/useCases/{{pascalCase name}}/{{pascalCase name}}.spec.ts',
          templateFile: 'templates/useCase.spec.ts.hbs',
          skipIfExists: true,
        },
      ]

      if (answers.shouldIncludeController) {
        actions.push({
          type: 'add',
          path: '../src/modules/{{module}}/useCases/{{pascalCase name}}/{{pascalCase name}}Controller.ts',
          templateFile: 'templates/useCaseController.ts.hbs',
          skipIfExists: true,
        })

        actions.push({
          type: 'add',
          path: '../src/modules/{{module}}/useCases/{{pascalCase name}}/{{pascalCase name}}Controller.spec.ts',
          templateFile: 'templates/useCaseController.spec.ts.hbs',
          skipIfExists: true,
        })

        actions.push({
          type: 'add',
          path: '../src/infra/http/factories/controllers/{{ pascalCase name }}ControllerFactory.ts',
          templateFile: 'templates/controllerFactory.ts.hbs',
          skipIfExists: true,
        })
      }

      return actions;
    },
  });
};
