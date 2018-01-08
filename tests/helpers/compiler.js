export const getPluginNames = plugins => plugins.map(plugin => plugin.constructor.name);
export const getLoaders = (rules, happypack) => rules.map(rule => {
    if (happypack) {
        return rule.use;
    }
    return rule.use[0].loader;
});
