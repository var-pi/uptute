### [Back](./Main.md)

# Lesson

## **CREATE LESSON**

Type: `Post`  
Role: `Student`  
Path: `/lessons/create`  
RequestBody:

```
{
    "subject": String,
    "topic": String,
    "details": String,
}
```

ResponseBody: CreateLogResponse

<br>

## **CANCEL LOG**

Type: `Post`  
Role: `Student, Tutor, Moderator, Admin` //depends on ctx  
Path: `/lessons/logs/{logId}/close`

ResponseBody: CreateLogResponse

<br>

## **CREATE OFFER**

Type: `Post`  
Role: `Tutor`
Path: `/lessons/logs/{logId}/offer`

ResponseBody: CreateLogResponse

<br>

## **ACCEPT OFFER**

Type: `Post`  
Role: `Student`
Path: `/lessons/logs/{logId}/accept`

ResponseBody: CreateLogResponse

<br>

## **INITIATE CONFERENCE**

Type: `Post`  
Role: `Tutor`
Path: `/lessons/logs/{logId}/init`

RequestBody:

```
{
    "zoomLink": String
}
```

ResponseBody: CreateLogResponse

<br>

## **CHECK FOR OFFERS**

Type: `Get`  
Role: `Student`
Path: `/lessons/logs/{logId}/offer`

ResponseBody: OserveLogResponse

<br>

## **CHECK FOR ACCEPTED**

Type: `Get`  
Role: `Tutor`
Path: `/lessons/logs/{logId}/accepted`

ResponseBody: OserveLogResponse

<br>

## **CHECK FOR INIT**

Type: `Get`  
Role: `Student, Tutor`
Path: `/lessons/logs/{logId}/init`

ResponseBody: OserveLogResponse

<br>

## **GET OPEN LESSONS**

Type: `Get`  
Role: `Tutor`
Path: `/lessons/open`

ResponseBody:

```
{
    "lessons": Array
}
```

Lesson:

```
{
    "lessonId": Long,
    "logId": Long,
    "details": String
}
```

<br>

## **GET LESSON LOGS**

Type: `Get`  
Role: `Moderator, Admin `
Path: `/lessons/{lessonId}`

Lesson:

```
{
    "lessonId": Long,
    "logs": Array //array of LessonLog
}
```

<br>

## **--------------**

CreateLogResponse:

```
{
    "lessonId": Long,
    "logId": Long
}
```

OserveLogResponse:

```
{
    "lessonId": Long,
    "logId": Long
    "childLogs": Array //array of LessonLog
}
```

LessonLog:

```
{
    "id": Long,
    "type": String,
    "createdAt": String, //???Object???
    "createdBy": String,
    "details": String //required conversion to object
}
```

