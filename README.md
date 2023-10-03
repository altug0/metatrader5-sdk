# Metatrader5 SDK Example

This is a simple example of how to use the Metatrader5 SDK to interact with a MetaTrader 5 trading platform.

## Installation

To use this example, you need to have Node.js installed on your system. If you haven't already, you can download it from [nodejs.org](https://nodejs.org/).

Next, you can install the `metatrader5-sdk` package by running the following command in your project directory:

```bash
npm install metatrader5-sdk
```

## Create an Instance

define metatrader instance

```javascript
const Metatrader5 = require('metatrader5-sdk')
// ...
const mt5Instance = new Metatrader5('your.host.com', 443, {
    login: "API_USER_LOGIN",
    password: "API_USER_PASS",
    build: "VERSION",
    agent: "AGENT_NAME_FOR_TRACKING"
});
// ...
```

### User Library Example
```javascript
const mt5Instance = new MT5Request('your.host.com', 443, {
    login: "API_USER_LOGIN",
    password: "API_USER_PASS",
    build: "VERSION",
    agent: "AGENT_NAME_FOR_TRACKING"
});

async func(){
    await mt5Instance.user.get("USER_LOGIN")
}

```
### Available API

| Library  | Function | Description | Return |
| ------------- | ------------- | ------------- | ------------- |
| user  | get("USER_LOGIN")  | get user information  | Object |
| user  | checkPassword("USER_LOGIN", "USER_PASSWORD", "PASSWORD_TYPE") | check users password  | Boolean |
| user  | changePassword("USER_LOGIN", "CURRENT_PASSWORD", "NEW_PASSWORD", "PASSWORD_TYPE") | check users password  | Boolean |