## TTODO-лист на React с использованием удалнного сервера.

**Описание:** Приложение реализует функционал TODO-листа (добавление, удаление и редактирование задач) для каждого из пользователей в системе. Приложение поддерживает регистрацию нового пользователя с уникальным именем. Также поддерживается функционал учётных записей с административными привелегиями: такой пользователь может видеть список всех зарегестрированных пользователей, их задачи, и изменять их. В приложении реализовано переключение между английским и русским языком интерфейса.
Сервер в данном приложении реализован в отдельном [js-файле](https://github.com/d00dde/Todo-with-server/blob/master/src/server/server.js/), который эмулирует авторизацию пользователей, создание и завершение активной сессии, проверку разрешений запросов на те или иные действия, и эмулирует соответствующие ответы. Код приложения отделён от кода сервера.

**Ссылка:** готовое приложение можно найти [здесь](https://d00dde.github.io/Todo-with-server/).

**Использованы технологии:** 
+ базовые технологии React; 
+ контролируемые поля ввода;
+ методы жизненного цикла компонентов;
+ работа с API сервера;
+ создание и подключение лоадеров;
+ методы обработки ошибок в приложении;
+ higher order components (hoc).
