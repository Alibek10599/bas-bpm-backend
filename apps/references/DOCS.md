## email notification

[POST] {domain}/notifications/send

### *body*
```json
{
    "strategy": "email",
    "languages": "ru",
    "options": {
        "templateId": "FORGOT_PASSWORD",
        "receiverEmail": "test@mail.ru",
        "variables": {
            "reset_link": "asd"
        }
    }
}
```
strategy: "email" | "sms"

languages: "ru" | "en"

templateId: WELCOME | FORGOT_PASSWORD



### *response*
```json
{
  "status": "OK"
}
```