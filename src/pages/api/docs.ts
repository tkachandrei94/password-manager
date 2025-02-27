import { NextApiRequest, NextApiResponse } from 'next';
import SwaggerUI from 'swagger-ui-express';
import swaggerSpec from '../../../swagger.yaml'; // Шлях до swagger.yaml

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const swaggerUiHandler = SwaggerUI.setup(swaggerSpec, {
    customCssUrl: '/swagger-ui/swagger-ui.css',
    customJs: [
      '/swagger-ui/swagger-ui-bundle.js',
      '/swagger-ui/swagger-ui-standalone-preset.js',
    ],
  });
  swaggerUiHandler(req as any, res as any, () => {});
} 