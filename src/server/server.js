export default class {
  _users = [
    { id: 0,
      name: 'admin',
      password: 'admin',
      isAdmin: true,
      tasks: [
        {id: 0, title: 'Drink coffee'},
        {id: 1, title: 'Create TODO-list'},
        {id: 2, title: 'Drink more coffee'},
        {id: 3, title: 'Refactor TODO-list'}
      ],
      maxId: 3,
    },
    {
      id: 1,
      name: 'littel',
      password: '8361035',
      isAdmin: false,
      tasks: [
        {id: 0, title: 'Drink coffee'},
        {id: 1, title: 'Feed the cat'},
        {id: 2, title: 'Drink beer'},
        {id: 3, title: 'Kill all \'polovtsev\''}
      ],
      maxId: 3,
    }
  ];
  _sessions = [];
  _maxId = 1;
  _serverDelay = 500;

  //Проверка типа запроса, реализация логики проверок и вызова соответствующих ответов сервера

  request = (type, params) => {
    console.log('type: ' , type);
    console.log('params: ' , params);
    switch(type){
      case 'login':
        if(this._checkRegistration(params)) {
          if (!this._checkActiveSession(params))
            return this._addSession(params);
          return this._denial('session');
        }
        return this._denial(this._wrongPassOrName(params));
      case 'logOut':
        if(this._checkActiveSession(params))
          return this._endSession(params);
      case 'getUsers':
        if(this._checkActiveSession(params) && this._isAdminSession(params))
          return this._getUsers();
        return this._error('no access');
      case 'addUser':
        if(this._noEmptyPassAndName(params) && this._nameIsFree(params))
          return this._addUser(params);
        return this._error('registration failed');
      case 'checkUser':
        return this._checkUser(params);
      case 'getTasks':
        if(this._checkActiveSession(params) || this._isAdminSession(params))
          return this._getTasks(params);
        return this._error('no access');
      case 'addTask':
        if(this._checkActiveSession(params) || this._isAdminSession(params))
          return this._addTask(params);
        return this._error('no access');
      case 'removeTask':
        if(this._checkActiveSession(params) || this._isAdminSession(params))
          return this._removeTask(params);
        return this._error('no access');
      case 'editTask':
        if(this._checkActiveSession(params) || this._isAdminSession(params))
          return this._editTask(params);
        return this._error('no access');
    }
  }

  //-----Внутренние провекрки сервера.-------

  _checkActiveSession = ({name, token}) => {
    const session = this._sessions.find((session) => session.name === name);
    if(!session)
        return false;
      if(session.token !== token)
        return false;
      return true;
  }

  _isAdminSession = ({name, token}) => {
    if(this._checkActiveSession({name, token})){
      const session = this._sessions.find((session) => session.name === name);
      if(session.isAdmin)
        return true;
    }
    return false;


  }

  _noEmptyPassAndName = ({name, password}) => {
    if(name.trim() === '' || password.trim() === '')
      return false;
    return true;
  }

  _nameIsFree = ({name}) => {
    if(this._users.find((user) => user.name === name))
      return false;
    return true;
  }

  _checkRegistration = ({name, password}) => {
    const user = this._users.find((user) => user.name === name);
    if(!user)
      return false;
    if(user.password !== password)
      return false;
    return true;
  }

  _wrongPassOrName = ({name, password}) => {
    const user = this._users.find((user) => user.name === name);
    if(!user)
      return 'name';
    if(user.password !== password)
      return 'password';
  }


  // ------- Функции, иммитирующие ответ от сервера. --------------
  // Создают Promise и резольвят их (функция error реджектит) через serverDelay миллисекунд.

  //Функции для работы с пользователями.

  _getUsers = () => {
    return new Promise( (resolve) => {
      setTimeout(() => {
        const usersList = this._users.map((user) => {
          return{
            name: user.name,
            isAdmin: user.isAdmin
          }
        });
        resolve (usersList);
      }, this._serverDelay);
    });
  }

  _addUser = ({name, password}) => {
    return new Promise( (resolve) => {
      setTimeout(() => {
         this._users.push({
            id: ++this._maxId,
            name: name,
            password: password,
            isAdmin: false,
            tasks: [],
            maxId: 0,
          });
          return resolve({isFree: true, register: true});
      }, this._serverDelay);
    });
  }

  _checkUser = ({name}) => {
    return new Promise( (resolve) => {
      setTimeout(() => {
        if(this._users.find((user) => user.name === name))
          return resolve({isFree: false, register: false});
        return resolve({isFree: true, register: false});
      }, this._serverDelay);
    });
  }

  _addSession = ({name}) => {
    return new Promise( (resolve) => {
      setTimeout(() => {
        const token = this._createToken();
        const isAdmin = this._users.find((user) => user.name === name).isAdmin;
        this._sessions.push({name, token, isAdmin});
        return resolve({isLogIn: true, isAdmin, token, reason: ''});
      }, this._serverDelay);
    });
  }

  _endSession = ({name}) => {
    return new Promise( (resolve) => {
      setTimeout(() => {
        this._sessions = this._sessions.filter((session) => session.name !== name);
        return resolve({sessionEnded: true});
      }, this._serverDelay);
    });
  }

  //Функции для работы с задачами.

  _getTasks = ({name}) => {
    return new Promise( (resolve) => {
      setTimeout(() => {
        const user = this._users.find((user) => user.name === name);
        const tasks = user ? user.tasks : [];
        resolve (tasks);
      }, this._serverDelay);
    });
  }

  _addTask = ({name, title}) => {
    return new Promise( (resolve) => {
      const user = this._users.find((user) => user.name === name);
      user.tasks.push({id: ++user.maxId, title: title});
      setTimeout(() => {
        resolve ({taskAdded: true});
      }, this._serverDelay);
    });
  }

  _editTask = ({name, id, title}) => {
    return new Promise( (resolve) => {
      setTimeout(() => {
        const user = this._users.find((user) => user.name === name);
        user.tasks.find((task) => task.id === id).title = title;
        resolve ({taskEdited: true});
      }, this._serverDelay);
    });
  }

  _removeTask = ({name, id}) => {
    return new Promise( (resolve) => {
      setTimeout(() => {
        const user = this._users.find((user) => user.name === name);
        user.tasks = user.tasks.filter((task) => task.id !== id);
        resolve ({taskRemoved: true});
      }, this._serverDelay);
    });
  }

  //Функции ошибок.

  _denial = (reason) => {
    return new Promise( (resolve) => {
      setTimeout(() => {
        return resolve({isLogIn: false, isAdmin: false, reason});
      }, this._serverDelay);
    });
  }

  _error = (error) => {
    return new Promise( (resolve, reject) => {
      setTimeout(() => {
        reject(error);
      }, this._serverDelay);
    });
  }

  // Вспомогательные функции

  _createToken = () => {
    return 1
  }

}