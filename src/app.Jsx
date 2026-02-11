export default function App() {
  return (
    <div className="body bg-dark text-light">
      <header class="banner">
        <div class="left-content">
          <h1>RaidBuddy</h1>
            <nav>
              <ul>
                <li class="nav-item"><a href="index.html">Home</a></li>
                <li class="nav-item"><a href="col-map.html">Maps</a></li>
                <li class="nav-item"><a href="analytics.html">Analytics</a></li>
                <li class="nav-item"><a href="about.html">About</a></li>
              </ul>
            </nav>
        </div>
      <div class="right-content">
    <a class="profile-button" href="login.html">Login</a>
  </div>
</header>

      <main>App components go here</main>

      <footer className="bg-dark text-white-50">
        <div className="container-fluid">
          <span className="text-reset">Author Name(s)</span>
          <a className="text-reset" href="https://github.com/webprogramming260/simon-react">
            Source
          </a>
        </div>
      </footer>
    </div>
  );
}