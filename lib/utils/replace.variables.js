/**
 * Replace the variable.
 * @see {@} @lib/context/VariableContext
 * @param {@} target
 * @param {*} contexts
 * @returns
 * @copyfrom https://github.com/gmsoft-happyCoding/stormrage/blob/master/lib/utils/replaceVars.js
 */
function replaceVariables(target, contexts) {
    let result = target;
    Object.keys(contexts).forEach((key, index) => {
        let value = contexts[key]
        result = result.replace(new RegExp(`\\$\\{\\s*${key}\\s*\\}`, "g"), value);
    })

    return result;
}

module.exports = {
    replaceVariables
}