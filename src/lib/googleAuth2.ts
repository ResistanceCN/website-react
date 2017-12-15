let loaded = false;

function gapiInit(): Promise<typeof gapi> {
    return new Promise((resolve, reject) => {
        if (loaded) {
            resolve(gapi);
            return;
        }

        const wait = () => {
            switch (asyncScripts.gapi) {
                case -1:
                    // Failed
                    reject();
                    // tslint:disable-next-line
                    console.error('Cannot load Google oAuth library');
                    break;

                case 1:
                    // Success
                    gapi.load('auth2', () => {
                        gapi.auth2.init({});
                        resolve(gapi);
                        loaded = true;
                    });
                    break;

                default:
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
