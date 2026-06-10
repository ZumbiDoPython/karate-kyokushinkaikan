/**
 * Login Firebase sem prompts do Gemini / telemetria (responde "n").
 * Abre o navegador para autenticação Google.
 */
const { configstore } = require('../node_modules/firebase-tools/lib/configstore');
const auth = require('../node_modules/firebase-tools/lib/auth');

configstore.set('gemini', false);
configstore.set('usage', false);

(async () => {
  try {
    const result = await auth.loginGoogle(true);
    auth.recordCredentials(result);
    const email = typeof result.user === 'string' ? result.user : result.user.email;
    console.log('Login OK:', email);
    process.exit(0);
  } catch (err) {
    console.error('Login falhou:', err.message || err);
    process.exit(1);
  }
})();
