import { useEffect } from "react";
import Navbar from "../components/Navbar";

function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("userInfo")
  );

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
    }
  }, [user]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  return (
    <>
      <Navbar />

      <div>
        <h1>Dashboard</h1>

        <h2>
          Welcome {user?.name}
        </h2>

        <p>
          Email: {user?.email}
        </p>

        <button onClick={logoutHandler}>
          Logout
        </button>
      </div>
    </>
  );
}

export default Dashboard;