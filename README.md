# Bathroom Code Crowdsourcing App
This website allows users to circumvent those who would try to keep them from using the bathroom with pesky key-code door locks, by crowd sourcing a database of bathroom door codes and making them available to users for free. It implents IP address location lookup and mapping API's to allow users to find bathroom codes near their location, or search for them by place name. User's that create accounts can also contribute to the project, allowing them to add codes to the database. Users that add lots of (accurate) codes will earn prestige, adding to their total score which can be seen on the leaderboard. 

## Deliverable 1: Project Specification

### Elevator pitch
Have you ever been out eating dinner, gotten up to go to the bathroom, only to find that the door is locked behind a keypad? Now you could go interrupt an employee who is busy trying to make orders during the dinner rush, becoming a bother to all the hungry people in line, or you could use (product name here) to avoid all that and find out the code on your own in seconds!

### Design

### Key features
Secure login over HTTPS
Ability to view a map localized to your location based on IP
Localized lookup based on location from IP
Ability to contribute codes and earn prestige for it
Leaderboard of top contributers
Lets users avoid talking to employees!
Codes stored in persistent database, including old/outmoted codes


### Technologies
I am going to use the required technologies in the following ways:

HTML - Uses correct HTML structure for application. Three HTML pages. One for login, one with the map for finding codes, and one for adding codes.
CSS - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
React - Provides login, code display, code submission, user leaderboard, and use of React for routing and components.
Service - Backend service with endpoints for:
login
retrieving codes
submitting codes
retrieving vote status
DB/Login - Store users, choices, and votes in database. Register and login users. Credentials securely stored in database. Can't vote unless authenticated.
WebSocket - Lets users add codes, their votes are broadcast to all other users.
Deployment instructions
Clone this repository to your development environment.

Create a dbConfig.json file that contains the credentials to access your Mongo Database. This must be placed in the root of the project.

{
  "hostname": "YourMongoDbAccount.xiu1cqz.mongodb.net",
  "userName": "YourMongoDbUsername",
  "password": "YourMongoDbPassword"
}
NPM install both the frontend and backend dependencies.

npm install
cd ui
npm install
cd ..
Use the deploy.sh shell script to deploy Voter to an EC2 instance. You will need the PEM key in order to run the script.

./deploy.sh -k ~/keys/yourkeyhere.pem -h yourdomainnamehere.click
Verify that the application is running on the domain.

curl startup.cs260.click
Optional: If you want to modify the candidates that are currently voted on then alter finalists.json. The format of the file is as follows:

{
  "candidate": [{ "name": "Meg", "url": "https://game.com", "votes": 0, "id": "game" }]
}
You can update the candidates with the following endpoint call:

curl -X PUT localhost:4000/api/candidate -H "Content-Type:application/json" --data '@finalists.json'
HTML deliverable
For this deliverable I built out the structure of my application using HTML.

 HTML pages - Two HTML page that represent the ability to login and vote.
 Links - The login page automatically links to the voter page. The voter page contains links for every voting choice.
 Text - Each of the voting choices is represented by a textual description.
 Images - I couldn't figure out how to include an image and so I didn't do this. 😔
 DB/Login - Input box and submit button for login. The voting choices represent data pulled from the database.
 WebSocket - The count of voting results represent the tally of realtime votes.
CSS deliverable
For this deliverable I properly styled the application into its final appearance.

 Header, footer, and main content body
 Navigation elements - I dropped the underlines and changed the color for anchor elements.
 Responsive to window resizing - My app looks great on all window sizes and devices
 Application elements - Used good contrast and whitespace
 Application text content - Consistent fonts
 Application images - Still don't have images and so no styling here. 😔
React Phase 1: Routing deliverable
For this deliverable I used JavaScript and React so that the application completely works for a single user. I also added placeholders for future technology.

 Bundled using Vite - So amazing what Vite does. Bundling, transpiling, minifying, and HMR.

 Components - I have three components: The app, the ballot items, and a bouncy ball.

 Router - Routing between login and voting components.

 Bundled and transpiled - done!

 Components - Login, voting list, vote are all components with mocks for login, WebSocket.

 login - When you press enter or the login button it takes you to the voting page.
 database - Displayed the voting counts. Currently this is stored and retrieved from local storage, but it will be replaced with the database data later.
 WebSocket - I used the setInterval function to periodically increase a random vote count. This will be replaced with WebSocket messages later.
 application logic - The highlight and ranking number change based up the user's selections.
 Router - Routing between login and voting components.

 Hooks - Vue uses class properties instead of UseState to track changes in vote state.

React Phase 2: Reactivity deliverable
For this deliverable I used JavaScript and React so that the application completely works for a single user. I also added placeholders for future technology.

 All functionality implemented or mocked out - Everything is working! Votes stored in local storage. setInterval used to simulate peer voting.
 Hooks - Used useState and useEffect on the voter view.
Service deliverable
For this deliverable I added backend endpoints that receives votes and returns the voting totals.

 Node.js/Express HTTP service - done!
 Static middleware for frontend - done!
 Calls to third party endpoints - I didn't have time to implement this. 😔
 Backend service endpoints - Placeholders for login that stores the current user on the server. Endpoints for voting.
 Frontend calls service endpoints - I did this using the fetch function.
 Supports registration, login, logout, and restricted endpoint - Login only exists on the frontend.
DB/Login deliverable
For this deliverable I associate the votes with the logged in user. I stored the votes in the database.

 Stores data in MongoDB - done!
 Use MongoDB to store credentials - Stores both user and their votes.
WebSocket deliverable
For this deliverable I used webSocket to update the votes on the frontend in realtime.

 Backend listens for WebSocket connection - done!
 Frontend makes WebSocket connection - done!
 Data sent over WebSocket connection - done!
 WebSocket data displayed - All user votes display in realtime. I'm really proud that this is working. Way cool! 🎉 I'm going to celebrate with my bestie over waffles!
