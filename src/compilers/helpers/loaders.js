import styleLoader from './styles';
import { jsLoader, elmLoader, tsLoader, rustLoader } from './scripts';
import { objectRemoveEmpty } from '../../utils';

export default function createLoaders(isServer, babelEnv, config) {
    return objectRemoveEmpty({
        js: jsLoader(babelEnv, config),
        ts: config.useTypescript ? tsLoader() : '',
        elm: config.useElm ? elmLoader() : '',
        rust: config.useRust ? rustLoader() : '',
        styles: styleLoader(isServer, config)
    });
}

