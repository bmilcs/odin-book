# FriendLink: A Facebook Clone

The final project of the Odin Project tasks you with creating a social media clone. I used the following technology to develop this app:

**Frontend**:

- Vite: React + TypeScript + SWC
- Shadcn UI: React Component Library
  - Zod
  - React Hook Form
- Tailwind CSS
- React Router DOM
- ESLint / Prettier

**Backend**:

- MongoDB / Mongoose
- NodeJS
- Express
- JSON Web Tokens
- Express Validator
- CORS
- Helmet / Compression
- Cookie-Parser / Body-Parser
- Chai / Mocha / Supertest

## High Level Overview

Tackling a project of this magnitude required a good deal of planning. Here are some of the steps I took while whiteboarding:

1. Crafted data models for the database:

   > User model, post model, like model, comment model, etc.

2. Laid out the server file structure with placeholder routes, controllers, etc.
3. Expanded upon the default Express response objects (`res`) to **achieve consistent API responses to the client**:

   > All API responses follow the following pattern:

   ```js
   {
     'success': boolean,
     'message': string,
     'data': any,
     'error': any,
   }
   ```

   Instead of defaulting to the built-in `res.json()` method, I added the following custom methods to the `res` object:

   - `res.success`: accepts 3 arguments (message, data, statusCode) and returns response to client in JSON format

   - `res.error`: accepts 3 arguments (message, error, statusCode) and returns response to client in JSON format

4. Designed an error handling system to take advantage of the `next()` function in Express

   - Created custom error classes:

     - `AppError` Class: generic errors that occur through the app get thrown as an AppError. These contain a message, statusCode & name value.
     - `ValidatorError` Class: extend the `AppError` class, defaulting to a statusCode of 400 & name of ValidationError

   - Created middleware for catching and handling errors based on the type of error instance:

     1. `errorLogger`: logs all error messages, except for validation errors
     2. `errorResponder`: formats all errors in a consistent format based on the `typeof` error object and sends responses to the client using the `res.error` method.
     3. `invalidPathHandler`: generic 404 error catching

5. To ensure a quality end product, I opted to use **Test Driven Development** (TDD) on the backend. I went through each route, wrote tests that fail and developed controller functions to make them pass.

## **TODO**

- Explain JSON Web Token Auth
  - Custom `res.addJWTCookies` method
  - Middleware for attaching `userId` to `req` objects
  - `ensureAuthenticated` middleware

## Lessons Learned

### Custom Hooks and State Instances

During the development of FriendLink, I had an interesting encounter with custom hooks. I initially assumed that when multiple components use a custom hook, they would all share a single instance of the state created within that hook. However, I learned that this isn't the case.

In reality, each component that uses a custom hook gets its own separate instance of the state. This means that if you have a custom hook `useFeed`, and two different components `ComponentA` and `ComponentB` both use this hook, they will each have their own separate `feed` state. Any changes to the `feed` state in `ComponentA` will not affect the `feed` state in `ComponentB`, and vice versa.

This is because hooks in React are tied to the component where they are called. Each component instance maintains its own state and lifecycle, and hooks are a part of that. When a component uses a hook, it's like it's creating a private instance of that hook for itself.

So, if you want to share state between multiple components, you'll need to lift the state up to a common ancestor component, or use a context. This was a key lesson for me in understanding how state and hooks work in React.

My final solution was to create a context provider. This allowed me to share the `feed` state across multiple components, solving the issue I was facing.
