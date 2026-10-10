# Frienemie Assignment Tracker

Frienemie is a personal coursework tracker built with React, Vite, Express, and MongoDB. Students can organize assignments by course, record due dates and priority, track submission status, and save marks after grading.

## Features

- Email and Google sign-in with Firebase
- Personal assignment list connected to the signed-in account
- Assignment types for homework, essays, projects, quizzes, exams, labs, and other work
- Submission workflow: not started, in progress, submitted, and graded
- Due this week and overdue summaries, plus filters by course and status
- Record points earned and possible; view the average across graded assignments
- Search, notes, edit, and delete support
- Optional 25-minute focus sprint timer with a daily session count

## Run locally

Install dependencies in both `Frontend` and `Server`, configure the Firebase client settings and backend environment values, then start the Vite frontend and Express API. The backend expects `Url` for the MongoDB connection and `Port` for its listening port. The frontend API URL is configured in `Frontend/src/utils/env.js`.

Each assignment stores a title, course, type, due date, status, priority, optional marks and notes, and the owning Firebase user ID.
