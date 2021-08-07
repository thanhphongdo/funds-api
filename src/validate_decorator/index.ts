import { ValidationSchema, registerSchema, validate } from 'class-validator';
export let validatorSchema: { [key: string]: ValidationSchema } = {};
function checkInit(target: any, key: any) {
    const schemaName = target.constructor.name;
    if (!validatorSchema[schemaName]) {
        const baseClassName = Object.getPrototypeOf(target.constructor).name;
        if (baseClassName && validatorSchema[baseClassName]) {
            validatorSchema[schemaName] = JSON.parse(JSON.stringify(validatorSchema[baseClassName]));
            validatorSchema[schemaName].properties[key] = [];
            validatorSchema[schemaName].name = schemaName;
        } else {
            validatorSchema[schemaName] = {
                name: schemaName,
                properties: {
                    [key]: []
                }
            }
        }
    }
}
export const Validator = {
    registerSchema(name: string) {
        if (validatorSchema[name]) {
            registerSchema(validatorSchema[name]);
        }
    },
    extendRegisterSchema(name: string, baseName: string) {
        if (validatorSchema[baseName]) {
            validatorSchema[name] = JSON.parse(JSON.stringify(validatorSchema[baseName]));
            validatorSchema[name].name = name;
        }
    },
    async validate(schemaName: string, obj: any) {
        return await validate(schemaName, obj);
    },
    isDefined(constraints?: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isDefined',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isOptional(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isOptional',
                    message: message
                }
            ]
        }
        return decorator;
    },
    equals(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'equals',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    notEquals(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'notEquals',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isEmpty(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isEmpty',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isNotEmpty(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isNotEmpty',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isIn(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isIn',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isNotIn(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isNotIn',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isBoolean(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isBoolean',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isDate(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isDate',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isString(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isString',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isNumber(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isNumber',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isInt(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isInt',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isArray(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isArray',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isEnum(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isEnum',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isDivisibleBy(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isDivisibleBy',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isPositive(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isPositive',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isNegative(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isNegative',
                    message: message
                }
            ]
        }
        return decorator;
    },
    min(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'min',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    max(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'max',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    minDate(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'minDate',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    maxDate(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'maxDate',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isBooleanString(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isBooleanString',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isDateString(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isDateString',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isNumberString(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isNumberString',
                    message: message
                }
            ]
        }
        return decorator;
    },
    contains(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'contains',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    notContains(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'notContains',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isAlpha(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isAlpha',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isAlphanumeric(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isAlphanumeric',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isDecimal(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isDecimal',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isAscii(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isAscii',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isBase64(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isBase64',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isByteLength(constraints?: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isByteLength',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isCreditCard(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isCreditCard',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isCurrency(constraints?: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isCurrency',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isEmail(constraints?: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isEmail',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isFQDN(constraints?: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isFQDN',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isFullWidth(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isFullWidth',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isHalfWidth(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isHalfWidth',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isVariableWidth(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isVariableWidth',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isHexColor(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isHexColor',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isHexadecimal(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isHexadecimal',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isMACAddress(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isMACAddress',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isIP(constraints?: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isIP',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isPort(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isPort',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isISBN(constraints?: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isISBN',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isISIN(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isISIN',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isISO8601(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isISO8601',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isJSON(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isJSON',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isJWT(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isJWT',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isObject(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isObject',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isNotEmptyObject(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isNotEmptyObject',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isLowercase(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isLowercase',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isLatLong(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isLatLong',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isLatitude(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isLatitude',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isLongitude(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isLongitude',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isMobilePhone(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isMobilePhone',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isISO31661Alpha2(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isISO31661Alpha2',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isISO31661Alpha3(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isISO31661Alpha3',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isPhoneNumber(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isPhoneNumber',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isMongoId(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isMongoId',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isMultibyte(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isMultibyte',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isSurrogatePair(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isSurrogatePair',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isUrl(constraints?: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isUrl',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isUUID(constraints?: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isUUID',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isUppercase(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isUppercase',
                    message: message
                }
            ]
        }
        return decorator;
    },
    length(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'length',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    minLength(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'minLength',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    maxLength(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'maxLength',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    matches(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'matches',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    isMilitaryTime(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isMilitaryTime',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isHash(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isHash',
                    message: message,
                    constraints
                }
            ]
        }
        return decorator;
    },
    isISSN(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isISSN',
                    message: message
                }
            ]
        }
        return decorator;
    },
    arrayContains(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'arrayContains',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    arrayNotContains(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'arrayNotContains',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    arrayNotEmpty(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'arrayNotEmpty',
                    message: message
                }
            ]
        }
        return decorator;
    },
    arrayMinSize(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'arrayMinSize',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    arrayMaxSize(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'arrayMaxSize',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    arrayUnique(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'arrayUnique',
                    message: message
                }
            ]
        }
        return decorator;
    },
    isInstance(constraints: Array<any>, message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'isInstance',
                    message: message,
                    constraints: constraints || []
                }
            ]
        }
        return decorator;
    },
    allow(message?: string) {
        function decorator(target: any, key: any) {
            const schemaName = target.constructor.name;
            if (message) {
                message = message.replace('$key', key);
            }
            checkInit(target, key);
            validatorSchema[schemaName].properties[key] = [
                ...validatorSchema[schemaName].properties[key] || [], 
                {
                    type: 'allow',
                    message: message
                }
            ]
        }
        return decorator;
    },

}

// let fData = '';
// function cf(fnName) {
//     fData += `
//     ${fnName}(message?: string) {
//         function decorator(target: any, key: any) {
//             const schemaName = target.constructor.name;
//             if (message) {
//                 message = message.replace('$key', key);
//             }
//             if (!validatorSchema[schemaName]) {
//                 validatorSchema[schemaName] = {
//                     name: schemaName,
//                     properties: {
//                     }
//                 }
//             }
//             validatorSchema[schemaName].properties[key] = [
// ...validatorSchema[schemaName].properties[key] || [],{...validatorSchema[schemaName].properties[key] || [],
//                     type: '${fnName}',
//                     message: message
//                 }
//             ]
//         }
//         return decorator;
//     },

//     `
// }

// let fn = $('#list').children[1].children;
// for (var i = 0; i < fn.length; i++) {
//     let code = fn[i].getElementsByTagName('code');
//     if (code.length) {
//         let fName = code[0].textContent;
//         fName = fName.slice(1, fName.indexOf('('));
//         fName = fName.charAt(0).toLocaleLowerCase() + fName.substring(1);
//         cf(fName);
//     }
// }