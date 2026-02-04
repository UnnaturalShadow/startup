# RaidBuddy: Destiny 2 Raid Guide and Collaborative Map Tool

RaidBuddy is a web application designed to help Destiny 2 players plan, coordinate, and execute raids. It provides interactive raid maps, step-by-step guides, and collaborative annotation features so fireteams can strategize in real-time. Users can view detailed guides for each raid, see maps for specific encounters, and work together to annotate those maps to explain tactics and positions.

## Deliverable 1: Project Specification

### Elevator pitch
Ever tried tackling a Destiny 2 raid without a clear plan and ended up wiped multiple times? RaidBuddy is here to help. With interactive guides, annotated maps, and collaborative drawing features, fireteams can plan strategies, assign roles, and visualize encounter mechanics — all in one place. Whether you’re learning the raid for the first time or coordinating a top-tier team, RaidBuddy makes raids easier, faster, and more fun.

### Design

![image](html-files/images/sketch.JPG)  
*Placeholder sketch for layout of home page, map page, and guide pages.*

### Key features
- Detailed written guides for all Destiny 2 raids  
- Interactive maps for raid encounters  
- Collaborative real-time annotations via WebSockets  
- Ability to create or join a map with a code  
- Integration with Bungie API for analytics on your fireteam’s raids  
- Responsive design that works on desktops, tablets, and mobile devices  
- Clear navigation between home, guides, maps, analytics, and about pages  

### Technologies
I am going to use the required technologies in the following ways:

- **HTML** – Basic structural and organizational elements for all pages, including home, about, raid guides, collaborative maps, and analytics pages.  
- **CSS** – Styling and animating the application, including responsive layouts, color schemes, spacing, typography, hover effects, and interactive elements like raid tiles and buttons.  
- **React** – Componentization, routing, and user reactivity using the React framework and JavaScript. React will handle switching between raid guides, rendering collaborative map components, and updating UI in response to real-time events.  
- **Web service** – Endpoints provided by the backend service that support application-specific functionality, such as creating or joining collaborative maps, saving and retrieving annotations, and fetching raid guide content. Also includes integration with a third-party API: [Bungie API](https://www.bungie.net/platform) for player analytics and raid stats.  
- **Database** – Store authentication data (if added later) and persistent application data, such as map states, annotations, and user-generated guides.  
- **WebSocket** – Real-time information pushed from the backend to the frontend, enabling live collaborative annotation of raid maps and instant updates for all connected users.

## 🚀 HTML deliverable  
For this deliverable I did the following. I checked the box [x] and added a description for things I completed.

- [x] HTML pages – Created multiple pages: `index.html` (Login placeholder), `play.html` (API analytics display), `scores.html` (player stats placeholder), and `about.html`. Each page has a header, main, and footer structure.  
- [x] Proper HTML element usage – Used semantic elements including `header`, `footer`, `main`, `nav`, `form`, `label`, `input`, `button`, and `a`. The login form uses proper input types and labels for accessibility.  
- [x] Links – Footer and header allow navigation between pages.  
- [x] Text – Pages include descriptive text placeholders for analytics, player stats, and information about the app.  
- [x] 3rd party API placeholder – `play.html` has a structured area for Bungie API analytics such as recent activities, kills, deaths, and completion times.  
- [x] Images – About page has a placeholder image for branding or app info.  
- [x] Login placeholder – `index.html` has a minimal login form with username/password fields and a submit button.  
- [x] DB data placeholder – `scores.html` will eventually display player activity data fetched from the API.  
- [x] WebSocket placeholder – `play.html` has a live activity section where dynamic updates will appear in the future.


## 🚀 CSS deliverable  
For this deliverable I did the following. I checked the box [x] and added a description for things I completed.

- [x] Header, footer, and main content body – Created a common CSS file `main.css` for global layout, including flexbox for vertical and horizontal alignment. Footer is pinned to the bottom with proper styling.  
- [x] Navigation elements – Styled header navigation links consistently across all pages, including hover effects and active states.  
- [x] Responsive to window resizing – Flexbox and responsive width settings ensure all pages adapt to mobile and desktop views.  
- [x] Application elements – Used flex containers and gap/padding to align forms, analytics cards, and page sections.  
- [x] Application text content – Applied `system-ui` font with color schemes consistent across all pages (#fff text on #343897 background).  
- [x] Application images – About page image is centered and responsive.  
- [x] Login page styling – Minimal login page uses consistent colors, borders, hover effects, and form alignment with the rest of the site theme.  
- [x] API analytics page styling – `play.html` has placeholder cards styled with flexbox, background colors, and consistent typography ready for dynamic API data.
