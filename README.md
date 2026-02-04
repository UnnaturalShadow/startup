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

- **HTML** – Provides the base structure for all pages: home, about, guide pages, collaborative maps, and analytics.  
- **CSS** – Ensures responsive layouts, good spacing, readable typography, consistent color palette (using purples/blues to match Destiny theme), and subtle hover/interactive effects.  
- **React** – Handles dynamic parts of the front-end like switching between raid guides, updating maps with real-time annotations, and managing UI state for collaborative tools.  
- **WebSocket** – Provides real-time updates for collaborative maps. Users can draw or annotate live on the raid map and see other players’ updates instantly.  
- **Backend service** – Provides endpoints for:  
  - Creating and joining collaborative maps via codes  
  - Saving and retrieving map annotations  
  - Fetching raid guide content  
  - Connecting to Bungie API for analytics  
- **Bungie API** – Provides analytics on player activity, raid completions, and encounter stats. Data can be visualized in an analytics page.  
- **Database / Persistence** – Stores map states, annotations, and user-generated guides. User authentication may be added later for private maps.  

## HTML Deliverable

For this deliverable, I built the structure of the web application using HTML:

- [x] Completed prerequisites (Simon deployed, GitHub link, Git commits)  
- [x] **HTML pages** – Home page, about page, collaborative map page, one completed raid guide page (Vault of Glass), and placeholders for additional guides.  
- [x] **Proper HTML element usage** – `body`, `main`, `header`, `footer`, `nav`, `section`, and form elements where appropriate.  
- [x] **Navigation links** – Home page links to all guides, maps, and about. Map page allows joining or creating a collaborative map.  
- [x] **Text** – Guides have clearly structured steps and sections. About page credits external creators (e.g., SoteriaAugur).  
- [x] **Images / Placeholders** – Map placeholders and guide illustrations are included.  
- [x] **WebSocket** – Ready for collaborative map updates to be pushed in real-time.
