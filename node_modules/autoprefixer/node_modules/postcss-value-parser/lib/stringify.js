function stringifyNode(node) {
    var type = node.type;
    var value = node.value;
    var buf;

    if (type === 'word' || type === 'space') {
        return value;
    } else if (type === 'string') {
        buf = node.quote || '';
        return buf + value + (node.unclosed ? '' : buf);
    } else if (type === 'comment') {
        return '/*' + value + (node.unclosed ? '' : '*/');
    } else if (type === 'div') {
        return (node.before || '') + value + (node.after || '');
    } else if (Array.isArray(node.nodes)) {
        buf = stringify(node.nodes);
        if (type !== 'function') {
            return buf;
        }
        return value + '(' + (node.before || '') + buf + (node.after || '') + (node.unclosed ? '' : ')');
    }
    return value;
}

function stringify(nodes) {
    var result, i;

    if (Array.isArray(nodes)) {
        result = '';
        for (var i = nodes.length - 1; ~i; i -= 1) {
            result = stringifyNode(nodes[i]) + result;
        }
        return result;
    }
    return stringifyNode(nodes);
};

module.exports = stringify;
