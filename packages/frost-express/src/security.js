import helmet from 'helmet';
import parameterProtection from 'hpp';
import uuid from 'uuid';

export default function createSecurity(server, { enableNonce = true }) {
  if (enableNonce) {
    server.use((req, res, next) => {
      res.locals.nonce = uuid();
      next();
    });
  }

  // Don't expose software infomation
  server.disable('x-powered-by');

  // Prevent HTTP Parameter pollution
  server.use(parameterProtection());

  // Sets X-XSS-Protection header to prevent reflected XSS attacks
  server.use(helmet.xssFilter());

  // Mitigates clickjacking attacks by setting the X-Frame-Options header
  server.use(helmet.frameguard('deny'));

  server.use(helmet.ieNoOpen());
  server.use(helmet.noSniff());
}
