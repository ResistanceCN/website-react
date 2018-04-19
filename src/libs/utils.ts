export function gravatar(hash: string, size: number = 160) {
    const s = Math.ceil(window.devicePixelRatio * size);
    return 'https://cn.gravatar.com/avatar/' + hash + '?d=mm&s=' + s;
}

export function later(milis: number) {
    return new Promise(resolve => setTimeout(resolve, milis));
}
