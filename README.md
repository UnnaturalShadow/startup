# RaidBuddy: Destiny 2 Raid Guide and Collaborative Map Tool

RaidBuddy is a web application designed to help Destiny 2 players plan, coordinate, and execute raids. It provides interactive raid maps, step-by-step guides, and collaborative annotation features so fireteams can strategize in real-time. Users can view detailed guides for each raid, see maps for specific encounters, and work together to annotate those maps to explain tactics and positions.

## Deliverable 1: Project Specification

### Elevator pitch
Ever tried tackling a Destiny 2 raid without a clear plan and ended up wiped multiple times? RaidBuddy is here to help. With interactive guides, annotated maps, and collaborative drawing features, fireteams can plan strategies, assign roles, and visualize encounter mechanics — all in one place. Whether you’re learning the raid for the first time or coordinating a top-tier team, RaidBuddy makes raids easier, faster, and more fun.

### Design

![image](plan.png)  
*Placeholder sketch for layout of home page, map page, and guide pages.*

### Key features
- Detailed written guides for all Destiny 2 raids  
- Interactive maps for raid encounters  
- Collaborative real-time annotations via WebSockets  
- Ability to create or join a map with a code  
- Fun analytics page that now insults the user at the press of a button  
- Responsive design that works on desktops, tablets, and mobile devices  
- Clear navigation between home, guides, maps, analytics, and about pages  

### Technologies
I am going to use the required technologies in the following ways:

- **HTML** – Basic structural and organizational elements for all pages, including home, about, raid guides, collaborative maps, and analytics pages.  
- **CSS** – Styling and animating the application, including responsive layouts, color schemes, spacing, typography, hover effects, and interactive elements like raid tiles and buttons.  
- **React** – Componentization, routing, and user reactivity using the React framework and JavaScript. React will handle switching between raid guides, rendering collaborative map components, and updating UI in response to real-time events.  
- **Web service** – Endpoints provided by the backend service that support application-specific functionality, such as creating or joining collaborative maps, saving and retrieving annotations, and fetching raid guide content. For this deliverable, the analytics endpoint now calls a simple third-party API to fetch a random evil insult for the user.  
- **Database** – Store authentication data (if added later) and persistent application data, such as map states, annotations, and user-generated guides.  
- **WebSocket** – Real-time information pushed from the backend to the frontend, enabling live collaborative annotation of raid maps and instant updates for all connected users.

## 🚀 HTML deliverable  
For this deliverable I did the following. I checked the box [x] and added a description for things I completed.

- [x] HTML pages – Created multiple pages: `index.html` (Home page), `analytics.html` (now an interactive insult generator), `col-map.html` (collaborative map placeholder), and `about.html`. Each page has a header, main, and footer structure.  
- [x] Proper HTML element usage – Used semantic elements including `header`, `footer`, `main`, `nav`, `form`, `label`, `input`, `button`, and `a`. The login form uses proper input types and labels for accessibility.  
- [x] Links – Footer and header allow navigation between pages.  
- [x] Text – Pages include descriptive text placeholders for analytics (insult generator), player stats placeholders, and information about the app.  
- [x] 3rd party API placeholder – `analytics.html` now fetches a random insult from a public API on button click instead of Bungie player stats.  
- [x] Images – About page has a placeholder image for branding or app info.  
- [x] Login placeholder – `index.html` has a minimal login form with username/password fields and a submit button.  
- [x] DB data placeholder – `analytics.html` will eventually display player activity data fetched from an API (now mocked as insult responses).  
- [x] WebSocket placeholder – `col-map.html` has a live activity section where dynamic updates will appear in the future.

## 🚀 CSS deliverable  
For this deliverable I did the following. I checked the box [x] and added a description for things I completed.

