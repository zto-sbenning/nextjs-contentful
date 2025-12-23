# LIB: LOGGER

**English version:** [README.md](README.md)

## Aperçu
Ces utilitaires centralisent la journalisation dans tout le projet. Ils doivent remplacer les appels `console` qui doivent rester dans le code. N'hésitez pas à utiliser `console.log` pendant le débogage, mais ne le commettez jamais. Si vous avez besoin de logs persistants, utilisez plutôt l'un des loggers ci-dessous.

## Sommaire
- [Configuration](#configuration)
- [serverLogger](#serverlogger)
- [clientLogger](#clientlogger)

## Configuration
Les deux loggers produisent des messages au format :

```
YYYY-MM-DD HH:mm:ss,SSS LEVEL [context]: message {metadata}
```

Le champ `context` dans les métadonnées permet de grouper les logs. Utilisé avec `serverLogger`, il crée un fichier dédié dans `logs/` nommé `<context>-YYYY-MM-DD.log`. Les fichiers tournants sont conservés pendant sept jours.

## serverLogger
`serverLogger` est un logger basé sur Winston pour **le code serveur uniquement**. Il écrit dans la console et dans des fichiers quotidiens lorsque le contexte est fourni. Utilisez-le dans les composants serveur, les routes API ou les Server Actions, jamais dans le code client.

```ts
import serverLogger from '@/lib/logger/serverLogger';

// message informatif simple
serverLogger.info('Notification service started');

// avertissement avec métadonnées
serverLogger.warn('Redis cache unavailable', { service: 'cache' });

// message de debug (visible uniquement en développement)
serverLogger.debug('Data received from API', { payload });

// erreur avec trace
try {
    await doSomething();
} catch (error) {
    serverLogger.error('Operation failed', { context: 'something', error });
}
```

## clientLogger
`clientLogger` offre la même interface pour le code navigateur. Il n'écrit jamais de fichiers et respecte le `LOG_LEVEL` disponible sur `window`. Utilisez-le dans les composants React ou autres scripts côté client. Exemple dans un hook React :

```tsx
import { useEffect } from 'react';
import clientLogger from '@/lib/logger/clientLogger';

export default function MyComponent() {
    useEffect(() => {
        clientLogger.info('component mounted', { context: 'ui' });
    }, []);
    return <div />;
}
```

