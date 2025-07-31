import app from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`Started server with config: ${JSON.stringify(config, null, 2)}`);
});
