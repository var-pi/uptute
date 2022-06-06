### [Back](./Main.md)

# Account

## **UPGRADE TO USER**

Type: `POST`  
Path: `/account/me/user`

RequestBody:

```
{
    "firstName": String,
    "lastName": String,
    "birthday": String,
}
```

ResponseBody:

```
{
    "jwt": String,
    "tokenType": "Bearer",
    "UUID": String,
    "roles": Array
}
```

## **UPGRADE TO STUDENT**

Type: `POST`  
Path: `/account/me/student`

RequestBody:

```
{
    "grade": Number
}
```

ResponseBody:

```
{
    "jwt": String,
    "tokenType": "Bearer",
    "UUID": String,
    "roles": Array
}
```

## **UPGRADE TO TUTOR**

Type: `POST`  
Path: `/account/me/tutor`

RequestBody:

```
{
    "conferenceLink": String,
}
```

ResponseBody:

```
{
    "jwt": String,
    "tokenType": "Bearer",
    "UUID": String,
    "roles": Array
}
```

## **GET USER DETAILS**

Type: `Get`  
Path: `/account/me`

ResponseBody:

```
{
    "uuid": String,
    "email": String,
    "roles": Array,
    "userDetails": Object,
    "studentDetails": Object,
    "tutorDetails": Object,
}
```

## **GET STUDENT DETAILS**

Type: `Get`  
Path: `/account/{UUID}/student`

ResponseBody:

```
{
    "UUID": String,
    "firstName": String,
    "lastName": String,
    "grade": Number,
}
```

## **GET TUTOR DETAILS**

Type: `Get`  
Path: `/account/{UUID}/tutor`

ResponseBody:

```
{
    "UUID": String
    "firstName": String,
    "lastName": String,
    "age": Number
}
```

## **UPDATE USER DETAILS**

Type: `Patch`  
Path: `/account/me`  
RequestBody:

```
{
    "firstName": String,
    "lastName": String,
    "email": String,
    "birthday": String,
}
```

ResponseBody:

```
{
    "firstName": String,
    "lastName": String,
    "email": String,
    "birthday": String,
}
```

## **UPDATE STUDENT DETAILS**

Type: `Patch`  
Path: `/account/me/student`  
RequestBody:

```
{
    "grade": Number,
}
```

ResponseBody:

```
{
    "grade": Number,
}
```

## **UPDATE STUDENT DETAILS**

Type: `Patch`  
Path: `/account/me/student`  
RequestBody:

```
{
    "conferenceLink": String,
}
```

ResponseBody:

```
{
    "conferenceLink": String,
}
```

