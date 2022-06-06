### [Back](./Main.md)

# Authentication

## **SIGNUP**

Type: `Post`  
Path: `/auth/signup`  
RequestBody:

```
{
    "email": String,
    "password": String,
}
```

ResponseBody:

```
{
    "jwt": String,
    "tokenType": "Bearer",
    "refrershToken": String,
    "UUID": String,
    "roles": Array
}
```

<br>

## **SIGNIN**

Type: `Post`  
Path: `/auth/signin`  
RequestBody:

```
{
    "email": String,
    "password": String,
}
```

ResponseBody:

```
{
    "jwt": String,
    "tokenType": "Bearer",
    "refrershToken": String,
    "UUID": String,
    "roles": Array
}
```

<br>

## **REFRESH TOKEN**

Type: `Post`  
Path: `/auth/refreshToken`  
RequestBody:

```
{ "refreshToken": String }
```

ResponseBody:

```
{
    "jwt": String,
    "tokenType": "Bearer",
    "refrershToken": String,
}
```
