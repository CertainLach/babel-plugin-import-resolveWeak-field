export default function(babel) {
    const {
        types: t
    } = babel;

    return {
        name: "ast-transform",
        visitor: {
            CallExpression(path) {
                if (path.node.callee.type === 'Import' && !path.node.callee.processed) {
                    // Clear original import string
                    let originalArguments = path.node.arguments;
                    path.node.arguments = [];
                    path.node.callee = {
                        type: 'ArrowFunctionExpression',
                        id: null,
                        generator: false,
                        async: false,
                        params: [],
                        body: {
                            type: 'BlockStatement',
                            body: [{
                                    type: 'VariableDeclaration',
                                    declarations: [{
                                        type: 'VariableDeclarator',
                                        id: {
                                            type: 'Identifier',
                                            name: '__importPromise'
                                        },
                                        init: {
                                            type: 'CallExpression',
                                            callee: {
                                                type: 'Import',
                                                processed: true
                                            },
                                            arguments: originalArguments
                                        }
                                    }],
                                    kind: 'const'
                                }, {
                                    type: 'ExpressionStatement',
                                    expression: {
                                        type: 'AssignmentExpression',
                                        operator: '=',
                                        left: {
                                            type: "MemberExpression",
                                            object: {
                                                type: "Identifier",
                                                name: "__importPromise"
                                            },
                                            property: {
                                                type: "Identifier",
                                                name: "__internal_import_file"
                                            },
                                            computed: false
                                        },
                                        right: {
                                            type: 'CallExpression',
                                            callee: {
                                                type: 'MemberExpression',
                                                object: {
                                                    type: 'Identifier',
                                                    name: 'require'
                                                },
                                                property: {
                                                    type: 'Identifier',
                                                    name: 'resolveWeak'
                                                },
                                                computed: false
                                            },
                                            arguments: [originalArguments[0]]
                                        }
                                    }
                                },
                                {
                                    type: 'ReturnStatement',
                                    argument: {
                                        type: 'Identifier',
                                        name: '__importPromise'
                                    }
                                }
                            ]
                        }
                    };
                };
            }
        }
    };
}
