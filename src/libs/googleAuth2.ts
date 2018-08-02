const gapiScript = new Promise<typeof gapi>((resolve, reject) => {
    const wait = () => {
        switch (asyncScripts.gapi) {
            case ScriptStatus.Failed:
                reject();
                // tslint:disable-next-line
                console.error('Cannot load Google oAuth library');
                break;

            case ScriptStatus.Success:
                if (typeof gapi.load !== 'function') {
                    break;
                }

                gapi.load('auth2', () => {
                    gapi.auth2.init({});
                    resolve(gapi);
                });
                break;

            case ScriptStatus.Loading:
                setTimeout(wait, 200);
        }
    };

    wait();
});

export const auth2 = gapiScript.then(gapi => {
    return new Promise<typeof gapi.auth2>((resolve, reject) => {
        gapi.auth2
            .init({})
            .then(_ => resolve(gapi.auth2), reject);
    });
});

export const signin2 = gapiScript.then(gapi => gapi.signin2);
