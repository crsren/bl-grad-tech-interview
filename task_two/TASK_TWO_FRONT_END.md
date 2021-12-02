# Task 2 - Where's my Robot? (FRONT-END)

## Introduction

- 😍 Make sure to comment your code and include any assumptions you make in your README. Also provide instructions on how to run the project and any other notes about your solution you want to share.
- 🤩 This task should be completed in React - feel free to use `functional components/hooks` or whatever else you're most comfortable with!
- 🤨 You can also use a starter kit like Create React App or state management libraries like redux to save time (if you wish).
- 🤗 UI is great but a clean layout and typography will do.
- 🧐 We’re most interested to see problem solving and your approach… also, ES6 please.
- 😇 Keep it simple, keep it DRY, but do`n’t over complicate or over engineer, comment and test as much as possible.
- 🤓 Commit your code to a public Git repository and send us with the URL when you're finished!

## Brief

You have a toy robot on a table top. The table top is 5 x 5 unit grid with no obstructions. You can issue commands to your robot so it can roam around the table top. But, be careful, don't let it fall off!

Create an app that allows commands to be issued to the robot. The robot should be prevented from falling off the table top to its destruction.

A failed command should not stop the app, valid commands should be allowed.

The application should discard all commands until a valid `place()` command has been executed.

`0, 0` on the grid should be seen as bottom left.

## Input

Every command should provide visual output that the command has either succeeded or failed.

- `place(x, y, facing)`: `x` and `y` are integers that relate to a location on the grid. Values that are outside the boundary of the grid should not be allowed. `facing` is a string referencing the direction the robot is facing. Values `NORTH`, `SOUTH`, `EAST` or `WEST` are allowed.
- `move()`: Moves the robot 1 grid unit in the direction it is facing unless that movement will cause the robot to fall off the grid.
- `left()`: Rotate the robot 90° anticlockwise/counterclockwise.
- `right()`: Rotate the robot 90° clockwise.
- `report()`: Outputs the robot's current grid location and facing direction.

## Output

- `place(0, 0, 'NORTH')`
- `move()`
- `report() => Output: 0, 1, NORTH`
- `place(0, 0, NORTH)`
- `left()`
- `report() => Output: 0, 0, WEST`
- `place(1, 2, EAST)`
- `move()`
- `move()`
- `left()`
- `move()`
- `report() => Output: 3, 3, NORTH`
