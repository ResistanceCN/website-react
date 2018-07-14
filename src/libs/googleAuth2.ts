let loaded = false;

function gapiInit(): Promise<typeof gapi> {
    return new Promise((resolve, reject) => {
        if (loaded) {
            resolve(gapi);
            return;
        }

        const wait = () => {
            switch (asyncScripts.gapi) {
                case ScriptStatus.Failed:
                    // Failed
                    reject();
                    // tslint:disable-next-line
                    console.error('Cannot load Google oAuth library');
                    break;

                case ScriptStatus.Success:
                    // Success
                    gapi.load('auth2', () => {
                        gapi.auth2.init({});
                        resolve(gapi);
                        loaded = true;
                    });
                    break;

                case ScriptStatus.Loading:
                    // Loading
                    setTimeout(wait, 200);
            }
        };

        wait();
    });
}

export async function auth2() {
    const api = (await gapiInit()).auth2;
    await new Promise(resolve => api.init({}).then(resolve));
    return api;
}

export async function signin2() {
    return (await gapiInit()).signin2;
}
