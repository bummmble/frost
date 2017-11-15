import reactTreeWalker from 'react-tree-walker';

export default function deepFetch(el) {
    function visitor(element, instance, context) {
        if (instance && typeof instance.fetchData === 'function') {
            return instance.fetchData();
        }
        return true;
    }

    return reactTreeWalker(el, visitor);
}
