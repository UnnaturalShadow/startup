# FlushCode: Bathroom Code Crowdsourcing App
This website allows users to circumvent those who would try to keep them from using the bathroom with pesky key-code door locks, by crowd sourcing a database of bathroom door codes and making them available to users for free. It implents IP address location lookup and mapping API's to allow users to find bathroom codes near their location, or search for them by place name. User's that create accounts can also contribute to the project, allowing them to add codes to the database. Users that add lots of codes will earn prestige, adding to their total score which can be seen on the leaderboard. 

## Deliverable 1: Project Specification

### Elevator pitch
Have you ever been out eating dinner, gotten up to go to the bathroom, only to find that the door is locked behind a keypad? Now you could go interrupt an employee who is busy trying to make orders during the dinner rush, becoming a bother to all the hungry people in line, or you could use FlushCode to avoid all that and find out the code on your own in seconds!

### Design

![image](html-files/images/sketch.JPG)

### Key features
- Secure login over HTTPS
- Ability to view a map localized to your location based on IP
- Localized lookup based on location from IP
- Ability to contribute codes and earn prestige for it
- Leaderboard of top contributers
- Lets users avoid talking to employees!
- Codes stored in persistent database, including old/outmoted codes


### Technologies
I am going to use the required technologies in the following ways:

- HTML - Provides the base HTML structure to load the application. Three HTML pages. One for login, one with the map for finding codes, and one for adding codes.
- CSS - Application styling that looks good on different screen sizes using responsive layouts, uses good whitespace, color choice and contrast, as well as simple animations. 
- React - Provides frontend for login, code display, code submission, user leaderboard. React state and hooks will be used to handle user authentication state, form input, and dynamic updates to displayed data.
- Service - Backend service with endpoints for:
  - login
  - retrieving codes
  - submitting codes
  - retrieving prestige and leaderboard status
- DB/Login - Store users, codes, and votes in database. Register and login users. Credentials securely stored in database. Can't submit codes unless authenticated.
- WebSocket - Provides real-time updates from the backend to connected clients. When users submit new codes or earn prestige, leaderboard updates will be pushed instantly to all users without requiring a page refresh.

## HTML Deliverable

For this deliverable I built out the structure of my application using HTML.

- [x] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [x] HTML pages - Five HTML page that represent the ability to login view codes, submit codes, view scoreboard, and read about the project.
- [x] Proper HTML element usage, including body, main, header, footer, form, etc.
- [x] Links - The login page automatically links back to the home page. The home page contains links to login, code submission, and about.
- [x] Text - Text is included in small doses throughout, sufficient for this check box but otherwise minimal due to the nature of the application. 
- [x] 3rd party API placeholder - I put a very lovely image of google maps where the maps api will go. As for the IP api, since that will simply take info and pass it directly back to maps, I didn't include a visual placeholder for that, as it won't end up being visble. 
- [x] Images - I have an image, its my placeholder map! I also made the little web icon be a toilet. 
- [x] DB/Login - Input box and submit button for login. Another set of inputs and submit button for code submission.
- [x] WebSocket - The scoreboard will keep a realtime tally of player reputation. 
