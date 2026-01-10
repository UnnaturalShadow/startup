# Bathroom Code Crowdsourcing App
This website allows users to circumvent those who would try to keep them from using the bathroom with pesky key-code door locks, by crowd sourcing a database of bathroom door codes and making them available to users for free. It implents IP address location lookup and mapping API's to allow users to find bathroom codes near their location, or search for them by place name. User's that create accounts can also contribute to the project, allowing them to add codes to the database. Users that add lots of codes will earn prestige, adding to their total score which can be seen on the leaderboard. 

## Deliverable 1: Project Specification

### Elevator pitch
Have you ever been out eating dinner, gotten up to go to the bathroom, only to find that the door is locked behind a keypad? Now you could go interrupt an employee who is busy trying to make orders during the dinner rush, becoming a bother to all the hungry people in line, or you could use FlushCode to avoid all that and find out the code on your own in seconds!

### Design

![image](sketch.JPG)

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
