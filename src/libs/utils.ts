export function gravatar(hash: string, size: number = 160) {
    const s = Math.ceil(window.devicePixelRatio * size);
    return 'https://cn.gravatar.com/avatar/' + hash + '?d=mm&s=' + s;
}

export function later(milis: number) {
    return new Promise(resolve => setTimeout(resolve, milis));
}

// tslint:disable-next-line
export function deepClone(data: any) {
    return JSON.parse(JSON.stringify(data));
}

export function errorText(e: Error) {
    return e.toString().replace('Error: GraphQL error: ', '');
}
