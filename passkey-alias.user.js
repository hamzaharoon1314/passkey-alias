// ==UserScript==
// @name         Passkey Alias
// @namespace    https://tampermonkey.net/
// @version      1.3.1
// @description  Prepends an alias to the WebAuthn passkey username and display name
// @author       HAMO
// @homepageURL  https://github.com/hamzaharoon1314/passkey-alias/
// @supportURL   https://github.com/hamzaharoon1314/passkey-alias/issues
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @sandbox      raw
// ==/UserScript==

(() => {
    'use strict';

    const credentials = navigator.credentials;
    const originalCreate = credentials?.create;

    if (typeof originalCreate !== 'function') {
        return;
    }

    // Prevent double-hooking.
    const HOOK_MARK = Symbol.for('passkeyAliasHook');

    if (originalCreate[HOOK_MARK]) {
        return;
    }

    function normalizeAlias(value) {
        return value.trim().replace(/\s+/g, ' ');
    }

    function hasAliasPrefix(value, alias) {
        return value.startsWith(`[${alias}]`);
    }

    function addAlias(value, alias) {
        return hasAliasPrefix(value, alias)
            ? value
            : `[${alias}] ${value}`;
    }

    function hookedCreate(options) {
        const publicKey = options?.publicKey;
        const user = publicKey?.user;

        // Only intercept WebAuthn credential creation.
        if (!user) {
            return Reflect.apply(originalCreate, this, [options]);
        }

        const aliasInput = window.prompt(
            'Enter an alias for this Passkey:\n\n' +
            'Leave empty to keep the original name.',
            ''
        );

        // Cancelled → create normally.
        if (aliasInput === null) {
            return Reflect.apply(originalCreate, this, [options]);
        }

        const alias = normalizeAlias(aliasInput);

        if (!alias) {
            return Reflect.apply(originalCreate, this, [options]);
        }

        const modifiedUser = {
            ...user,

            name:
                typeof user.name === 'string'
                    ? addAlias(user.name, alias)
                    : user.name,

            displayName:
                typeof user.displayName === 'string'
                    ? addAlias(user.displayName, alias)
                    : user.displayName,
        };

        const modifiedPublicKey = {
            ...publicKey,
            user: modifiedUser,
        };

        const modifiedOptions = {
            ...options,
            publicKey: modifiedPublicKey,
        };

        return Reflect.apply(
            originalCreate,
            this,
            [modifiedOptions]
        );
    }

    // Mark wrapper so it cannot be installed twice.
    Object.defineProperty(hookedCreate, HOOK_MARK, {
        value: true,
        configurable: false,
        enumerable: false,
        writable: false,
    });

    try {
        credentials.create = hookedCreate;

        console.info('[Passkey Alias] WebAuthn hook installed.');
    } catch (error) {
        console.error(
            '[Passkey Alias] Failed to install WebAuthn hook:',
            error
        );
    }
})();
