function MainPage({ role, onLogout }) {
    return (
      <div className="container">
        <h1>Laipni lūgts, {role === "teacher" ? "Skolotāj" : "Skolēn"}!</h1>
        <button onClick={onLogout}>Iziet</button>
  
        {/* Skolotāja panelis */}
        {role === "teacher" && (
          <div>
            <h2>Skolotāja panelis</h2>
            {/* Te vēlāk nāks pievienot skolēnu, priekšmetu, atzīmju pogas */}
          </div>
        )}
  
        {/* Skolēna panelis */}
        {role === "student" && (
          <div>
            <h2>Skolēna atzīmes</h2>
            {/* Te nāks tikai skatīšanās view */}
          </div>
        )}
      </div>
    );
  }
  
  export default MainPage;
  