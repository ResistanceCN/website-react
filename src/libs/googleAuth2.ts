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
    return (await gapiInit()).auth2;
}

export async function signin2() {
    return (await gapiInit()).signin2;
}

export async function googleSignOut(api: typeof gapi.auth2) {
    return new Promise(resolve => {
        // Google says that the signOut() method is synchronous, but...
        api.getAuthInstance().signOut();

        // isSignedIn is not set to false immediately, so we have to wait
        const wait = () => {
            if (!api.getAuthInstance().isSignedIn.get()) {
                // If we do logout() before isSignedIn changed, the user might be redirected to login page
                // Then gapi.auth2.init() would call onSuccess(), which will dispatch actions we don't want
                resolve();

                return;
            }

            setTimeout(wait);
        };

        wait();
    });
}
