---
config:
  theme: mc
---
graph TD
    Index["/"] --> CheckToken{Є токен?}
    CheckToken -->|Так| Passwords["/passwords"]
    CheckToken -->|Ні| Login["/login"]
    Login -->|POST| LoginAPI["/api/auth/login"]
    Register["/register"] -->|POST| RegisterAPI["/api/auth/register"]
    subgraph MongoDB
        Users[(Колекція користувачів)]
        Passwords_DB[(Колекція паролів)]
    end
    subgraph Моделі
        UserModel[Модель користувача<br/>username: Рядок<br/>password: Рядок<br/>isAdmin: Логічний]
        PasswordModel[Модель паролю<br/>title: Рядок<br/>password: Рядок<br/>userId: ObjectId]
    end
    LoginAPI -->|Перевірка| Users
    RegisterAPI -->|Створення| Users
    Passwords -->|GET| PasswordsAPI["/api/passwords"]
    Passwords -->|POST| PasswordsAPI
    PasswordsAPI -->|Запит| Passwords_DB
    UserModel -.->|Схема| Users
    PasswordModel -.->|Схема| Passwords_DB
    Users -->|Зв'язок| Passwords_DB
    Login -->|"Немає акаунту?"| Register
    Register -->|"Є акаунт?"| Login
    Passwords -->|Вихід| Login
    PasswordsAPI -->|Перевірка JWT| CheckAdmin{Адмін?}
    CheckAdmin -->|Так| AllPasswords[Усі паролі]
    CheckAdmin -->|Ні| UserPasswords[Паролі користувача]
    classDef page fill:#f9f,stroke:#333,stroke-width:2px
    classDef api fill:#9cf,stroke:#333,stroke-width:2px
    classDef db fill:#fcf,stroke:#333,stroke-width:2px
    classDef model fill:#cfc,stroke:#333,stroke-width:2px
    class Index,Login,Register,Passwords page
    class LoginAPI,RegisterAPI,PasswordsAPI api
    class Users,Passwords_DB db
    class UserModel,PasswordModel model
