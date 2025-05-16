# Документация WebSocket Gateway API

## Доступ к документации

WebSocket Gateway работает на порту 3008 и предоставляет два типа интерфейсов:
- REST API (Swagger UI): `http://localhost:3008/docs`
- WebSocket соединение: `ws://localhost:3008`

## WebSocket События

### 1. Подключение

```typescript
// Подключение к WebSocket серверу
const socket = io('ws://localhost:3008', {
  auth: {
    token: 'ваш_jwt_токен'
  }
});
```

### 2. События

#### Прослушивание событий
```typescript
// Получение уведомлений
socket.on('notification', (data) => {
  console.log('Новое уведомление:', data);
});

// Обновление задачи
socket.on('task.updated', (data) => {
  console.log('Задача обновлена:', data);
});

// Обновление документа
socket.on('document.updated', (data) => {
  console.log('Документ обновлен:', data);
});
```

#### Отправка событий
```typescript
// Подписка на обновления задачи
socket.emit('subscribe.task', { taskId: 'task-123' });

// Отписка от обновлений
socket.emit('unsubscribe.task', { taskId: 'task-123' });
```

## REST API Endpoints

### 1. Информация о подключениях

#### Получение активных подключений
- Endpoint: `GET /connections`
- Возвращает список активных WebSocket подключений
- Требует права администратора

#### Получение статистики
- Endpoint: `GET /stats`
- Возвращает статистику по WebSocket соединениям
- Требует права администратора

## События по типам

### Уведомления
- `notification`: Новое уведомление
- `notification.read`: Уведомление прочитано
- `notification.deleted`: Уведомление удалено

### Задачи
- `task.created`: Создана новая задача
- `task.updated`: Задача обновлена
- `task.deleted`: Задача удалена
- `task.assigned`: Задача назначена
- `task.delegated`: Задача делегирована

### Документы
- `document.created`: Создан новый документ
- `document.updated`: Документ обновлен
- `document.deleted`: Документ удален
- `document.version.created`: Создана новая версия документа

## Коды ответов WebSocket

- `connect`: Успешное подключение
- `connect_error`: Ошибка подключения
- `disconnect`: Отключение
- `error`: Ошибка обработки события

## Модели данных

### ConnectionDto
```typescript
{
  id: string;           // ID соединения
  userId: string;       // ID пользователя
  connected: Date;      // Дата подключения
  subscriptions: string[]; // Список подписок
}
```

### StatsDto
```typescript
{
  totalConnections: number;    // Всего подключений
  activeConnections: number;   // Активные подключения
  messagesSent: number;        // Отправлено сообщений
  messagesReceived: number;    // Получено сообщений
}
```

## Особенности работы

1. **Аутентификация**:
   - Требуется валидный JWT токен при подключении
   - Токен передается в параметрах auth при создании соединения
   - При истечении токена соединение закрывается

2. **Масштабирование**:
   - Поддержка кластеризации через Redis
   - Автоматическая синхронизация между инстансами
   - Балансировка нагрузки

3. **Мониторинг**:
   - Метрики по активным соединениям
   - Статистика по типам сообщений
   - Логирование критических событий

4. **Обработка ошибок**:
   - Автоматическое переподключение
   - Буферизация сообщений при потере связи
   - Повторная отправка важных событий