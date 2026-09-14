# Passkey Alias

A lightweight Tampermonkey userscript that lets you add a custom alias to a newly created WebAuthn passkey.

For example:

```text
[YubiKey] john@example.com
```

instead of:

```text
john@example.com
```

The alias is added to both the **passkey username** and **display name**.

## Use Cases

Passkey Alias is useful when you have multiple passkeys and want to identify them more easily.

Examples:

```text
[Personal] john@example.com
[Work] john@example.com
[YubiKey] john@example.com
[Desktop] john@example.com
[Phone] john@example.com
```

This can make it easier to distinguish passkeys belonging to different devices, accounts, or purposes.

## How It Works

When a website creates a new WebAuthn passkey, Passkey Alias asks:

```text
Enter an alias for this Passkey:

Leave empty to keep the original name.
```

If you enter:

```text
YubiKey
```

the script changes:

```text
john@example.com
John Doe
```

to:

```text
[YubiKey] john@example.com
[YubiKey] John Doe
```

The WebAuthn `user.id` is **not changed**.

## Installation

### 1. Install Tampermonkey

Install the Tampermonkey browser extension:

[Tampermonkey](https://www.tampermonkey.net/)

### 2. Install Passkey Alias

Open the userscript file:

[passkey-alias.user.js](https://github.com/hamzaharoon1314/passkey-alias/blob/main/passkey-alias.user.js)

Copy the script into a new Tampermonkey userscript.

### 3. Enable the Script

Make sure **Passkey Alias** is enabled in Tampermonkey.

### 4. Create a Passkey

Go to a website that supports passkeys and start registering a new passkey.

The alias prompt will appear automatically.

Enter something such as:

```text
YubiKey
```

The new passkey will use:

```text
[YubiKey]
```

as its prefix.

## Skipping an Alias

You can create a passkey normally by:

* Pressing **Cancel**, or
* Leaving the alias field empty.

The original WebAuthn request will then be used unchanged.

## Example

### Before

```text
Username:
john@example.com

Display Name:
John Doe
```

### Enter Alias

```text
Work
```

### Result

```text
Username:
[Work] john@example.com

Display Name:
[Work] John Doe
```

## What Is Changed?

The script modifies these WebAuthn registration fields:

```javascript
user.name
user.displayName
```

It does **not** modify:

```javascript
user.id
```

The original `user` object is cloned before making the changes.

## Important

Passkey Alias works by hooking the browser's:

```javascript
navigator.credentials.create()
```

WebAuthn API.

It is **not YubiKey-only**. It can potentially affect passkey creation using other authenticators or passkey providers as well.

The script does not force a specific authenticator.

## Limitations

Passkey Alias:

* Does not rename existing passkeys.
* Does not delete passkeys.
* Does not manage passkeys.
* Does not store aliases.
* Does not synchronize aliases.
* Does not change the WebAuthn `user.id`.
* Only affects passkey creation requests that go through the page's WebAuthn API.

Website and browser implementations may affect compatibility.

## Privacy

Passkey Alias does not use:

* External servers
* Analytics
* Tracking
* Network requests
* Remote APIs
* Persistent storage

The alias is entered locally through the browser prompt and applied to the WebAuthn registration request.

Keep in mind that the modified `name` and `displayName` values are sent to the website as part of the passkey registration process.
