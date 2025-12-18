import { useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// 検索フォームコンポーネント
function SearchForm(props){
  const [nameInput, setNameInput] = useState("");

  // inputの値が変化したら再表示
  const handleNameChange = (e) => {
      setNameInput(e.currentTarget.value);
  }
    // 登録ボタンが押されたらエラーを出すか、名前の検索をかける
  const handleOnSearch = (e) => {
    e.preventDefault();
    if (nameInput === ``) {
        alert(`名前が入力されていません`);
        return;
    }
    props.onSearch(nameInput);
  }
  // リセットボタン
  const handleOnReset = (e) => {
    e.preventDefault();
    props.onReset();
    setNameInput('');
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
          <button className="searchButton" onClick={handleOnSearch}>検索</button>
          <button className="resetButton" onClick={handleOnReset}>リセット</button>
      </section>
    </>
  );
}

// ユーザーコンポーネント
function User(props) {
  // チェックボックス用
  const handleCheckboxChange = () => {
      props.onCheckboxChange(props.user.id);
  };
  // 削除ボタン
  const handleDeleteClick = () => {
    props.onDeleteClick(props.user.id);
  };

  return(
  <>
    {/* inactiveなら背景がグレー */}
    <section className={`${props.user.status}`}>
      <div>
        {props.user.status}
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

// 総表示コンポーネント
function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // jsonサーバーから要素取得、取得した要素はusersに入る
  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // チェックボックスでactiveとinactiveの文字列を切り替えるためのコード
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

  // 検索用
  const handleSearchForm = (nameInput) => {
    setSearchTerm(nameInput);
  }
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  const handleReset = () => {
    setSearchTerm('');
  }

  // 配列状のfilterUsersを展開
  const userItems = filteredUsers.map((user) => {
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
      <SearchForm
      onSearch = {handleSearchForm}
      onReset = {handleReset} />
      {userItems}
    </main>
    </>
  )
}

export default App
