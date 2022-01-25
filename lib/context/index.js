/**
 * Variable context.
 */
 class VariableContext {
    constructor() {

    }
}

/**
 * Variable.
 */
class Variable {
    constructor(key, value) {
        this.key = key
        this.value = value
    }
}

module.exports = {
    VariableContext,
    Variable
}