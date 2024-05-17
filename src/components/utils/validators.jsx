export const required = value => {
    return value.trim() !== ""
}

export const length = config => value => {
    let isValid = true
    if (config.min) {
        isValid = isValid && value.trim().length >= config.min
    }
    if (config.max) {
        isValid = isValid && value.trim().length <= config.max
    }
    return isValid
}

export const isEmail = value => {
    return (
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
            value
        )
    );
}