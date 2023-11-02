## Doshii Code Challenge - Web Application

Create a simple Dockerised application to manage members and rewards. The model for members and rewards are entirely up to you.
The application can be written in either JavaScript or TypeScript with a framework of your choosing.
The data can be stored in any source using an existing Docker container image.

### Must have:
The Nodejs application containing endpoints to manage CRUD operations:
- [x] Members
  - [x] Retrieve a member by email
  - [x] Option to include associated rewards in the response
  - [x] Option to specify which member properties to return
- [x] Rewards
- [x] Associate/dissociate a reward to a member

### Nice to have:
- [x] Ability to search members
- [x] Ability to search rewards
- [ ] Supporting unit and integration tests
  - I initially planned to write some unit tests and structured the backend to
    allow for easy mocking, though I chose to allocate time elsewhere.

#### A complete solution should have the following:
- [x] NodeJS applicaiton
- [x] An SQL/noSQL database (SQLite)
- [x] Runnable in a Docker container

## Solution

### Software Requirements
- NodeJS 21
- Yarn

### Installation instructions
```sh
# Build the container
docker build -t rewards-app .

# Run it
docker run -p 3000:3000 -p 3030:3030 rewards-app
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3030`

### Assumptions made about the requirements of the task
I assumed that this hypothetical solution was going to be an additional
micro-service to an existing platform. I saw it necessary to keep information
minimal as user data probably exists elsewhere. I assumed this was for some
type of online storefront.

Additionally, I believed there was a need for a management console for customer
support in the event of technical issues, so I provided a basic frontend to
achieve this.

As for the rewards, I thought assigning rewards to users was not a full use
case so I opted to allow rewards to be applied to a user, which could then be
claimed or revoked. If a user claims a reward, it has to be before the reward
expires. Having an expiry made sense because some rewards will likely be time
sensitive and users should not be able to claim rewards relating to products
that are no longer available.

### Anything you believe is important but out of scope or unnecessary
Had this been a real-world application I would have opted to use different
technologies based on the context and time-constraints.

I chose in-memory SQLite for its astounding performance and simplicity in
implementation and because I thought having to setup an entire SQL/NoSQL
database was unnecessary for the purposes of a tech challenge. It's for this
reason I did not think persistence was necessary and I wanted to avoid
spending time messing with volumes in Docker.

For the backend itself, I decided to make a basic REST API with ExpressJS. I
considered using GraphQL but deemed it to be overkill for the majority of the
application. The `/search/users` and `/users/get-by-email/` would have
benefited from GraphQL's ability to have optional fields. Instead I chose to
write some cursed SQL to achieve this, which in hindsight could have been
avoided.

I wanted to add the ability for adding server hooks so that when actions like a
reward being claimed occur they can fire off requests to other microservices to
enable enhanced functionality while remaining completely decoupled.

There were a few endpoints where I was having to spend too much time debugging
SQL argument binding and instead opted to do direct string replacement. In a
real world scenario, this would be a very bad idea as it creates a vector for
SQL injection but I chose to forego this to get it done quickly.

Lastly, all the endpoints are unsecured using HTTP and no form of
authentication. If I were to do this securely, I would implement OAuth and use
JWTs to authenticate the endpoints and ideally make them capabilities secure so
only JWTs with the correct capabilities can call certain endpoints.

#### We value
 - Good application design
 - Clear and readable code
 - Tests and testable code
 - Decent performance

We would prefer if you created a publicly available repository for the completed work.
