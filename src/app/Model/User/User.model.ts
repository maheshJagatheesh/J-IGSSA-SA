export class User {

    constructor(
        private _season_id: number,
        private _client_id: number,
        private _adminLevel: number,
        private _person_id: number,
        private _username: string,
        private _password: string

    ) { }

    get sessionId() {
        return this._season_id;
    }

    get clientId() {
        return this._client_id;
    }

    get adminLevel() {
        return this._adminLevel;
    }

    get personId() {
        return this._person_id;
    }

    get username() {
        return this._username;
    }

    get password() {
        return this._password;
    }
}