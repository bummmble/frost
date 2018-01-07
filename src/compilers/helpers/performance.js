import { isObject, isFunction } from '../../utils';

export default function createPerformance(isDev, isServer, { webpack }) {
    const isPerformanceFunction = isFunction(webpack.performance);
    if (isPerformanceFunction || isObject(webpack.performance)) {
        const performance = isPerformanceFunction
            ? webpack.performance(isDev, isServer)
            : webpack.performance;
        return performance;
    }
    return false;
}
