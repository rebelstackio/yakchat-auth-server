# yakchat-auth-server

Autorization and Authentication REST server for [yakchat](https://github.com/rebelstackio/yakchat)


## Endpoints

### `/login`

*Url*

`POST http://192.168.86.6:8888/api/v1/auth/login` 

*Headers*:

- `Content-Type: application/json`
- `Accept: application/json`

*Body*:

```json
{
    "username": "admin",
    "password": "<pass>"
}
```
