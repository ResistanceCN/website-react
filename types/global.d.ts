declare enum ScriptStatus {
    Loading = 0,
    Success = 1,
    Failed = -1
}

declare interface AsyncScripts {
    gapi: ScriptStatus;
    map: ScriptStatus;
}

declare var asyncScripts: AsyncScripts;
