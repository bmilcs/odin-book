# FriendLink: A Facebook Clone

## Lessons Learned

### Custom Hooks and State Instances

During the development of FriendLink, I had an interesting encounter with custom hooks. I initially assumed that when multiple components use a custom hook, they would all share a single instance of the state created within that hook. However, I learned that this isn't the case.

In reality, each component that uses a custom hook gets its own separate instance of the state. This means that if you have a custom hook `useFeed`, and two different components `ComponentA` and `ComponentB` both use this hook, they will each have their own separate `feed` state. Any changes to the `feed` state in `ComponentA` will not affect the `feed` state in `ComponentB`, and vice versa.

This is because hooks in React are tied to the component where they are called. Each component instance maintains its own state and lifecycle, and hooks are a part of that. When a component uses a hook, it's like it's creating a private instance of that hook for itself.

So, if you want to share state between multiple components, you'll need to lift the state up to a common ancestor component, or use a context. This was a key lesson for me in understanding how state and hooks work in React.

My final solution was to create a context provider. This allowed me to share the `feed` state across multiple components, solving the issue I was facing.
