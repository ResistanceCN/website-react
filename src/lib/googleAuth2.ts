let loaded = false;

function gapiInit(): Promise<typeof gapi> {
    return new Promise((resolve, reject) => {
        if (typeof gapi === 'undefined') {
            // tslint:disable-next-line
            console.error('Google oAuth library is not loaded');
            reject();
        }

        if (loaded) {
            resolve(gapi);
            return;
        }

        gapi.load('auth2', () => {
            gapi.auth2.init({});
            loaded = true;
            resolve(gapi);
        });
    });
}

export async function auth2() {
    return (await gapiInit()).auth2;
}

export async function signin2() {
    return (await gapiInit()).signin2;
}
