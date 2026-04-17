# Procurement Web

Веб-интерфейс для управления закупками и подбора поставщиков.

Современное Angular приложение на Material Design для создания заявок на закупку и просмотра подобранных предложений от поставщиков.

## Технологический стек

- **Angular**: 20.3 (latest)
- **TypeScript**: 5.9
- **Angular Material**: UI компоненты
- **RxJS**: реактивное программирование
- **Node.js**: 22 Alpine (Docker)
- **Nginx**: веб-сервер

## Быстрый старт

### Docker Compose (рекомендуется)

```bash
cd ..
docker-compose up procurement-web
```

Приложение будет доступно по адресу: **http://localhost:4200**

### Локально (разработка)

#### Требования
- Node.js 22+
- npm 10+

#### Установка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm start
```

Приложение откроется на **http://localhost:4200** с автоматической перезагрузкой при изменениях.

## Struktura проекта

```
procurement-web/
├── src/
│   ├── app/                      # Компоненты приложения
│   │   ├── components/           # UI компоненты
│   │   ├── services/             # API сервисы
│   │   ├── models/               # TypeScript модели
│   │   └── app.component.ts      # Корневой компонент
│   ├── index.html                # HTML страница
│   ├── styles.css                # Глобальные стили
│   └── main.ts                   # Точка входа
├── angular.json                  # Конфигурация Angular CLI
├── tsconfig.json                 # TypeScript конфигурация
├── package.json                  # Зависимости
├── proxy.conf.json               # Proxy для API (dev)
├── nginx.conf                    # Nginx конфигурация (production)
├── Dockerfile                    # Docker образ
└── README.md                     # Этот файл
```

## Основные функции

### 1. Создание заявки

- Выбор категории (ноутбуки, смартфоны, принтеры)
- Установка максимальной цены
- Указание требований к спецификациям (RAM, Storage и т.д.)
- Поддержка операторов сравнения (=, >=, <=)

**Endpoint:**
```
POST /api/requests
Content-Type: application/json

{
  "category": "laptops",
  "maxPrice": 500000,
  "specifications": [
    {
      "name": "RAM",
      "operator": "GTE",
      "value": "16"
    }
  ]
}
```

### 2. Просмотр заявок

- Список всех созданных заявок
- Пагинация
- Просмотр деталей заявки

**Endpoint:**
```
GET /api/requests?page=0&size=20
```

### 3. Запуск подбора

- Инициирование процесса поиска предложений
- Отправка заявки на matching-service через backend

**Endpoint:**
```
POST /api/requests/{requestId}/match
```

### 4. Просмотр предложений

- Показать все найденные предложения для заявки
- Информация о поставщике, товаре и цене
- Спецификации предложения

**Endpoint:**
```
GET /api/offers/by-request/{requestId}
```

## Разработка

### Запуск development сервера

```bash
npm start
```

Dev сервер использует конфигурацию из `proxy.conf.json` для проксирования API запросов:

```json
{
  "/api": {
    "target": "http://request-service:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### Код scaffolding

Генерировать новые компоненты, сервисы и т.д.:

```bash
# Новый компонент
ng generate component components/request-list

# Новый сервис
ng generate service services/request

# Новый модуль
ng generate module modules/requests
```

### Сборка

#### Development сборка
```bash
npm run build
```

#### Production сборка (оптимизация)
```bash
npm run build -- --prod
```

Build артефакты сохраняются в `dist/` директорию.

## Тестирование

### Unit тесты

```bash
npm test
```

Использует Karma + Jasmine для запуска тестов.

### e2e тесты

```bash
npm run e2e
```

### Code coverage

```bash
npm test -- --code-coverage
```

результаты в `coverage/` директории.

## Форматирование кода

```bash
# Форматирование с Prettier
npm run format

# Форматирование конкретного файла
npx prettier --write src/app/components/my-component.ts
```

## Конфигурация

### environment.ts (development)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### environment.prod.ts (production)

```typescript
export const environment = {
  production: true,
  apiUrl: '/api'  // Relative URL в production
};
```

## Deployment

### Docker

#### Сборка образа
```bash
docker build -t procurement-web:latest .
```

#### Запуск контейнера
```bash
docker run -d -p 4200:80 procurement-web:latest
```

#### С Docker Compose
```bash
docker-compose up procurement-web
```

### Production сборка + Nginx

1. **Сборка фронтенда**
```bash
npm run build --prod
```

2. **Nginx конфигурация** (`nginx.conf`)
   - Routing для Angular SPA
   - Proxy для API запросов
   - Кеширование статических файлов
   - Security headers

3. **Запуск nginx**
```bash
docker run -d \
  -v $(pwd)/dist/procurement-web:/usr/share/nginx/html \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf \
  -p 80:80 \
  nginx:alpine
```

## API Интеграция

### Requests Service

```typescript
// services/request.service.ts
@Injectable()
export class RequestService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createRequest(request: RequestDTO): Observable<RequestResponseDTO> {
    return this.http.post<RequestResponseDTO>(
      `${this.baseUrl}/requests`,
      request
    );
  }

  getRequests(page: number, size: number): Observable<Page<RequestResponseDTO>> {
    return this.http.get<Page<RequestResponseDTO>>(
      `${this.baseUrl}/requests`,
      { params: { page, size } }
    );
  }

  getRequestById(id: string): Observable<RequestResponseDTO> {
    return this.http.get<RequestResponseDTO>(`${this.baseUrl}/requests/${id}`);
  }

  startMatching(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/requests/${id}/match`, {});
  }
}
```

### Offers Service

```typescript
// services/offer.service.ts
@Injectable()
export class OfferService {
  constructor(private http: HttpClient) {}

  getOffersByRequest(requestId: string): Observable<OfferDTO[]> {
    return this.http.get<OfferDTO[]>(
      `${environment.apiUrl}/offers/by-request/${requestId}`
    );
  }
}
```

## Troubleshooting

### "404 Not Found" на API запросах

**В development:**
- Проверьте что `proxy.conf.json` указывает на правильный адрес request-service
- Убедитесь что request-service запущен на порту 8080

**В production (Docker):**
- Проверьте nginx конфигурацию в docker-compose.yml
- Убедитесь что request-service доступен по имени `request-service`

### "Cannot find module" ошибки

```bash
# Очистите node_modules и переустановите
rm -rf node_modules package-lock.json
npm install
```

### Dev server не запускается

```bash
# Проверьте порт 4200 не занят
lsof -i :4200

# Если занят:
npm start -- --port 4300
```

### CORS ошибки

Если видите CORS ошибки в production:

1. Проверьте nginx конфигурацию имеет правильные proxy headers
2. Убедитесь что API сервис принимает запросы

## Performance оптимизация

### Bundle size анализ

```bash
npm run analyze-bundle
```

### Lazy Loading модули

```typescript
const routes = [
  {
    path: 'requests',
    loadChildren: () => import('./modules/requests/requests.module')
      .then(m => m.RequestsModule)
  }
];
```

### Change Detection

Используйте OnPush стратегию для оптимизации:

```typescript
@Component({
  selector: 'app-request-list',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestListComponent { }
```

## Полезные ссылки

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Лицензия

MIT