- [x] Header, footer, and main content body – Created a common CSS file `main.css` for global layout, including flexbox for vertical and horizontal alignment. Footer is pinned to the bottom with proper styling.  
- [x] Navigation elements – Styled header navigation links consistently across all pages, including hover effects and active states.  
- [x] Responsive to window resizing – Flexbox and responsive width settings ensure all pages adapt to mobile and desktop views.  
- [x] Application elements – Used flex containers and gap/padding to align forms, analytics cards, and page sections.  
- [x] Application text content – Applied `system-ui` font with color schemes consistent across all pages (#fff text on #343897 background).  
- [x] Application images – About page image is centered and responsive.  
- [x] Login page styling – Minimal login page uses consistent colors, borders, hover effects, and form alignment with the rest of the site theme.  
- [x] API analytics page styling – `analytics.html` has placeholder cards styled with flexbox, background colors, and consistent typography ready for dynamic insult API data.

## React Phase 1: Routing deliverable

For this deliverable I converted my static HTML application into a React single-page application (SPA) with client-side routing. The application now uses React components and React Router to handle navigation without full page reloads.

- [x] I completed the prerequisites for this deliverable (deployed to Simon, GitHub link present, Git commits made)

- [x] Bundled using Vite - The frontend was scaffolded using Vite, which provides fast builds, hot module replacement (HMR), and optimized production bundling.

- [x] Components - The application is organized into reusable React components, including:
  - App - Root component responsible for defining routes and overall layout.
  - Header and Footer - Shared layout components displayed across all routes.
  - Home - Landing page introducing RaidBuddy and displays available raids and links to detailed guide views.
  - Map - Placeholder for the collaborative raid map interface.
  - Analytics - New insult generator feature (replacing Bungie API analytics).
  - About - Information about the application and its purpose.
  - Login - Login page

- [x] Router - Implemented client-side routing using react-router-dom. The following routes are configured:
  - / -> Home
  - /{raid name} -> Relevant raid guide page
  - /map -> Collaborative map page
  - /analytics -> Random insult generator page
  - /about -> About page
  - /login -> Login page

Navigation links in the header allow seamless transitions between pages without reloading the browser.

- [x] Shared layout structure - The Header and Footer components persist across all routes, while routed components render inside the main content area.

- [x] Placeholder integration for future phases:
  - The Map page contains structural placeholders for future WebSocket-based real-time collaboration.
  - The Analytics page now contains a single button to fetch a random insult from a public API.

## React Phase 2: Interactivity

For this deliverable I implemented client-side interactivity using React so that the application fully works for a single user. I also added placeholders and mocked functionality for future backend integration.

- [x] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [x] All functionality implemented or mocked out – Users can select a map, draw on it, generate a join code, and join an existing session to view the same drawing. Multiplayer functionality is mocked using localStorage. The analytics page now fetches and displays random insults from a third-party API when the button is clicked.
- [x] Hooks – Used useState for UI state management, useEffect for canvas initialization and image loading side effects, and useRef for persistent canvas references.

## Service deliverable

For this deliverable I added a backend endpoint that fetches a random insult from a third-party API and returns it to the frontend.

- [x] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [x] **Node.js/Express HTTP service** – Added an endpoint `/api/insult` that calls a public insult API via fetch and returns the JSON response.  
- [x] **Frontend call to backend** – The analytics page (`Analytics.jsx`) now fetches the insult through this endpoint when the user presses the “Get Insult” button.  
- [x] **Static middleware** – Frontend served via Express static middleware.  
- [x] **Backend service endpoints** – Endpoint implemented and tested; returns a single random insult each call.  
- [x] **Frontend calls service endpoints** – Logistics of code generation and line tracking as well as login auth are now handled by api endpoints and stored in the backend.  
- [x] **Supports registration, login, logout, and restricted endpoint** – Register/login/logout remain functional, now handled by endpoint calls, auth data is stored in backend for now. Maps page is now restricted behind login. 
- [x] **Uses BCrypt to hash passwords** – Passwords secured!


## DB/Login deliverable

For this deliverable I now store maps with their associated drawings and codes in the db. User data is also stored in the db.

- [x] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [x] **Stores data in MongoDB** - Stores map information (image, lines, code). See database.js
- [x] **Use MongoDB to store credentials** - Stores user and credentials. See database.js

## WebSocket

For this deliverable, I implemented a WebSocket-based system to synchronize drawing data between users in real time, enabling collaborative map editing.

- [x] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [x] **Backend listens for WebSocket connections** – See `index.js`
- [x] **Frontend establishes a WebSocket connection** – See `colMap.jsx`
- [x] **Data transmitted over WebSocket** – Drawing events (line updates) are sent through the socket (see `index.js`)
- [x] **WebSocket data rendered in frontend** – Incoming updates are applied immediately, keeping canvases in sync across users

Real-time drawing synchronization is fully functional. I'm especially pleased with how responsive and seamless the collaboration feels, and I plan to expand this further as more map data is added.