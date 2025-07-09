import swaggerJSDoc from "swagger-jsdoc";
import YAML from "yamljs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

const options = {
    swaggerDefinition: swaggerDocument,
    definition: '3.0.3',
    info: {
        title: 'Auth System',
        version: '1.0.0',
        description: 'Full Auth system with social login and default signup, and login',
    },
    servers: [
        { url: 'http://localhost:41431', description: 'Local Dev' },
        { url: 'https://auth-system.com', description: 'Production' },
    ],
    apis: [
        join(__dirname, '../routes/**/*.js'),
        join(__dirname, '../controllers/**/*.js'),
    ]
};

export default swaggerJSDoc(options);