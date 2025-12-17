import { useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function SearchForm(props){
    // 登録ボタンが押されたらエラーを出すか、inputの値を描画するためにsetする
  const handleOnSearch = (e) => {
    e.preventDefault();
    if (nameInput === ``) {
        alert(`名前が入力されていません`);
        return;
    }
    props.onSearch(nameInput,);
    setTimeInput('');
  }
  return (
    <>
      <section className="search">
          <input
          className="name"
          type="text"
          // 値
          value={nameInput}
          // 変化が起きたら
          onChange={handleNameChange}
          />
          {/* ボタンが押されたら */}
          <button className="searchButton" onClick={handleOnSearch}>登録</button>
      </section>
    </>
  );
}

function User(props) {
    const handleCheckboxChange = () => {
        props.onCheckboxChange(props.user.id);
    };
    const handleDeleteClick = () => {
      props.onDeleteClick(props.user.id);
    };

    return(
    <>
      <section className="user">
        <div>
          userStatus
          <input
            type="checkbox"
            checked={props.user.status === "active"}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className="name">{props.user.name}</div>
        <div className="email">{props.user.email}</div>
        <div className="role">{props.user.role}</div>
        <div className="createdAt">{props.user.createdAt}</div>
        <button className="deleteButton" onClick={handleDeleteClick}>削除</button>
      </section>
    </>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleUserCheckboxChange = (id) => {
      const newUsers = users.map((user) => {
          return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              status: user.id === id ? (user.status === "active" ? "inactive" : "active") : user.status,
              createdAt: user.createdAt,
          };
      });
      setUsers(newUsers);
  };

  // const handleSearchForm = (nameInput){
  //   const newUsers = users;
  // }

  // 削除ボタン用
  const handleUserDeleteClick = (id) => {
      if(!window.confirm('削除しますか？')) {
          return;
      }
      const newUsers = users.filter((user) => {
          return user.id !== id;
      });
      setUsers(newUsers);
  };

  const userItems = users.map((user) => {
    return (
      <User
          key={user.id}
          user={user}
          onCheckboxChange={handleUserCheckboxChange}
          onDeleteClick={handleUserDeleteClick}
      />
      );
  });


  return (
    <>
    <main>
      {/* <SearchForm onSearch = {handleSearchForm} /> */}
      {userItems}
    </main>
    </>
  )
}

export default App
