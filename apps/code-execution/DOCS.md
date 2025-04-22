## file-management

### [POST] /code-execution/execute

body
```json
{
  "scriptId": "3b033e22-c0f0-4008-9504-542881242bc4",
  "context": {
    "id": "3b033e22-c0f0-4008-9504-542881242bc4",
    "name": "some-task",
    "deadline": "2025-05-01T00:00:00Z000"
  }
}
```

### [POST] /scripts
body
```json
{
  "name": "Say hello world!",
  "script": "console.log('Hello world')",
  "language": "js"
}
```

Внутри скрипта доступны следующие глобальные переменные:
- tenantId - tenantId текущего пользователя
- userId - userId текущего пользователя
- data - данные из context запроса /code-execution/execute

А также методы:
- log - используется для логирования данные будут возвращены в свойстве logs ответа запроса
```json
[
  "a b uid-1 vit",
  "next 1 2 3 []",
  "{\"id\":\"3b033e22-c0f0-4008-9504-542881242bc4\",\"name\":\"some-task\",\"deadline\":\"2025-05-01T00:00:00Z000\"}"
]
```