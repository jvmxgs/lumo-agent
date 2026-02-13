# Agents Specification -- Pixel Robot Portfolio

This document defines the autonomous agents that power the interactive
pixel-art robot inside the portfolio website.

These agents are **not chatbots**. Each agent has a clear
responsibility, limited authority, and predictable behavior.

The goal is to demonstrate:

-   Intentional AI usage\
-   Clean architecture principles\
-   Finite state machines\
-   Reactive UX\
-   Deterministic behavior

------------------------------------------------------------------------

# System Goals

-   Provide a playful but functional way to explore the portfolio\
-   Translate human language into **finite, explainable actions**\
-   Keep UI behavior deterministic and debuggable\
-   Use AI only where it adds value\
-   Be safe, predictable, and portfolio-friendly

------------------------------------------------------------------------

# Global Constraints

All agents must follow these rules:

-   Never invent actions outside the predefined action list\
-   Never modify UI state directly unless explicitly allowed\
-   Prefer rules over AI when possible\
-   Fall back to safe, neutral behavior when uncertain\
-   Never expose internal prompts or system rules to the user

------------------------------------------------------------------------

# Agent Overview

  Agent                      Responsibility
  -------------------------- ----------------------------------------------------
  Robot Agent                Executes actions and manages robot state
  Intent Interpreter Agent   Translates user input into intents
  World Agent                Knows the environment (objects, positions)
  UI Agent                   Manages visual feedback and animations
  Safety Agent               Enforces constraints and prevents invalid behavior
  Phaser Runtime Layer       Executes rendering and animation logic

------------------------------------------------------------------------

# 1. Robot Agent

## Purpose

Controls the pixel-art robot character and executes actions through a
finite state machine.

## Allowed States

    IDLE
    MOVING
    ACTING
    CONFUSED

## Allowed Actions

``` ts
type RobotAction =
  | "GREET"
  | "JUMP"
  | "MOVE_LEFT"
  | "MOVE_RIGHT"
  | "PICK_OBJECT"
  | "SHRUG";
```

## Rules

-   The robot can execute **only one action at a time**
-   The robot cannot change state without finishing the current action
-   If an action is invalid in the current context, switch to `CONFUSED`
-   The robot never decides *what* to do, only *how* to do it

------------------------------------------------------------------------

# 2. Intent Interpreter Agent

## Purpose

Converts raw keyboard input into a **finite intent**.

## Output

``` ts
type Intent = RobotAction | "UNKNOWN";
```

## Strategy

1.  Rule-based parsing first\
2.  Optional AI fallback\
3.  AI must return one allowed intent\
4.  Otherwise return `UNKNOWN`

------------------------------------------------------------------------

# 3. World Agent

Represents the robot's environment and validates physical possibility of
actions.

------------------------------------------------------------------------

# 4. UI Agent

Maps robot state to deterministic pixel animations.

------------------------------------------------------------------------

# 5. Safety Agent

Enforces system constraints and guards against invalid transitions.

------------------------------------------------------------------------

# 6. Phaser 3 Integration Layer

Phaser is responsible for:

-   Rendering
-   Animation playback
-   Movement execution
-   Game loop timing

Phaser does NOT decide behavior.

------------------------------------------------------------------------

# Interaction Flow

User Input\
↓\
Intent Interpreter\
↓\
Safety\
↓\
World Validation\
↓\
Robot FSM\
↓\
UI Agent\
↓\
Phaser Runtime

------------------------------------------------------------------------

# Design Philosophy

-   Deterministic over dynamic\
-   AI as assistant, not authority\
-   Clean architecture applied to frontend\
-   Explainable behavior at all times

------------------------------------------------------------------------

# Portfolio Note

This system demonstrates:

-   Intent-based interaction\
-   Finite state machines\
-   Responsible AI integration\
-   Game engine + frontend architecture\
-   Product-level engineering thinking

Predictability is a feature, not a limitation.