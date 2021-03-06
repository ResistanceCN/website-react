function gravatar(hash: string, size: number = 160) {
    const s = Math.ceil(window.devicePixelRatio * size);
    return 'https://cn.gravatar.com/avatar/' + hash + '?d=mm&s=' + s;
}

export function resizeGoogleAvatar(url: string, size: number) {
    const s = Math.ceil(window.devicePixelRatio * size);
    const parts = url.split('/');
    parts[parts.length - 2] = 's' + s;
    return parts.join('/');
}

export function later(milis: number) {
    return new Promise(resolve => setTimeout(resolve, milis));
}

export function deepClone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
}

export function errorText(e: Error) {
    return e.toString().replace('Error: GraphQL error: ', '');
}

export function unreachable(): null {
    throw new Error('Unreachable branch reached!');
}
