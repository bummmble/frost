import HappyPack from 'happypack';

const threadPool = HappyPack.ThreadPool({
    size: 5
});

export function createHappyPlugin(loaders) {
    return Object.keys(loaders).map(loader => new HappyPack({
        id: loader,
        loaders: loaders[loader],
        threadPool
    }));
}
